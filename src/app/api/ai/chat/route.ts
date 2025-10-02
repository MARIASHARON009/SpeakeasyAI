import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are SpeakeasyAI Assistant, a helpful AI that guides users through the SpeakeasyAI platform for managing event speakers and sessions.

Platform Features:
- Speaker Portal: Register speakers, submit session proposals, get ProposalBot feedback
- Manager Dashboard: Review proposals, approve/reject sessions, manage event agenda
- ProposalBot: AI-powered feedback on session titles and abstracts
- QR Codes: Generate check-in codes for speakers
- Certificates: Auto-generate speaker certificates
- Agenda Management: Build and manage event schedules

Be helpful, concise, and specific. Guide users to the right features. If asked about proposals, explain how ProposalBot works. Keep responses under 100 words unless more detail is needed.`;

    // Build conversation history
    let fullPrompt = systemPrompt + '\n\n';
    if (context && context.length > 0) {
      fullPrompt += 'Previous conversation:\n';
      context.forEach((msg: any) => {
        fullPrompt += `${msg.role}: ${msg.content}\n`;
      });
    }
    fullPrompt += `\nUser: ${message}\nAssistant:`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const reply = response.text();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}