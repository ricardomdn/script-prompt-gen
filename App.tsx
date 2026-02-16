import React, { useState } from 'react';
import { Clapperboard, Layers, ChevronLeft, MapPin, Calendar, Palette, Image as ImageIcon, Download } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import ScriptInput from './components/ScriptInput';
import VideoCard from './components/VideoCard';
import { analyzeScriptAndGeneratePrompts } from './services/geminiService';
import { AppState, SceneSegment, ScriptContext } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT_SCRIPT);
  const [segments, setSegments] = useState<SceneSegment[]>([]);
  const [context, setContext] = useState<ScriptContext | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleScriptAnalysis = async (script: string) => {
    setIsProcessing(true);
    setAppState(AppState.ANALYZING);
    try {
      const response = await analyzeScriptAndGeneratePrompts(script);
      
      const newSegments: SceneSegment[] = response.scenes.map((scene, index) => ({
        id: uuidv4(),
        originalText: scene.text,
        visualPrompt: scene.visual_prompt,
        isHook: index < 10
      }));

      setContext(response.context);
      setSegments(newSegments);
      setAppState(AppState.REVIEW_SCENES);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to analyze script. Please try again.");
      setAppState(AppState.INPUT_SCRIPT);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateSegment = (id: string, updates: Partial<SceneSegment>) => {
    setSegments(prev => prev.map(seg => seg.id === id ? { ...seg, ...updates } : seg));
  };

  const handleDownloadPrompts = () => {
    // Join prompts with double newline for blank space separation
    const textContent = segments.map(s => s.visualPrompt).join('\n\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${context?.detected_city || 'script'}_veo_prompts.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ImageIcon className="text-white" size={18} />
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
              Veo 3 Script Director
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-xs text-gray-500 font-medium border border-gray-800 px-3 py-1 rounded-full">
               Veo 3 Prompt Engineering
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        
        {appState === AppState.INPUT_SCRIPT || appState === AppState.ANALYZING ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold tracking-tight mb-3">Turn History into Veo 3 Videos</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Paste your historical city script below. Our AI will break it down into immersive, 
                high-detail video prompts optimized for Google Veo 3.
              </p>
            </div>
            <ScriptInput onAnalyze={handleScriptAnalysis} isAnalyzing={isProcessing} />
          </div>
        ) : (
          <div className="animate-fade-in">
             <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <button 
                  onClick={() => setAppState(AppState.INPUT_SCRIPT)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group"
                >
                  <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  Back to Script
                </button>

                {/* Context Dashboard */}
                {context && (
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-xs font-medium">
                      <MapPin size={12} />
                      {context.detected_city}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-300 text-xs font-medium">
                      <Calendar size={12} />
                      {context.detected_era}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-xs font-medium">
                      <Palette size={12} />
                      {context.visual_style_guide}
                    </div>
                  </div>
                )}
             </div>

             <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Layers size={14} />
                    <span>{segments.length} Scenes Generated</span>
                </div>
                
                <button 
                  onClick={handleDownloadPrompts}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-700 hover:border-gray-600 shadow-lg"
                >
                  <Download size={16} />
                  Download Prompts (.txt)
                </button>
             </div>

             <div className="space-y-4">
               {segments.map((segment, index) => (
                 <VideoCard 
                    key={segment.id} 
                    segment={segment} 
                    index={index} 
                    onUpdate={updateSegment}
                 />
               ))}
             </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;