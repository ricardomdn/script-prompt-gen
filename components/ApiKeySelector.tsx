import React, { useEffect, useState } from 'react';
import { Key, AlertCircle, CheckCircle } from 'lucide-react';

const ApiKeySelector: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkKey = async () => {
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        // Assume success after dialog interaction to avoid race conditions
        setHasKey(true);
      } catch (e) {
        console.error("Key selection failed", e);
        // Force re-check on error
        checkKey();
      }
    }
  };

  if (loading) return null;

  if (hasKey) {
    return (
      <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full text-xs font-medium border border-green-400/20">
        <CheckCircle size={14} />
        <span>Paid API Key Active</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mb-6">
      <div className="flex gap-3">
        <div className="mt-1 text-blue-400">
            <AlertCircle size={20} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-blue-100">Action Required: Billing Project</h3>
          <p className="text-xs text-blue-300 mt-1 max-w-lg">
            Generating videos with Veo 3 requires a paid Google Cloud Project. 
            Please select a project with billing enabled.
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline ml-1 hover:text-white">Learn more</a>
          </p>
        </div>
      </div>
      <button
        onClick={handleSelectKey}
        className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
      >
        <Key size={16} />
        Select API Key
      </button>
    </div>
  );
};

export default ApiKeySelector;