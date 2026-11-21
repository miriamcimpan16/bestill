import { Day } from '../types';
import DevotionalEditor from './DevotionalEditor';
import { useState } from 'react';

interface MobileWeekDrawerProps {
  day: Day;
  dayIndex: number;
  dayName: string;
  dayDate: string;
  isOpen: boolean;
  onClose: () => void;
  onChange: (index: number, field: keyof Day, value: string) => void;
  isLoadingVerse: boolean;
  verseError: string | null;
  wordCount: number;
  readingTime: number;
}

export default function MobileWeekDrawer({
  day,
  dayIndex,
  dayName,
  dayDate,
  isOpen,
  onClose,
  onChange,
  isLoadingVerse,
  verseError,
  wordCount,
  readingTime
}: MobileWeekDrawerProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Editor TipTap */}
      {isEditorOpen && (
        <DevotionalEditor
          value={day.content || ''}
          onChange={(value) => onChange(dayIndex, 'content', value)}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      {/* Full-screen drawer pentru mobile */}
      <div className="fixed inset-0 bg-[#F4EFEA] z-50 overflow-y-auto pb-24">
        {/* Header cu back button */}
        <div className="bg-[#1E1815] px-4 py-3 flex items-center gap-3 border-b border-[#F4EFEA]/10 sticky top-0 z-10">
          <button
            onClick={onClose}
            className="text-[#F4EFEA] flex items-center gap-2 min-h-[44px]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Înapoi la zile</span>
          </button>
        </div>

        {/* Content scrollable */}
        <div className="p-4 space-y-5">
          {/* Header zi */}
          <div>
            <h3 className="text-2xl text-[#1E1815] mb-1">
              {dayName} · Ziua {dayIndex + 1}
            </h3>
            <p className="text-xs uppercase tracking-wider text-[#1E1815]/50">
              {dayDate}
            </p>
          </div>

          {/* Referință */}
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
              value={day.verseReference || ''}
              onChange={(e) => onChange(dayIndex, 'verseReference', e.target.value)}
              placeholder="ex. Proverbe 3:5"
              className="w-full min-h-[44px] px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent"
            />
          </div>

          {/* Text verset */}
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
              {!verseError && !isLoadingVerse && day.verseText && day.verseReference && (
                <span className="text-xs text-green-600">
                  ✓ Preluat automat
                </span>
              )}
            </div>
            <textarea
              value={day.verseText || ''}
              onChange={(e) => onChange(dayIndex, 'verseText', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent resize-none"
            />
          </div>

          {/* Titlu */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#1E1815]/60 mb-2 font-medium">
              Titlu devoțional
            </label>
            <input
              type="text"
              value={day.title || ''}
              onChange={(e) => onChange(dayIndex, 'title', e.target.value)}
              className="w-full min-h-[44px] px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent"
            />
          </div>

          {/* Devoțional */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs uppercase tracking-wider text-[#1E1815]/60 font-medium">
                Devoțional
              </label>
              <span className="text-xs text-[#1E1815]/40">
                {wordCount} cuvinte · {readingTime} min citire
              </span>
            </div>
            <button
              onClick={() => setIsEditorOpen(true)}
              className="w-full min-h-[100px] px-4 py-3 border-2 border-dashed border-[#1E1815]/20 rounded bg-white text-[#1E1815]/60 hover:border-[#7A5363] hover:text-[#7A5363] transition text-left flex items-center justify-center"
            >
              {day.content ? 'Click pentru a edita textul...' : 'Click pentru a adăuga text...'}
            </button>
          </div>

          {/* Întrebare reflecție */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#1E1815]/60 mb-2 font-medium">
              Întrebare de reflecție
            </label>
            <textarea
              value={day.reflectionQuestion || ''}
              onChange={(e) => onChange(dayIndex, 'reflectionQuestion', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>
    </>
  );
}
