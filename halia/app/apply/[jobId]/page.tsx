export default function ApplyPage({ params }: { params: { jobId: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* Card Candidatura */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header Colorato */}
        <div className="bg-[#2196F3] p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Social Media Manager</h1>
          <p className="opacity-90">Presso: <strong>Halia Demo Company</strong></p>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-lg mb-6">
            👋 Stai applicando per la posizione <strong>#{params.jobId}</strong>.
            Compila il form qui sotto.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2196F3] outline-none" placeholder="Mario" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Cognome</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2196F3] outline-none" placeholder="Rossi" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input type="email" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2196F3] outline-none" placeholder="mario.rossi@email.com" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Carica il tuo CV (PDF)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer">
              <span className="text-4xl block mb-2">📄</span>
              <p className="text-gray-500 text-sm">Trascina qui il file o clicca per caricare</p>
            </div>
          </div>

          <button className="w-full py-4 bg-[#1E293B] text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg active:scale-95">
            Invia Candidatura 🚀
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Powered by Halia Hiring
          </p>
        </div>
      </div>
    </div>
  );
}