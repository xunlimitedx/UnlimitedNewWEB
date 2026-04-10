import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitResponse, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 20 requests per minute per IP
    const ip = getClientIp(request);
    const rl = rateLimit(`ai-summarize:${ip}`, { maxRequests: 20, windowMs: 60_000 });
    if (!rl.success) return rateLimitResponse();

    const { description } = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      // Fallback: simple algorithmic summary when no API key
      const sentences = description
        .split(/[.!?]+/)
        .filter((s: string) => s.trim().length > 10);
      const summary =
        sentences.slice(0, 3).join('. ').trim() +
        (sentences.length > 3 ? '.' : '');
      return NextResponse.json({ summary });
    }

    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a product copy specialist for an IT e-commerce store. Create concise, compelling product summaries that highlight key features and benefits. Keep summaries under 100 words. Use a professional but approachable tone.',
        },
        {
          role: 'user',
          content: `Summarize the following product description for an e-commerce listing:\n\n${description}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const summary = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('AI Summarize error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
