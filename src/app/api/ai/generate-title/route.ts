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

    const prompt = `Based on this session abstract, generate 3 compelling, professional conference session titles. Each title should be:
- 20-70 characters
- Action-oriented and engaging
- Clear about the session value
- Professional and specific

Abstract: ${abstract}
Track: ${track || 'General'}

Respond with JSON array of 3 titles:
["Title 1", "Title 2", "Title 3"]`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = response.text();
    
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