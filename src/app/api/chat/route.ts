import { NextRequest, NextResponse } from 'next/server';

const BEDROCK_REGION = process.env.BEDROCK_REGION || 'us-east-1';
const BEDROCK_MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0';
const KNOWLEDGE_BASE_ID = process.env.KNOWLEDGE_BASE_ID || '';

const SYSTEM_PROMPT = `You are the Ancestro AI assistant — a helpful, knowledgeable expert on Ancestro's products and services in Latin America. You help customers with:

- Solar panels: installation, pricing, savings, warranty
- Batteries: home storage, commercial solutions, specifications
- Electric vehicles: BYD models, comparisons, test drives, pricing
- EV charging stations: Level 3 fast chargers, hosting program, app download
- Ancestro app: features, availability, charging network map

RULES:
1. Only answer questions related to Ancestro's products, services, and the clean energy / EV industry in LATAM.
2. If the user asks something outside your scope, politely redirect them to contact support.
3. Be concise but thorough. Use bullet points for comparisons.
4. Always respond in the same language the user writes in.
5. Never make up specific prices, dates, or statistics — say "contact us for current pricing" if unsure.
6. If knowledge base context is provided, prioritize that information over general knowledge.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, lang } = await req.json() as { messages: ChatMessage[]; lang: string };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 });
    }

    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

    // If Knowledge Base is configured, retrieve context via RAG
    let ragContext = '';
    if (KNOWLEDGE_BASE_ID) {
      ragContext = await retrieveFromKnowledgeBase(lastUserMessage);
    }

    const systemPrompt = ragContext
      ? `${SYSTEM_PROMPT}\n\nRelevant knowledge base context:\n${ragContext}`
      : SYSTEM_PROMPT;

    // Call Bedrock with conversation history
    const response = await callBedrock(systemPrompt, messages);

    return NextResponse.json({ message: response });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

async function retrieveFromKnowledgeBase(query: string): Promise<string> {
  try {
    const { BedrockAgentRuntimeClient, RetrieveCommand } = await import(
      '@aws-sdk/client-bedrock-agent-runtime'
    );

    const client = new BedrockAgentRuntimeClient({ region: BEDROCK_REGION });
    const command = new RetrieveCommand({
      knowledgeBaseId: KNOWLEDGE_BASE_ID,
      retrievalQuery: { text: query },
      retrievalConfiguration: {
        vectorSearchConfiguration: { numberOfResults: 5 },
      },
    });

    const result = await client.send(command);
    const chunks = result.retrievalResults || [];

    return chunks
      .map((r) => r.content?.text || '')
      .filter(Boolean)
      .join('\n\n---\n\n');
  } catch {
    return '';
  }
}

async function callBedrock(systemPrompt: string, messages: ChatMessage[]): Promise<string> {
  const { BedrockRuntimeClient, InvokeModelCommand } = await import(
    '@aws-sdk/client-bedrock-runtime'
  );

  const client = new BedrockRuntimeClient({ region: BEDROCK_REGION });

  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const command = new InvokeModelCommand({
    modelId: BEDROCK_MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: new TextEncoder().encode(body),
  });

  const result = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(result.body));

  return responseBody.content?.[0]?.text || 'No response generated.';
}
