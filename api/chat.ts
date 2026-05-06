import { streamText, createUIMessageStreamResponse  } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { Pinecone } from '@pinecone-database/pinecone';
import { HfInference } from '@huggingface/inference';


const groq = createGroq({ apiKey: process.env.GROQ_API_KEY || '' });
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });
const hf = new HfInference(process.env.HF_TOKEN || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Body recebido:", JSON.stringify(body.messages, null, 2));
    const rawMessages = body.messages || [];

    // 1. O Pulo do Gato Final: Traduz as mensagens do Frontend para o Backend
    const formattedMessages = rawMessages.map((msg: any) => {
      let text = '';

      if (typeof msg.content === 'string' && msg.content.trim() !== '') {
        text = msg.content;
      } else if (Array.isArray(msg.parts)) {
        text = msg.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join(' ');
      } else if (Array.isArray(msg.content)) {
        text = msg.content
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join(' ');
      }
      

      return {
        role: msg.role,
        content: text,
      };
    });

    const lastMessageText = formattedMessages[formattedMessages.length - 1]?.content;

    // Trava de segurança
    if (!lastMessageText || lastMessageText.trim() === '') {
      return new Response("Mensagem vazia", { status: 400 });
    }

    // 2. Hugging Face converte em vetor
    const embeddingResponse = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: lastMessageText,
    });
    
    const embedding = embeddingResponse as number[];

    // 3. Pinecone busca o contexto (Mantenha o nome do seu index aqui!)
    const index = pc.index('portfoliorag'); 
    const queryResponse = await index.query({
      vector: embedding,
      topK: 3,
      includeMetadata: true,
    });

    const context = queryResponse.matches.map(match => match.metadata?.text).join('\n\n');

    // 4. Prompt
   const systemPrompt = `Você é um assistente do portfólio do Bruno Romeu da Silva, desenvolvedor Full Stack.
    Responda como se fosse o próprio Bruno falando, em primeira pessoa, de forma direta e profissional.

    REGRAS ABSOLUTAS:
    - Use APENAS as informações do contexto abaixo. Nunca invente, assuma ou complemente com conhecimento próprio.
    - Se a informação não estiver no contexto, responda EXATAMENTE: "Não tenho essa informação aqui, mas você pode perguntar diretamente ao Bruno pelo LinkedIn ou e-mail!"
    - Nunca liste tecnologias, projetos ou experiências que não estejam explicitamente no contexto
    - Priorize stacks, tecnologias e experiências de desenvolvimento
    - Seja direto e objetivo, sem enrolação
    - Não mencione experiências fora de TI a menos que o usuário pergunte

    CONTEXTO SOBRE O BRUNO:
    ${context}

    LEMBRE-SE: Se não está no contexto acima, não existe. Não invente.`;

    // 5. Groq gera a resposta
    const result = await streamText({
      model: groq('llama-3.1-8b-instant'),
      messages: formattedMessages,
      system: systemPrompt,
    });

    return createUIMessageStreamResponse({
      stream: result.toUIMessageStream(),
    });

  } catch (error) {
    console.error("Erro na API:", error);
    return new Response(JSON.stringify({ error: 'Erro interno no servidor' }), { status: 500 });
  }
}