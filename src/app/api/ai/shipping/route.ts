import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitResponse, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 20 requests per minute per IP
    const ip = getClientIp(request);
    const rl = rateLimit(`ai-shipping:${ip}`, { maxRequests: 20, windowMs: 60_000 });
    if (!rl.success) return rateLimitResponse();

    const { details } = await request.json();

    if (!details) {
      return NextResponse.json(
        { error: 'Shipping details are required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      // Fallback recommendation
      const recommendation = `Based on the provided details, we recommend:
• Standard shipping (5-7 business days): Most cost-effective for non-urgent orders
• Express shipping (2-3 business days): For time-sensitive deliveries
• Consider consolidating multiple items into a single shipment to reduce costs
• For items over R2,500, free standard shipping applies

For exact rates, please configure your OpenAI API key for AI-powered shipping optimization.`;

      return NextResponse.json({ recommendation });
    }

    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a shipping and logistics expert for a South African e-commerce business called Unlimited IT Solutions based in Ramsgate, KwaZulu-Natal. Provide specific, actionable shipping cost optimization recommendations. Consider South African courier services (The Courier Guy, RAM, Fastway, PostNet, SAPO). Use South African Rand (ZAR) for pricing. Keep advice practical and concise.',
        },
        {
          role: 'user',
          content: `Provide shipping cost optimization for the following:\n\n${details}`,
        },
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const recommendation = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error('AI Shipping error:', error);
    return NextResponse.json(
      { error: 'Failed to generate shipping recommendation' },
      { status: 500 }
    );
  }
}
