import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { abstract, track } = await request.json();

    if (!abstract) {
      return NextResponse.json(
        { error: 'Abstract is required' },
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

    const result = await model.generateContent(prompt);
    const response = result.response;
    const improved = response.text().trim();

    return NextResponse.json({ improved });
  } catch (error) {
    console.error('AI improve abstract error:', error);
    return NextResponse.json(
      { error: 'Failed to improve abstract' },
      { status: 500 }
    );
  }
}