import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { abstract, track } = await request.json();

    if (!abstract) {
      return NextResponse.json(
        { error: 'Abstract is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `Based on this session abstract, generate 3 compelling, professional conference session titles. Each title should be:
- 20-70 characters
- Action-oriented and engaging
- Clear about the session value
- Professional and specific

Abstract: ${abstract}
Track: ${track || 'General'}

Respond with JSON array of 3 titles:
["Title 1", "Title 2", "Title 3"]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a conference content expert who writes engaging session titles.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 503 }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON array from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const titles = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ titles });
  } catch (error) {
    console.error('AI generate title error:', error);
    return NextResponse.json(
      { error: 'Failed to generate titles' },
      { status: 500 }
    );
  }
}