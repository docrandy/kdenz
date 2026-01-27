/**
 * DevFeedbackBoxes - Development-only feedback capture
 * Two boxes for documenting profile notes and product adjustments
 * NOT part of the final product - for testing/development only
 */

import { useState, useEffect } from 'react';

const PROFILE_NOTES_KEY = 'dev_profile_notes';
const PRODUCT_FEEDBACK_KEY = 'dev_product_feedback';

interface DevNote {
  id: string;
  timestamp: number;
  page: string;
  content: string;
}

export function DevFeedbackBoxes({ currentPage }: { currentPage: string }) {
  const [profileNote, setProfileNote] = useState('');
  const [productFeedback, setProductFeedback] = useState('');
  const [isExpanded, setIsExpanded] = useState(true); // Always open by default
  const [savedIndicator, setSavedIndicator] = useState<'profile' | 'product' | null>(null);

  // Show saved indicator briefly
  useEffect(() => {
    if (savedIndicator) {
      const timer = setTimeout(() => setSavedIndicator(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [savedIndicator]);

  const saveNote = (type: 'profile' | 'product', content: string) => {
    if (!content.trim()) return;

    const key = type === 'profile' ? PROFILE_NOTES_KEY : PRODUCT_FEEDBACK_KEY;
    const existing = JSON.parse(localStorage.getItem(key) || '[]') as DevNote[];

    const note: DevNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      page: currentPage,
      content: content.trim(),
    };

    existing.push(note);
    localStorage.setItem(key, JSON.stringify(existing));

    if (type === 'profile') {
      setProfileNote('');
    } else {
      setProductFeedback('');
    }
    setSavedIndicator(type);
  };

  // Collapsed state - small toggle button (middle-right position)
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-yellow-400 text-yellow-900 px-3 py-2 rounded-lg shadow-lg hover:bg-yellow-300 transition-colors text-sm font-medium"
      >
        📝 Dev Notes
      </button>
    );
  }

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-80 bg-yellow-50 border-2 border-yellow-400 rounded-xl shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-yellow-400 rounded-t-lg">
        <span className="font-semibold text-yellow-900 text-sm">Dev Notes ({currentPage})</span>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-yellow-900 hover:text-yellow-700 font-bold"
        >
          ×
        </button>
      </div>

      <div className="p-3 space-y-4">
        {/* Profile Notes Box */}
        <div>
          <label className="block text-xs font-semibold text-yellow-800 mb-1">
            📋 Profile Notes
            <span className="font-normal text-yellow-600 ml-1">(things to add to user profile)</span>
          </label>
          <textarea
            value={profileNote}
            onChange={(e) => setProfileNote(e.target.value)}
            placeholder="Note about profile data..."
            rows={2}
            className="w-full p-2 text-sm border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
          />
          <button
            onClick={() => saveNote('profile', profileNote)}
            disabled={!profileNote.trim()}
            className="mt-1 px-3 py-1 bg-yellow-500 text-white text-xs rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {savedIndicator === 'profile' ? '✓ Saved' : 'Save Profile Note'}
          </button>
        </div>

        {/* Product Feedback Box */}
        <div>
          <label className="block text-xs font-semibold text-orange-800 mb-1">
            🔧 Product Feedback
            <span className="font-normal text-orange-600 ml-1">(adjustments for Claude to see)</span>
          </label>
          <textarea
            value={productFeedback}
            onChange={(e) => setProductFeedback(e.target.value)}
            placeholder="Product adjustment or feedback..."
            rows={2}
            className="w-full p-2 text-sm border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />
          <button
            onClick={() => saveNote('product', productFeedback)}
            disabled={!productFeedback.trim()}
            className="mt-1 px-3 py-1 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {savedIndicator === 'product' ? '✓ Saved' : 'Save Product Feedback'}
          </button>
        </div>

        {/* View all notes link */}
        <div className="text-center pt-2 border-t border-yellow-200">
          <ViewNotesButton />
        </div>
      </div>
    </div>
  );
}

// Button to view all collected notes
function ViewNotesButton() {
  const [showNotes, setShowNotes] = useState(false);

  if (!showNotes) {
    return (
      <button
        onClick={() => setShowNotes(true)}
        className="text-xs text-yellow-700 hover:text-yellow-900 underline"
      >
        View all notes
      </button>
    );
  }

  const profileNotes = JSON.parse(localStorage.getItem(PROFILE_NOTES_KEY) || '[]') as DevNote[];
  const productNotes = JSON.parse(localStorage.getItem(PRODUCT_FEEDBACK_KEY) || '[]') as DevNote[];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={() => setShowNotes(false)}>
      <div className="bg-white rounded-xl max-w-2xl max-h-[80vh] overflow-auto m-4 p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">All Dev Notes</h2>
          <button onClick={() => setShowNotes(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="space-y-6">
          {/* Profile Notes */}
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">📋 Profile Notes ({profileNotes.length})</h3>
            {profileNotes.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No profile notes yet</p>
            ) : (
              <div className="space-y-2">
                {profileNotes.map(note => (
                  <div key={note.id} className="bg-yellow-50 p-3 rounded-lg text-sm">
                    <p className="text-gray-900">{note.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(note.timestamp).toLocaleString()} • {note.page}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Notes */}
          <div>
            <h3 className="font-semibold text-orange-800 mb-2">🔧 Product Feedback ({productNotes.length})</h3>
            {productNotes.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No product feedback yet</p>
            ) : (
              <div className="space-y-2">
                {productNotes.map(note => (
                  <div key={note.id} className="bg-orange-50 p-3 rounded-lg text-sm">
                    <p className="text-gray-900">{note.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(note.timestamp).toLocaleString()} • {note.page}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Export/Clear buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={() => {
                const data = { profileNotes, productNotes, exportedAt: new Date().toISOString() };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dev-notes-${Date.now()}.json`;
                a.click();
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              Export Notes
            </button>
            <button
              onClick={() => {
                if (confirm('Clear all dev notes?')) {
                  localStorage.removeItem(PROFILE_NOTES_KEY);
                  localStorage.removeItem(PRODUCT_FEEDBACK_KEY);
                  setShowNotes(false);
                }
              }}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper function to get all dev notes (for Claude to read)
 */
export function getAllDevNotes() {
  const profileNotes = JSON.parse(localStorage.getItem(PROFILE_NOTES_KEY) || '[]');
  const productNotes = JSON.parse(localStorage.getItem(PRODUCT_FEEDBACK_KEY) || '[]');
  return { profileNotes, productNotes };
}

export default DevFeedbackBoxes;
