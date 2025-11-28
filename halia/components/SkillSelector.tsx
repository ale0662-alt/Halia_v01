"use client";
import React, { useState } from 'react';

interface SkillSelectorProps {
  skills: string[];
  onConfirm: (skillsWithLevels: string) => void;
}

export default function SkillSelector({ skills, onConfirm }: SkillSelectorProps) {
  // Inizializza tutte le skill a livello 3 (Autonomo)
  const [levels, setLevels] = useState<Record<string, number>>(
    skills.reduce((acc, skill) => ({ ...acc, [skill]: 3 }), {})
  );

  const [newSkillName, setNewSkillName] = useState('');

  const levelLabels: Record<number, string> = {
    1: "Base / Theoretical",
    2: "Beginner / Junior",
    3: "Autonomous / Mid",
    4: "Advanced / Senior",
    5: "Expert / Lead"
  };

  const handleLevelChange = (skill: string, val: string) => {
    setLevels(prev => ({ ...prev, [skill]: parseInt(val) }));
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    const newLevels = { ...levels };
    delete newLevels[skillToDelete];
    setLevels(newLevels);
  };

  const handleAddSkill = () => {
    if (newSkillName.trim() && !levels[newSkillName]) {
      setLevels(prev => ({ ...prev, [newSkillName.trim()]: 3 }));
      setNewSkillName('');
    }
  };

  const handleSubmit = () => {
    const resultString = Object.entries(levels)
      .map(([skill, level]) => `${skill}: ${levelLabels[level]}`)
      .join(', ');
    onConfirm(resultString);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 my-6 animate-fade-in text-left">
      <h3 className="text-[#1E293B] font-bold mb-4 flex items-center gap-2 text-lg">
        <span className="w-1.5 h-6 bg-[#2196F3] rounded-full"></span>
        Definisci il livello richiesto (Skill Gap)
      </h3>
      
      <div className="space-y-4 mb-8">
        {Object.keys(levels).map((skill) => (
          <div key={skill} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors">
            <div className="flex justify-between mb-3 items-center">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleDeleteSkill(skill)}
                  className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                  title="Rimuovi"
                >
                  ✕
                </button>
                <span className="font-bold text-gray-800">{skill}</span>
              </div>
              <span className="text-xs font-bold text-[#2196F3] bg-white px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wide">
                {levelLabels[levels[skill]]}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={levels[skill]}
              onChange={(e) => handleLevelChange(skill, e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2196F3]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
              <span>Junior</span>
              <span>Senior</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6 pt-4 border-t border-gray-100">
        <input 
          type="text" 
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
          placeholder="+ Aggiungi skill manuale..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-blue-50"
        />
        <button 
          onClick={handleAddSkill}
          className="px-6 py-2 bg-gray-800 text-white font-bold rounded-xl hover:bg-black text-sm transition-colors"
        >
          Add
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-[#2196F3] text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-md active:scale-95 text-lg"
      >
        Conferma e Continua →
      </button>
    </div>
  );
}