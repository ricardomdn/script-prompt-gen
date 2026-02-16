import React, { useState } from 'react';
import { X, Key, ExternalLink, Save, Globe } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  useProxy: boolean;
  onSave: (key: string, useProxy: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, apiKey, useProxy, onSave }) => {
  const [keyInput, setKeyInput] = useState(apiKey);
  const [proxyEnabled, setProxyEnabled] = useState(useProxy);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <Key className="text-purple-400" size={20} />
          API Configuration
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Enter your API key to enable Grok video generation.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              GeminiGen.ai / Grok API Key
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Enter your x-api-key"
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              Need a key? 
              <a href="https://docs.geminigen.ai/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-0.5">
                Visit Documentation <ExternalLink size={10} />
              </a>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-blue-400" />
                <span className="text-sm font-medium text-gray-200">Enable CORS Proxy</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={proxyEnabled} 
                  onChange={(e) => setProxyEnabled(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Turn this on if you see "Failed to fetch" errors. Fixes browser limitations (CORS) by routing requests through <code>corsproxy.io</code>.
            </p>
          </div>

          <button
            onClick={() => {
              onSave(keyInput, proxyEnabled);
              onClose();
            }}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
