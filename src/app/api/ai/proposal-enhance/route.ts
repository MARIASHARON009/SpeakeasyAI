import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { title, abstract, track } = await request.json();

    if (!title && !abstract) {
      return NextResponse.json(
        { error: 'At least title or abstract is required' },
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

    const prompt = `You are a professional conference program committee member reviewing session proposals. Analyze this proposal and provide detailed, actionable feedback.

Title: ${title || 'Not provided'}
Abstract: ${abstract || 'Not provided'}
Track: ${track || 'Not specified'}

Provide your response in JSON format with these fields:
{
  "score": <number 0-100>,
  "strengths": [<array of 2-4 specific strengths>],
  "suggestions": [<array of 2-4 actionable improvements>],
  "improved_title": "<optional: suggest a better title if needed>",
  "improved_abstract": "<optional: suggest key improvements to abstract>"
}

Be specific, constructive, and professional. Focus on clarity, audience value, and engagement.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert conference program reviewer.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
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
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const feedback = JSON.parse(jsonMatch[0]);

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('AI proposal enhance error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}