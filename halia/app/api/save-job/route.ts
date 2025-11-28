import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    // 1. Identifica CHI sta facendo la richiesta (Sicurezza Clerk)
    const { orgId, userId } = auth();

    if (!orgId) {
      return NextResponse.json(
        { error: "Devi selezionare un'organizzazione per pubblicare." },
        { status: 401 }
      );
    }

    // 2. Leggi i dati inviati dal frontend
    const body = await req.json();
    const { title, content, skills } = body;

    // 3. Salva nel Database Supabase
    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          org_id: orgId,      // Collega l'annuncio all'azienda corrente
          title: title,       // Titolo del lavoro
          content: content,   // I testi generati (LinkedIn, Sito, ecc)
          skills: skills      // Le skill strutturate (JSON) per il matching futuro
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, job: data[0] });

  } catch (error: any) {
    console.error("ERRORE SALVATAGGIO:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}