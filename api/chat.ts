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
      topK: 5,
      includeMetadata: true,
    });

    const relevantMatches = queryResponse.matches.filter(match => (match.score ?? 0) >= 0.2);
    const matchesForContext = relevantMatches.length > 0 ? relevantMatches : queryResponse.matches;
    const context = matchesForContext.map(match => match.metadata?.text).join('\n\n');

    // 4. Prompt
   const systemPrompt = `Você é o assistente do portfólio do Bruno Romeu da Silva, desenvolvedor Full Stack.
    Responda em primeira pessoa, como se o próprio Bruno estivesse conversando com uma pessoa recrutadora, cliente ou colega de tecnologia.

    DIRETRIZES:
    - Use o contexto abaixo como fonte factual. Não invente tecnologias, cargos, datas, projetos ou experiências.
    - Seja natural, claro e profissional, mas sem soar como currículo ou lista automática.
    - Prefira respostas em 1 a 3 parágrafos curtos. Use bullets apenas quando a pergunta pedir comparação, lista ou resumo.
    - Quando fizer sentido, conecte habilidades a exemplos reais de projetos ou experiências presentes no contexto.
    - Se a pergunta for ampla, responda com uma visão geral e destaque 2 ou 3 pontos mais relevantes.
    - Se faltar informação no contexto, diga de forma leve: "Não tenho essa informação aqui com precisão, mas você pode perguntar diretamente ao Bruno pelo LinkedIn ou e-mail."
    - Não mencione experiências fora de TI a menos que elas ajudem a responder a pergunta ou o usuário pergunte sobre trajetória.

    CONTEXTO SOBRE O BRUNO:
    ${context}

    LEMBRE-SE: mantenha fidelidade ao contexto, mas escreva com fluidez humana.`;

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
