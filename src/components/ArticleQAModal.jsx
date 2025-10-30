import { useState } from 'react';
import { X, Send, Loader } from 'lucide-react';

// Hardcoded Q&A responses for demo
const DEMO_QA = {
  "How will this affect low income families?": "This SNAP shutdown will have a significant impact on low-income families in New Hampshire. With benefits potentially interrupted on November 1st, families relying on food assistance will face immediate food insecurity. The uncertainty about whether EBT cards will continue functioning creates additional stress. Additionally, the new federal rules that remove certain legal immigrants from the program will disproportionately affect immigrant families. The expansion of work requirements may exclude elderly, disabled, or caregiving individuals. Without WIC support beyond November 7th, pregnant women and young children will be especially vulnerable. Food banks are preparing for increased demand during this transition period.",
  "What are the new federal rules?": "Starting November 1st, New Hampshire must implement new federal SNAP rules from the budget reconciliation bill. These include: (1) Removal of certain legal immigrants from the program, affecting mixed-status families; (2) Expanded work requirements, potentially affecting students, elderly, and disabled individuals; (3) Changes to how benefits are calculated, which may reduce monthly assistance amounts. These are nationwide rules, but their specific impact varies by state implementation.",
  "When will this be resolved?": "The SNAP program transitions permanently starting November 1st, 2025. This isn't a temporary shutdown - it's a shift to the new federal requirements. However, there's a critical 4-day window before then for residents to use their remaining benefits. The WIC program is secured through at least November 7th, providing some continued support for pregnant women and young children. The permanent implementation means New Hampshire residents should prepare for longer-term adjustments to their benefits.",
  "default": "I can help answer questions about this SNAP shutdown. Try asking: 'How will this affect low income families?', 'What are the new federal rules?', or 'When will this be resolved?'"
};

const ArticleQAModal = ({ isOpen, onClose, article }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);

  const handleAsk = () => {
    if (!question.trim()) return;
    
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const normalizedQuestion = question.toLowerCase().trim();
      let response = DEMO_QA.default;
      
      // Check for exact or partial match
      for (const [key, value] of Object.entries(DEMO_QA)) {
        if (key !== 'default' && normalizedQuestion.includes(key.toLowerCase().slice(0, 20))) {
          response = value;
          break;
        }
      }
      
      setAnswer(response);
      setLoading(false);
      setHasAsked(true);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 10000 }}>
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-96 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Ask a Follow-up Question</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!hasAsked ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Ask about &ldquo;{article?.headline}&rdquo; - For demo, try: &ldquo;How will this affect low income families?&rdquo;
              </p>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleAsk();
                  }
                }}
                placeholder="Type your question here..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                rows={4}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs font-semibold text-gray-700 mb-1">Your Question:</p>
                <p className="text-sm text-gray-600">{question}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-xs font-semibold text-gray-700 mb-1">AI Answer:</p>
                <p className="text-sm text-gray-700 leading-relaxed">{answer}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex gap-2 justify-end bg-gray-50">
          {hasAsked && (
            <button
              onClick={() => {
                setQuestion('');
                setAnswer('');
                setHasAsked(false);
              }}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition"
            >
              Ask Another
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
          >
            Close
          </button>
          {!hasAsked && (
            <button
              onClick={handleAsk}
              disabled={!question.trim() || loading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center gap-2"
            >
              {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
              {loading ? 'Thinking...' : 'Ask'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleQAModal;
