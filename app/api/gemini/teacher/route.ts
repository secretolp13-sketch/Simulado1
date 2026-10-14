import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { message, currentQuestion, examTitle, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensagem inválida' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback if no API key is configured yet in environment
    if (!apiKey) {
      let fallbackReply = `Olá! Sou o Prof. Escudeiro. `;
      if (currentQuestion) {
        fallbackReply += `Para a questão de ${currentQuestion.subject} (${currentQuestion.skillCode}): observe atentamente as palavras-chave do enunciado. ${currentQuestion.teacherHint ? `Dica pedagógica: ${currentQuestion.teacherHint}` : 'Tente decompor o problema em etapas simples e eliminar alternativas com valores absurdos.'}`;
      } else {
        fallbackReply += `Estou pronto para te ajudar com qualquer dúvida sobre matemática, português, ciências, história ou estratégias para o ENEM, SARESP e Prova Paulista. Pode me mandar a sua pergunta!`;
      }
      return NextResponse.json({ reply: fallbackReply });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Build context-aware prompt
    let systemInstruction = `Você é o "Prof. Escudeiro", o professor online oficial e mentor de estudos da plataforma ESCSIMULADOS.
Seu objetivo é orientar estudantes brasileiros do Ensino Fundamental e Ensino Médio com foco em exames como ENEM, Prova Paulista, SARESP, OBMEP, OBA, ETEC e SAEB.
Diretrizes fundamentais do Prof. Escudeiro:
1. Seja sempre acolhedor, empático, paciente e didático. Use linguagem clara, encorajadora e acessível para adolescentes e jovens.
2. Em vez de apenas dar a resposta pronta, ensine o raciocínio passo a passo: como interpretar o enunciado, quais fórmulas ou regras gramaticais aplicar e como pensar logicamente.
3. Se o aluno estiver perguntando sobre a questão atual que está na tela, use os dados fornecidos da questão para explicar detalhadamente a lógica e o conceito pedagógico (habilidade BNCC).
4. Mantenha as respostas concisas e fáceis de ler na janela de chat (use pequenos tópicos, negrito para termos-chave e no máximo 3 a 4 parágrafos curtos).`;

    let userContext = `Mensagem do aluno: "${message}"\n`;

    if (currentQuestion) {
      userContext += `\n[CONTEXTO DA QUESTÃO QUE O ALUNO ESTÁ RESOLVENDO]:
Exame/Prova: ${examTitle || currentQuestion.examId}
Disciplina/Área: ${currentQuestion.subject} (${currentQuestion.grade})
Código de Habilidade: ${currentQuestion.skillCode}
Enunciado: ${currentQuestion.statement}
Alternativas:
${currentQuestion.options.map((o: { id: string; text: string }) => `- ${o.id}) ${o.text}`).join('\n')}
Gabarito oficial: Alternativa ${currentQuestion.correctOption}
Explicação pedagógica da prova: ${currentQuestion.explanation}
Dica do professor: ${currentQuestion.teacherHint}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userContext,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Olá! O Prof. Escudeiro está à disposição. Como posso te orientar nesta questão?';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Erro na rota do Prof. Escudeiro:', error);
    return NextResponse.json(
      { 
        reply: 'Olá! Tive uma breve oscilação de conexão, mas estou aqui com você. Uma dica de ouro para resolver essa questão: releia o comando principal e foque nos dados fornecidos para descartar as alternativas incorretas!'
      },
      { status: 200 }
    );
  }
}
