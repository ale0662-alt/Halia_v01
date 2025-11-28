"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import SkillSelector from '../../components/SkillSelector';
import PostPreview from '../../components/PostPreview';

interface Message {
  role: string;
  content: string;
  isHidden?: boolean;
}

export default function NewJobPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // NUOVO: Stato per memorizzare le skill e passarle al salvataggio
  const [currentSkills, setCurrentSkills] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setMessages([{ 
        role: 'model', 
        content: 'Ciao! Sono Halia. Per quale posizione lavorativa vuoi creare un annuncio oggi?' 
      }]);
    }, 500);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (textToSend: string, hidden: boolean = false) => {
    if (!textToSend.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: textToSend, isHidden: hidden }];
    setMessages(newMessages);
    
    if (!hidden) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          history: newMessages.map(m => ({ role: m.role, parts: [{ text: m.content }] })).slice(0, -1),
          message: textToSend 
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setMessages([...newMessages, { role: 'model', content: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'model', content: "⚠️ Errore di connessione." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content: string) => {
    try {
      let jsonString = null;
      let introText = "";

      const markdownMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (markdownMatch) {
        jsonString = markdownMatch[1];
        introText = content.replace(markdownMatch[0], '').trim();
      } else if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
        jsonString = content;
      }

      if (jsonString) {
        const data = JSON.parse(jsonString);

        if (data.type === 'skill_proposal') {
          // NUOVO: Salviamo le skill proposte temporaneamente
          if (!currentSkills) setCurrentSkills(data.skills);
          
          return (
            <div>
              {introText && <p className="mb-4 whitespace-pre-line">{introText}</p>}
              <SkillSelector 
                skills={data.skills} 
                onConfirm={(result) => sendMessage(`Ecco i livelli confermati: ${result}`, true)} 
              />
            </div>
          );
        }

        if (data.type === 'post_generation') {
          return (
            <div>
              {introText && <p className="mb-4 whitespace-pre-line">{introText}</p>}
              {/* NUOVO: Passiamo le skill salvate al componente finale */}
              <PostPreview data={data.content} skills={currentSkills} />
            </div>
          );
        }
      }
    } catch (e) {
      return content;
    }
    return content;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">← Home</Link>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <span className="text-xl font-bold tracking-tight text-[#FF9800]">Halia</span>
          <span className="px-2 py-0.5 bg-blue-50 text-[#2196F3] text-xs font-bold rounded-full uppercase tracking-wide">Agent Beta</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
        {messages.filter(m => !m.isHidden).map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[95%] sm:max-w-[85%] p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-[#2196F3] text-white rounded-br-none' : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'}`}>
              {msg.role === 'model' ? renderMessageContent(msg.content) : msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white px-5 py-4 rounded-2xl border border-gray-100 flex gap-2 items-center">
              <div className="w-2 h-2 bg-[#2196F3] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#FF9800] rounded-full animate-bounce" style={{animationDelay:'0.15s'}}></div>
              <div className="w-2 h-2 bg-[#2196F3] rounded-full animate-bounce" style={{animationDelay:'0.3s'}}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Scrivi qui..."
            className="flex-1 p-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2196F3] transition-all"
            disabled={isLoading}
            autoFocus
          />
          <button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()} className="p-4 bg-[#1E293B] text-white rounded-xl font-bold hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all">➤</button>
        </div>
      </div>
    </div>
  );
}