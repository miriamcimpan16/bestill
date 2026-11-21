import { OpenWhenCategory } from '../types';

interface MobileCategoryDrawerProps {
  category: OpenWhenCategory;
  isOpen: boolean;
  onClose: () => void;
  onDeleteCategory: (category: OpenWhenCategory) => void;
  onDeleteVerse: (verseId: string) => void;
  onAddVerse: () => void;
  newVerseRef: string;
  setNewVerseRef: (value: string) => void;
  newVerseText: string;
  setNewVerseText: (value: string) => void;
  isLoadingVerse: boolean;
  verseError: string | null;
  isLoading: boolean;
}

export default function MobileCategoryDrawer({
  category,
  isOpen,
  onClose,
  onDeleteCategory,
  onDeleteVerse,
  onAddVerse,
  newVerseRef,
  setNewVerseRef,
  newVerseText,
  setNewVerseText,
  isLoadingVerse,
  verseError,
  isLoading
}: MobileCategoryDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F4EFEA] p-4 lg:hidden">
      {/* Header cu back button */}
      <div className="flex items-start justify-between mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[#1E1815] min-h-[44px]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-lg">Înapoi la categorii</span>
        </button>
        <button
          onClick={() => onDeleteCategory(category)}
          disabled={isLoading}
          className="text-red-600 hover:text-red-700 transition disabled:opacity-50 p-2 min-h-[44px] min-w-[44px]"
          title="Șterge categoria"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Titlu categorie */}
      <div className="mb-6">
        <h2 className="text-2xl text-[#1E1815] mb-1">
          {category.title}
        </h2>
        <p className="text-xs uppercase tracking-wider text-[#1E1815]/50">
          {category.verses.length} versete în categorie
        </p>
      </div>

      {/* Formular adăugare verset - SUS, vizibil */}
      <div className="bg-white border border-[#1E1815]/20 rounded-lg p-4 mb-6 space-y-4">
        <h3 className="text-sm font-medium text-[#1E1815] uppercase tracking-wider">
          Adaugă verset nou
        </h3>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs uppercase tracking-wider text-[#1E1815]/60 font-medium">
              Referință biblică
            </label>
            {isLoadingVerse && (
              <span className="text-xs text-[#7A5363] flex items-center gap-1">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Caut...
              </span>
            )}
          </div>
          <input
            type="text"
            value={newVerseRef}
            onChange={(e) => setNewVerseRef(e.target.value)}
            placeholder="ex. Isaia 40:31"
            className="w-full min-h-[44px] px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs uppercase tracking-wider text-[#1E1815]/60 font-medium">
              Textul versetului
            </label>
            {verseError && (
              <span className="text-xs text-[#1E1815]/60">
                {verseError}
              </span>
            )}
            {!verseError && !isLoadingVerse && newVerseText && newVerseRef && (
              <span className="text-xs text-green-600">
                ✓ Preluat
              </span>
            )}
          </div>
          <textarea
            value={newVerseText}
            onChange={(e) => setNewVerseText(e.target.value)}
            placeholder="Textul versetului..."
            rows={4}
            className="w-full px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent resize-none"
          />
        </div>

        <button
          onClick={onAddVerse}
          disabled={isLoading || !newVerseRef.trim() || !newVerseText.trim()}
          className="w-full min-h-[48px] py-3 bg-[#1E1815] text-[#F4EFEA] rounded hover:bg-[#2A1F1C] active:bg-[#2A1F1C] transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm font-medium"
        >
          Adaugă versetul
        </button>
      </div>

      {/* Lista versetelor existente */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[#1E1815]/60 uppercase tracking-wider">
          Versete adăugate ({category.verses.length})
        </h3>
        
        {category.verses.length === 0 ? (
          <div className="text-[#1E1815]/40 text-sm text-center py-8 border border-dashed border-[#1E1815]/20 rounded">
            Niciun verset adăugat încă
          </div>
        ) : (
          category.verses.map((verse) => (
            <div 
              key={verse.id}
              className="bg-white border border-[#1E1815]/20 rounded-lg p-4 relative"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="font-medium text-[#1E1815] text-sm">
                  {verse.verseReference}
                </div>
                <button
                  onClick={() => onDeleteVerse(verse.id)}
                  disabled={isLoading}
                  className="flex-shrink-0 text-red-600 hover:text-red-700 active:text-red-800 disabled:opacity-50 p-1 min-h-[44px] min-w-[44px]"
                  title="Șterge"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="text-[#1E1815]/70 text-sm leading-relaxed">
                {verse.verseText}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
