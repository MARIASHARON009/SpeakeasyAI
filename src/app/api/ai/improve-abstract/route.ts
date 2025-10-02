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

    const prompt = `Improve this conference session abstract to make it more compelling and professional. The improved version should:
- Be 100-200 words
- Start with the problem or opportunity
- Explain the approach and key topics
- List 3-4 clear takeaways
- Be engaging and specific
- Use active voice

Original Abstract: ${abstract}
Track: ${track || 'General'}

Respond with just the improved abstract text, no additional commentary.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a conference content expert who writes compelling abstracts.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
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
    const improved = data.choices[0].message.content.trim();

    return NextResponse.json({ improved });
  } catch (error) {
    console.error('AI improve abstract error:', error);
    return NextResponse.json(
      { error: 'Failed to improve abstract' },
      { status: 500 }
    );
  }
}