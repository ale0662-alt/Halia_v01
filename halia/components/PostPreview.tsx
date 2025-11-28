"use client";
import React, { useState, useEffect } from 'react';

interface PostPreviewProps {
  data: {
    linkedin: string;
    job_board: string;
    social: string;
  };
}

export default function PostPreview({ data }: PostPreviewProps) {
  const [activeTab, setActiveTab] = useState<'linkedin' | 'job_board' | 'social'>('linkedin');
  const [content, setContent] = useState(data);
  const [copied, setCopied] = useState(false);

  // Pulisce il testo da caratteri strani generati dall'AI
  useEffect(() => {
    const cleanText = (text: string) => {
      if (!text) return "";
      return text
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\*/g, '•')
        .replace(/\*\*/g, '');
    };

    setContent({
      linkedin: cleanText(data.linkedin),
      job_board: cleanText(data.job_board),
      social: cleanText(data.social)
    });
  }, [data]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-6 animate-fade-in text-left font-sans">
      
      {/* Header Tabs */}
      <div className="flex bg-gray-50 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('linkedin')}
          className={`flex-1 py-4 text-sm font-bold transition-colors ${
            activeTab === 'linkedin' 
            ? 'bg-white text-[#0077b5] border-t-4 border-[#0077b5]' 
            : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          LinkedIn Post
        </button>
        
        <button
          onClick={() => setActiveTab('job_board')}
          className={`flex-1 py-4 text-sm font-bold transition-colors ${
            activeTab === 'job_board' 
            ? 'bg-white text-[#2196F3] border-t-4 border-[#2196F3]' 
            : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Job Description
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`flex-1 py-4 text-sm font-bold transition-colors ${
            activeTab === 'social' 
            ? 'bg-white text-pink-500 border-t-4 border-pink-500' 
            : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Instagram / Social
        </button>
      </div>

      {/* Area Testo */}
      <div className="p-0 bg-white relative">
        <textarea
          value={content[activeTab]}
          onChange={(e) => setContent({...content, [activeTab]: e.target.value})}
          className="w-full h-[500px] p-6 text-sm text-gray-700 bg-white border-0 focus:outline-none resize-none leading-relaxed"
          style={{ minHeight: '400px' }}
        />
        
        <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
          <button
            onClick={handleCopy}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${
              copied 
              ? 'bg-green-500 text-white' 
              : 'bg-[#1E293B] text-white hover:bg-black'
            }`}
          >
            {copied ? 'Copiato!' : 'Copia Testo'}
          </button>
        </div>
      </div>
    </div>
  );
}