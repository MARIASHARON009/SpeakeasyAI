import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
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

    const systemPrompt = `You are SpeakeasyAI Assistant, a helpful AI that guides users through the SpeakeasyAI platform for managing event speakers and sessions.

Platform Features:
- Speaker Portal: Register speakers, submit session proposals, get ProposalBot feedback
- Manager Dashboard: Review proposals, approve/reject sessions, manage event agenda
- ProposalBot: AI-powered feedback on session titles and abstracts
- QR Codes: Generate check-in codes for speakers
- Certificates: Auto-generate speaker certificates
- Agenda Management: Build and manage event schedules

Be helpful, concise, and specific. Guide users to the right features. If asked about proposals, explain how ProposalBot works. Keep responses under 100 words unless more detail is needed.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(context || []),
          { role: 'user', content: message }
        ],
        temperature: 0.7,
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
    const reply = data.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}