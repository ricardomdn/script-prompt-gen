import React, { useState } from 'react';
import { Copy, Check, Sparkles, MessageSquareQuote, Image as ImageIcon } from 'lucide-react';
import { SceneSegment } from '../types';

interface VideoCardProps {
  segment: SceneSegment;
  index: number;
  onUpdate: (id: string, updates: Partial<SceneSegment>) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ segment, index, onUpdate }) => {
  const [copied, setCopied] = useState(false);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [localPrompt, setLocalPrompt] = useState(segment.visualPrompt);

  const handleCopy = () => {
    navigator.clipboard.writeText(localPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePrompt = () => {
    setIsEditingPrompt(false);
    onUpdate(segment.id, { visualPrompt: localPrompt });
  };

  return (
    <div className={`
      relative group rounded-xl overflow-hidden border transition-all duration-300
      ${segment.isHook ? 'bg-indigo-950/20 border-indigo-500/30 hover:border-indigo-500/50' : 'bg-gray-850 border-gray-700 hover:border-gray-600'}
    `}>
      {/* Hook Label */}
      {segment.isHook && (
        <div className="absolute top-0 right-0 bg-indigo-600 text-xs font-bold px-3 py-1 rounded-bl-xl text-white z-10 shadow-lg shadow-indigo-900/50">
          HOOK SEGMENT
        </div>
      )}

      <div className="flex flex-col md:flex-row h-full">
        {/* Script Section */}
        <div className="md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-gray-700/50 bg-black/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-gray-400 font-mono text-xs border border-gray-700">
                  {index + 1}
                  </span>
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <MessageSquareQuote size={12} />
                      Context / Script
                  </h3>
              </div>
              <p className="text-gray-200 font-medium text-lg leading-relaxed font-serif italic">
                  "{segment.originalText}"
              </p>
            </div>
            
            <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
                <ImageIcon size={12} />
                <span>Target: 16:9 Cinematic Image</span>
            </div>
        </div>

        {/* Prompt Section */}
        <div className="flex-1 p-6 flex flex-col relative bg-gradient-to-r from-gray-900/0 to-gray-900/50">
            <div className="flex justify-between items-start mb-3">
                 <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={12} />
                    Image Generation Prompt
                </h3>
                <div className="flex items-center gap-2">
                     <button 
                        onClick={() => {
                            if (isEditingPrompt) handleSavePrompt();
                            else setIsEditingPrompt(true);
                        }}
                        className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-800"
                    >
                        {isEditingPrompt ? 'Save' : 'Edit'}
                    </button>
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            copied 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/20 shadow-lg shadow-indigo-500/20'
                        }`}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy Prompt'}
                    </button>
                </div>
            </div>

            <div className="flex-grow">
                {isEditingPrompt ? (
                    <textarea 
                        value={localPrompt}
                        onChange={(e) => setLocalPrompt(e.target.value)}
                        className="w-full h-full min-h-[100px] bg-gray-900 text-gray-100 p-4 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none font-mono text-sm leading-relaxed"
                        autoFocus
                    />
                ) : (
                    <div 
                        className="w-full h-full min-h-[100px] bg-black/30 text-gray-300 p-4 rounded-lg border border-gray-800 font-mono text-sm leading-relaxed hover:bg-black/40 transition-colors cursor-pointer border-dashed"
                        onClick={() => setIsEditingPrompt(true)}
                        title="Click to edit"
                    >
                        {localPrompt}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
