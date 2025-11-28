"use client";
import React, { useState, useEffect, useRef } from 'react';

interface PostPreviewProps {
  data: {
    linkedin: string;
    job_board: string;
    social: string;
  };
  skills?: any;
}

export default function PostPreview({ data, skills }: PostPreviewProps) {
  const [activeTab, setActiveTab] = useState<'linkedin' | 'job_board' | 'social'>('linkedin');
  const [content, setContent] = useState(data);
  const [copied, setCopied] = useState(false);
  
  // Stati per il salvataggio automatico
  const [saveStatus, setSaveStatus] = useState<'saving' | 'success' | 'error'>('saving');
  const hasSaved = useRef(false); // Per evitare doppi salvataggi

  useEffect(() => {
    // Funzione di Salvataggio Automatico
    const autoSaveJob = async () => {
      if (hasSaved.current) return; // Se ha già salvato, fermati
      hasSaved.current = true;

      try {
        const title = data.job_board.split('\n')[0] || "Nuovo Annuncio";
        
        const response = await fetch('/api/save-job', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title,
            content: data, // Usiamo i dati originali
            skills: skills || {}
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Errore API");
        }

        setSaveStatus('success');
      } catch (error) {
        console.error("Errore salvataggio:", error);
        setSaveStatus('error');
        hasSaved.current = false; // Permetti di riprovare in caso di errore
      }
    };

    autoSaveJob();
  }, [data, skills]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-8 animate-fade-in text-left font-sans">
      
      {/* 1. STATUS BAR (Il messaggio di Halia) */}
      <div className={`mb-6 p-6 rounded-2xl border-l-8 shadow-sm flex items-center gap-4 transition-all ${
        saveStatus === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
        saveStatus === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
        'bg-blue-50 border-blue-500 text-blue-800'
      }`}>
        <div className="text-3xl">
          {saveStatus === 'success' ? '✅' : saveStatus === 'error' ? '❌' : '⏳'}
        </div>
        <div>
          {saveStatus === 'saving' && (
            <p className="font-bold">Sto salvando la tua offerta nel database...</p>
          )}
          {saveStatus === 'success' && (
            <>
              <h3 className="font-bold text-lg">Ottimo lavoro!</h3>
              <p>Ho salvato la tua job offer nella tua <strong>Home</strong>. Vedi qui sotto i post che ti ho preparato. Copia e incolla sui tuoi canali preferiti!</p>
            </>
          )}
          {saveStatus === 'error' && (
            <div>
              <p className="font-bold">Qualcosa è andato storto col salvataggio automatico.</p>
              <button 
                onClick={() => { hasSaved.current = false; window.location.reload(); }} 
                className="text-sm underline mt-1 hover:text-red-900"
              >
                Riprova a salvare
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. CARD ANTEPRIMA */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="flex bg-gray-50 border-b border-gray-200 overflow-x-auto">
          <button onClick={() => setActiveTab('linkedin')} className={`flex-1 min-w-[120px] py-4 text-sm font-bold transition-colors ${activeTab === 'linkedin' ? 'bg-white text-[#0077b5] border-t-4 border-[#0077b5]' : 'text-gray-500 hover:bg-gray-100'}`}>LinkedIn Post</button>
          <button onClick={() => setActiveTab('job_board')} className={`flex-1 min-w-[120px] py-4 text-sm font-bold transition-colors ${activeTab === 'job_board' ? 'bg-white text-[#2196F3] border-t-4 border-[#2196F3]' : 'text-gray-500 hover:bg-gray-100'}`}>Job Description</button>
          <button onClick={() => setActiveTab('social')} className={`flex-1 min-w-[120px] py-4 text-sm font-bold transition-colors ${activeTab === 'social' ? 'bg-white text-pink-500 border-t-4 border-pink-500' : 'text-gray-500 hover:bg-gray-100'}`}>Social</button>
        </div>

        <div className="p-0 bg-white relative">
          <textarea
            value={content[activeTab]}
            onChange={(e) => setContent({...content, [activeTab]: e.target.value})}
            className="w-full h-[60vh] p-8 text-base text-gray-700 bg-white border-0 focus:outline-none resize-none leading-relaxed font-mono"
            style={{ minHeight: '500px' }}
          />
          
          <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
            <button
              onClick={handleCopy}
              className="px-8 py-3 rounded-xl font-bold text-sm text-white bg-[#1E293B] hover:bg-black transition-all shadow-md active:scale-95"
            >
              {copied ? 'Copiato!' : 'Copia Testo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}