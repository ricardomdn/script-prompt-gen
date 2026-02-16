import React, { useState } from 'react';
import { Wand2, FileText } from 'lucide-react';

interface ScriptInputProps {
  onAnalyze: (script: string) => void;
  isAnalyzing: boolean;
}

const ScriptInput: React.FC<ScriptInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const [script, setScript] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (script.trim()) {
      onAnalyze(script);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="bg-gray-850 border border-gray-700 rounded-xl p-6 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="text-purple-400" />
            Paste Your Script
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            We will analyze the pacing, split it into scenes, and generate cinematic 
            Veo 3 video prompts for each segment (ignoring structural headers).
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            className="w-full h-64 bg-gray-950 text-gray-100 border border-gray-700 rounded-lg p-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-all placeholder-gray-600"
            placeholder="e.g., [HOOK] In 1850, the streets of London were shrouded in fog..."
            disabled={isAnalyzing}
          />
          
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={!script.trim() || isAnalyzing}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all
                ${!script.trim() || isAnalyzing 
                  ? 'bg-gray-700 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 transform hover:-translate-y-0.5'
                }
              `}
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Analyzing Details...
                </>
              ) : (
                <>
                  <Wand2 size={18} />
                  Generate Veo 3 Prompts
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScriptInput;