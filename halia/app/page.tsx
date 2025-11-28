"use client"; // Importante: serve per leggere la lingua del browser

import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { useEffect, useState } from 'react';

export default function Home() {
  // Stato per gestire la lingua (Default: Inglese per sicurezza)
  const [isItalian, setIsItalian] = useState(false);

  // Controllo la lingua del browser appena la pagina carica
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.language) {
      setIsItalian(navigator.language.startsWith('it'));
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 font-sans">
      
      {/* Brand Header */}
      <div className="text-center animate-fade-in mb-10">
        <h1 className="text-8xl font-bold tracking-tighter text-[#FF9800] mb-0 leading-none">
          Halia
        </h1>
        <p className="text-4xl text-gray-600 font-medium mt-2">
          Hire Smarter.
        </p>
      </div>

      {/* CASO A: Utente NON loggato (Ospite) */}
      <SignedOut>
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 max-w-lg w-full text-center space-y-8 animate-fade-in">
          
          {/* Testo Dinamico (IT / EN) */}
          <div className="text-xl text-gray-700 font-medium leading-relaxed">
            {isItalian ? (
              <>
                Crea annunci in pochi secondi.<br />
                <span className="font-bold text-[#2196F3]">Organizza e gestisci le candidature.</span>
              </>
            ) : (
              <>
                Create job ads in seconds.<br />
                <span className="font-bold text-[#2196F3]">Organize and manage applications.</span>
              </>
            )}
          </div>
          
          {/* Bottone Login - Colore forzato per visibilità */}
          <SignInButton mode="modal">
            <button className="w-full py-4 bg-[#2196F3] text-white text-lg font-bold rounded-xl shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all active:scale-95">
              {isItalian ? "Inizia Ora (Login)" : "Start Now (Login)"}
            </button>
          </SignInButton>
          
          <div className="text-xs text-gray-400 pt-4 border-t border-gray-50">
            🔒 Secured by Clerk • HaliaHire.com
          </div>
        </div>
      </SignedOut>


      {/* CASO B: Utente LOGGATO (Azienda) */}
      <SignedIn>
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full text-center space-y-8 animate-fade-in">
          
          {/* Barra di Controllo Utente */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/" />
              <div className="text-left leading-tight">
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  {isItalian ? "Il tuo account" : "Your account"}
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {isItalian ? "Profilo" : "Profile"}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                {isItalian ? "Azienda" : "Organization"}
              </p>
              <OrganizationSwitcher 
                hidePersonal={true}
                afterCreateOrganizationUrl="/"
                afterLeaveOrganizationUrl="/"
                afterSelectOrganizationUrl="/"
                appearance={{
                  elements: {
                    rootBox: "border border-gray-300 rounded-lg px-3 py-1 bg-white hover:bg-gray-50 transition-colors shadow-sm",
                    organizationSwitcherTrigger: "text-gray-800 font-bold"
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 text-[#2196F3] rounded-xl text-sm mb-4 font-medium">
              {isItalian ? "✨ Dashboard Jop Post." : "✨ Dashboard Jop Post."}
            </div>
            
            <Link 
              href="/new-job" 
              className="block w-full py-4 bg-[#2196F3] text-white text-lg font-bold rounded-xl shadow-md hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>⚡</span> 
              {isItalian ? "Crea Nuovo Annuncio AI" : "Create Job Post"}
            </Link>

            <button disabled className="block w-full py-4 bg-gray-100 text-gray-400 text-lg font-bold rounded-xl border border-gray-200 cursor-not-allowed">
              📂 {isItalian ? "I Miei Annunci (Presto)" : "My Jobs (Coming Soon)"}
            </button>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between text-xs font-bold">
             <span className="text-[#FF9800]">Piano: Startup (Beta)</span>
             <span className="text-gray-400">Crediti: ∞</span>
          </div>

        </div>
      </SignedIn>

      {/* Footer */}
      <div className="fixed bottom-4 text-gray-400 text-xs text-center">
        Powered by Google Gemini & HaliaHire.com
      </div>
    </main>
  )
}