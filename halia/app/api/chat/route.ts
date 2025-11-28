import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("Manca API Key");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const body = await req.json();
    let history = body.history || [];

    // Rimuoviamo eventuali messaggi di sistema precedenti per non confondere il modello
    if (history.length > 0 && history[0].role === "model") {
      history = history.slice(1);
    }

    const systemInstruction = `
      SEI HALIA. RUOLO: AI Hiring Assistant Strategico.
      
      *** REGOLE SUPREME ***
      1. LINGUA: Rispondi SEMPRE nella lingua dell'utente.
      2. FORMATO SKILL: Usa SOLO liste di stringhe semplici ["Skill1", "Skill2"]. NO OGGETTI.
      3. TOV: Professionale, empatico ma diretto.
      
      *** WORKFLOW MENTALE (SEQUENZA OBBLIGATORIA) ***
      
      1. (Utente dice Ruolo) -> TU: Chiedi Azienda e Sito Web. (STOP).
      
      2. (Utente dice Azienda) -> TU: 
         - Scrivi: "Analizzo l'azienda... Ok! Ho preparato una bozza delle competenze per [Ruolo] in [Azienda]."
         - Genera JSON Skill in questo formato ESATTO:
           \`\`\`json
           { "type": "skill_proposal", "skills": ["HardSkill1", "HardSkill2", "SoftSkill1"] }
           \`\`\`
         - STOP.
         
      3. (Utente Conferma Skill con livelli) -> TU: Chiedi Obiettivi/Mission per i prossimi 12 mesi.
      
      4. (Utente risponde) -> TU: Chiedi a chi riporterà (Gerarchia) e RAL indicativa.
      
      5. (Utente risponde) -> TU: Genera Post Finali in questo formato JSON:
         \`\`\`json
         {
           "type": "post_generation",
           "content": {
             "linkedin": "Post LinkedIn con emoji e call to action...",
             "job_board": "Titolo, Chi Siamo, Cosa Farai (Elenco puntato), Requisiti...",
             "social": "Post breve per Instagram/Twitter..."
           }
         }
         \`\`\`
    `;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemInstruction }] },
        { role: "model", parts: [{ text: "Ricevuto. Sono Halia. Seguirò il workflow rigorosamente." }] },
        ...history
      ],
    });

    const result = await chat.sendMessage(body.message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("ERRORE API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}