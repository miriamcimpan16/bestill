import { useState, useEffect } from 'react';
import { Day, DayStatus } from '../types';
import { weekService } from '../services/weekService';
import { getMondayOfWeek, getSundayOfWeek, formatDateISO, generateWeekDays, formatDateRO } from '../utils/dateUtils';
import { fetchBibleVerse, isValidReference } from '../utils/bibleLookup';
import { useIsMobile } from '../hooks/useIsMobile';
import ResizablePanel from './ResizablePanel';
import DevotionalEditor from './DevotionalEditor';
import MobileWeekDrawer from './MobileWeekDrawer';

// Helper pentru a extrage text curat din HTML
const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export default function WeeksScreen() {
  const [selectedMonday, setSelectedMonday] = useState<Date>(() => getMondayOfWeek(new Date()));
  const [days, setDays] = useState<Day[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [currentStatus, setCurrentStatus] = useState<DayStatus>('DRAFT');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoadingVerse, setIsLoadingVerse] = useState(false);
  const [verseError, setVerseError] = useState<string | null>(null);
  const [verseSearchTimeout, setVerseSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  // Inițializează zilele pentru săptămâna selectată
  useEffect(() => {
    loadWeekData();
  }, [selectedMonday]);

  const loadWeekData = async () => {
    const weekStart = formatDateISO(selectedMonday);
    const weekId = `week_${weekStart}`;
    
    try {
      const existingWeek = await weekService.getWeek(weekId);
      
      if (existingWeek && existingWeek.days.length > 0) {
        // Sortează zilele după order
        const sortedDays = [...existingWeek.days].sort((a, b) => a.order - b.order);
        setDays(sortedDays);
        setCurrentStatus(existingWeek.status);
      } else {
        // Generează zile noi goale
        const weekDays = generateWeekDays(selectedMonday);
        const newDays: Day[] = weekDays.map((day, index) => ({
          dayOfWeek: index + 1,
          date: day.date,
          verseReference: '',
          verseText: '',
          title: '',
          content: '',
          reflectionQuestion: '',
          order: index + 1
        }));
        setDays(newDays);
        setCurrentStatus('DRAFT');
      }
    } catch (error) {
      console.error('Eroare la încărcarea săptămânii:', error);
      // Generează zile noi în caz de eroare
      const weekDays = generateWeekDays(selectedMonday);
      const newDays: Day[] = weekDays.map((day, index) => ({
        dayOfWeek: index + 1,
        date: day.date,
        verseReference: '',
        verseText: '',
        title: '',
        content: '',
        reflectionQuestion: '',
        order: index + 1
      }));
      setDays(newDays);
      setCurrentStatus('DRAFT');
    }
  };

  const handleDayChange = (index: number, field: keyof Day, value: string) => {
    const updatedDays = [...days];
    updatedDays[index] = {
      ...updatedDays[index],
      [field]: value
    };
    setDays(updatedDays);
    
    // Dacă se schimbă referința versetului, verifică validitatea și caută automat textul
    if (field === 'verseReference') {
      handleVerseLookup(value, index);
    }
  };

  const handleVerseLookup = async (reference: string, dayIndex: number) => {
    // Curăță timeout-ul anterior
    if (verseSearchTimeout) {
      clearTimeout(verseSearchTimeout);
    }
    
    // Resetează starea
    setVerseError(null);
    
    // Verifică dacă referința are format valid complet (ex: "Proverbe 3:5")
    if (!isValidReference(reference)) {
      setIsLoadingVerse(false);
      return; // NU face căutare dacă formatul nu e complet
    }
    
    setIsLoadingVerse(true);
    
    // Programează căutarea după 800ms (debounce)
    const timeout = setTimeout(async () => {
      const result = await fetchBibleVerse(reference);
      
      if (result) {
        // Actualizează DOAR textul versetului folosind forma funcțională (evită stale closure)
        setDays(prevDays => {
          const updatedDays = [...prevDays];
          updatedDays[dayIndex] = {
            ...updatedDays[dayIndex],
            verseText: result.text // Actualizează DOAR verseText, păstrând verseReference intact
          };
          return updatedDays;
        });
        setVerseError(null);
      } else {
        setVerseError('Referință negăsită — poți scrie textul manual');
      }
      
      setIsLoadingVerse(false);
    }, 800); // Debounce 800ms
    
    setVerseSearchTimeout(timeout);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedDays = [...days];
    const draggedDay = updatedDays[draggedIndex];
    
    // Elimină elementul din poziția veche
    updatedDays.splice(draggedIndex, 1);
    // Inserează în poziția nouă
    updatedDays.splice(index, 0, draggedDay);
    
    // Actualizează ordinea
    updatedDays.forEach((day, idx) => {
      day.order = idx + 1;
      day.dayOfWeek = idx + 1;
    });
    
    setDays(updatedDays);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = async (status: DayStatus) => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const weekStart = formatDateISO(selectedMonday);
      const sunday = getSundayOfWeek(new Date(selectedMonday));
      const weekEnd = formatDateISO(sunday);

      await weekService.saveWeek({
        weekStart,
        weekEnd,
        status,
        days
      });

      setCurrentStatus(status);
      setSaveMessage(status === 'DRAFT' ? 'Salvat ca ciornă!' : 'Publicat cu succes!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Eroare la salvare:', error);
      setSaveMessage('Eroare la salvare. Încearcă din nou.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedMonday(getMondayOfWeek(newDate));
  };

  const completedDays = days.filter(d => 
    d.verseReference && d.verseText && d.title && d.content && d.reflectionQuestion
  ).length;

  const dayNames = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];

  // Formatare dată săptămână pentru titlu
  const monday = new Date(selectedMonday);
  const sunday = getSundayOfWeek(new Date(selectedMonday));
  
  const mondayDay = monday.getDate();
  const sundayDay = sunday.getDate();
  const months = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
  const monthName = months[monday.getMonth()];

  // Contor de cuvinte și timp de citire pentru devoțional
  const getWordCount = (text: string) => {
    const plainText = stripHtml(text); // Extrage text curat din HTML
    return plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  };

  const getReadingTime = (wordCount: number) => {
    return Math.ceil(wordCount / 200); // ~200 cuvinte pe minut
  };

  const devotionalWordCount = getWordCount(days[selectedDayIndex]?.content || '');
  const devotionalReadingTime = getReadingTime(devotionalWordCount);

  return (
    <>
      {/* Mobile Drawer pentru editare zi */}
      {isMobile && (
        <MobileWeekDrawer
          day={days[selectedDayIndex] || {} as Day}
          dayIndex={selectedDayIndex}
          dayName={dayNames[selectedDayIndex]}
          dayDate={formatDateRO(days[selectedDayIndex]?.date || formatDateISO(selectedMonday))}
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          onChange={handleDayChange}
          isLoadingVerse={isLoadingVerse}
          verseError={verseError}
          wordCount={devotionalWordCount}
          readingTime={devotionalReadingTime}
        />
      )}

      {/* Modal Editor Desktop */}
      {!isMobile && isEditorOpen && (
        <DevotionalEditor
          value={days[selectedDayIndex]?.content || ''}
          onChange={(value) => handleDayChange(selectedDayIndex, 'content', value)}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      <div className="flex-1 flex gap-6 p-4 lg:p-6 bg-[#2A1F1C] overflow-y-visible lg:overflow-hidden flex-col lg:flex-row max-w-full">
      {/* MOBILE/TABLET: Lista zilelor ca carduri compacte (< 1024px) */}
      <div className="flex lg:hidden flex-1 flex-col space-y-4 w-full max-w-full">
        {/* Header mobil cu selector și butoane */}
        <div className="space-y-3 w-full max-w-full">
          <h2 className="text-2xl text-[#F4EFEA] leading-tight">
            Săptămâna {mondayDay}–{sundayDay} {monthName}
          </h2>
          
          {/* Selector săptămână full-width */}
          <input
            type="date"
            value={formatDateISO(selectedMonday)}
            onChange={handleWeekChange}
            className="w-full max-w-full min-h-[44px] px-3 bg-[#3d2e28] text-[#F4EFEA] rounded border border-[#F4EFEA]/20 focus:outline-none focus:ring-2 focus:ring-[#7A5363]"
          />
          
          {/* Butoane pe 2 coloane */}
          <div className="grid grid-cols-2 gap-2 w-full max-w-full">
            <button
              onClick={() => handleSave('DRAFT')}
              disabled={isSaving}
              className="min-h-[44px] px-4 bg-transparent border border-[#F4EFEA] text-[#F4EFEA] rounded active:bg-[#F4EFEA]/10 transition disabled:opacity-50 uppercase tracking-wider text-xs font-medium"
            >
              Ciornă
            </button>
            <button
              onClick={() => handleSave('PUBLISHED')}
              disabled={isSaving}
              className="min-h-[44px] px-4 bg-[#F4EFEA] text-[#1E1815] rounded active:bg-[#F4EFEA]/90 transition disabled:opacity-50 uppercase tracking-wider text-xs font-medium"
            >
              Publică
            </button>
          </div>

          {/* Status */}
          <p className="text-sm text-[#F4EFEA]/60">
            {completedDays}/7 zile · {currentStatus === 'PUBLISHED' ? 'publicată' : 'ciornă'}
          </p>

          {/* Mesaj salvare */}
          {saveMessage && (
            <div className="bg-[#7A5363] text-[#F4EFEA] px-4 py-2 rounded text-sm">
              {saveMessage}
            </div>
          )}
        </div>

        {/* Lista zilelor ca carduri */}
        <div className="flex-1 overflow-y-auto space-y-2 w-full max-w-full">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedDayIndex(index);
                setIsMobileDrawerOpen(true);
              }}
              className="w-full max-w-full bg-[#3d2e28] rounded-lg p-4 text-left active:bg-[#7A5363] transition min-h-[80px]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-[#F4EFEA]">{dayNames[index]}</span>
                <span className="text-xs text-[#F4EFEA]/60">Ziua {index + 1}</span>
              </div>
              <div className="text-sm text-[#F4EFEA]/70 truncate">
                {day.verseReference || <span className="text-[#F4EFEA]/40">Fără referință</span>}
              </div>
              <div className="text-sm text-[#F4EFEA]/70 truncate mt-1">
                {day.title || <span className="text-[#F4EFEA]/40">Fără titlu</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP: Layout original cu tabel și panel lateral (>= 1024px) */}
      <div className="hidden lg:flex lg:flex-1 flex-col lg:flex-row lg:gap-6 lg:h-full lg:overflow-hidden w-full max-w-full">
      {/* Coloana centrală - Lista zilelor */}
      <div className="flex-1 min-w-0 flex flex-col lg:overflow-y-auto w-full max-w-full">
        {/* Header */}
        <div className="mb-6">
          {/* Linia 1: Titlu + Butoane */}
          <div className="flex items-center justify-between gap-4 mb-3">
            {/* Titlu săptămână */}
            <h2 className="text-3xl text-[#F4EFEA] leading-tight">
              Săptămâna {mondayDay}–{sundayDay} {monthName}
            </h2>
            
            {/* Butoane în dreapta */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSave('DRAFT')}
                disabled={isSaving}
                className="px-5 py-2 bg-transparent border border-[#F4EFEA] text-[#F4EFEA] rounded hover:bg-[#F4EFEA]/10 transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs font-medium whitespace-nowrap"
              >
                Salvează ciornă
              </button>
              <button
                onClick={() => handleSave('PUBLISHED')}
                disabled={isSaving}
                className="px-5 py-2 bg-[#F4EFEA] text-[#1E1815] rounded hover:bg-[#F4EFEA]/90 transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs font-medium whitespace-nowrap"
              >
                Publică săptămâna
              </button>
            </div>
          </div>

          {/* Linia 2: Status + Selector dată + Mesaj */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-[#F4EFEA]/60">
              {completedDays} zile completate din 7 · stare: {currentStatus === 'PUBLISHED' ? 'ciornă' : 'ciornă'}
            </p>
            
            {/* Selector dată */}
            <input
              type="date"
              value={formatDateISO(selectedMonday)}
              onChange={handleWeekChange}
              className="px-3 py-1 bg-[#3d2e28] text-[#F4EFEA] rounded border border-[#F4EFEA]/20 focus:outline-none focus:ring-2 focus:ring-[#7A5363] text-sm"
            />
            
            {/* Mesaj de salvare */}
            {saveMessage && (
              <div className="bg-[#7A5363] text-[#F4EFEA] px-4 py-1.5 rounded text-sm">
                {saveMessage}
              </div>
            )}
          </div>
        </div>

        {/* Tabel cu zilele */}
        <div className="flex-1 bg-[#3d2e28] rounded-lg overflow-y-visible lg:overflow-hidden flex flex-col">
          {/* Header tabel */}
          <div className="grid grid-cols-[140px_180px_1fr] items-center gap-4 px-5 py-3 bg-[#2A1F1C] border-b border-[#F4EFEA]/10">
            <div className="text-xs uppercase tracking-wider text-[#F4EFEA]/60 font-medium">
              Ziua
            </div>
            <div className="text-xs uppercase tracking-wider text-[#F4EFEA]/60 font-medium">
              Verset
            </div>
            <div className="text-xs uppercase tracking-wider text-[#F4EFEA]/60 font-medium">
              Devoțional
            </div>
          </div>

          {/* Lista zilelor - scrollable */}
          <div className="flex-1 overflow-y-auto">
            {days.map((day, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => setSelectedDayIndex(index)}
                className={`grid grid-cols-[140px_180px_1fr] items-center gap-4 px-5 py-4 cursor-pointer transition border-b border-[#F4EFEA]/5 ${
                  draggedIndex === index ? 'opacity-50' : ''
                } ${
                  selectedDayIndex === index 
                    ? 'bg-[#7A5363] hover:bg-[#7A5363]' 
                    : 'hover:bg-[#4d3e38]'
                }`}
              >
                <div className="flex items-center gap-3 text-[#F4EFEA]">
                  <span className="text-lg cursor-grab active:cursor-grabbing">≡</span>
                  <span className="font-medium">{dayNames[index]}</span>
                </div>
                <div className="text-[#F4EFEA] text-sm truncate">
                  {day.verseReference || <span className="text-[#F4EFEA]/40">Referință</span>}
                </div>
                <div className="text-[#F4EFEA] text-sm truncate">
                  {day.title || <span className="text-[#F4EFEA]/40">Titlu devoțional</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coloana dreaptă - Panel editare REDIMENSIONABIL */}
      <div className="w-full lg:w-[460px] lg:shrink-0 lg:h-screen lg:overflow-hidden">
      <ResizablePanel minWidth={380} maxWidth={700} defaultWidth={460}>
        <div className="space-y-5">
          <div>
            <h3 className="text-2xl text-[#1E1815] mb-1">
              {dayNames[selectedDayIndex]} · Ziua {selectedDayIndex + 1}
            </h3>
            <p className="text-xs uppercase tracking-wider text-[#1E1815]/50">
              {formatDateRO(days[selectedDayIndex]?.date || formatDateISO(selectedMonday))}
            </p>
          </div>
        
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs uppercase tracking-wider text-[#1E1815]/60 font-medium">
                Referință
              </label>
              {isLoadingVerse && (
                <span className="text-xs text-[#7A5363] flex items-center gap-1">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Caut versetul...
                </span>
              )}
            </div>
            <input
              type="text"
              value={days[selectedDayIndex]?.verseReference || ''}
              onChange={(e) => handleDayChange(selectedDayIndex, 'verseReference', e.target.value)}
              placeholder="Psalmul 23:1"
              className="w-full box-border px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent"
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
              {!verseError && !isLoadingVerse && days[selectedDayIndex]?.verseText && days[selectedDayIndex]?.verseReference && (
                <span className="text-xs text-green-600">
                  ✓ Verset preluat automat
                </span>
              )}
            </div>
            <textarea
              value={days[selectedDayIndex]?.verseText || ''}
              onChange={(e) => handleDayChange(selectedDayIndex, 'verseText', e.target.value)}
              placeholder="Domnul este Păstorul meu: nu voi duce lipsă de nimic."
              rows={3}
              className="w-full box-border px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#1E1815]/60 mb-2 font-medium">
              Titlul devoționalului
            </label>
            <input
              type="text"
              value={days[selectedDayIndex]?.title || ''}
              onChange={(e) => handleDayChange(selectedDayIndex, 'title', e.target.value)}
              placeholder="Nimic nu-ți lipsește"
              className="w-full box-border px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs uppercase tracking-wider text-[#1E1815]/60 font-medium">
                Devoțional
              </label>
              <button
                onClick={() => setIsEditorOpen(true)}
                className="text-[#7A5363] hover:text-[#1E1815] transition flex items-center gap-1.5 text-xs"
                title="Scrie pe ecran mare"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Extinde</span>
              </button>
            </div>
            <textarea
              value={stripHtml(days[selectedDayIndex]?.content || '')}
              onChange={(e) => handleDayChange(selectedDayIndex, 'content', e.target.value)}
              placeholder="Un păstor își cunoaște oile pe nume și știe de ce are nevoie fiecare."
              rows={6}
              className="w-full box-border min-h-[160px] px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent resize-y leading-relaxed"
              readOnly
              title="Click pe 'Extinde' pentru a edita conținutul"
            />
            <div className="flex justify-end mt-2">
              <p className="text-xs text-[#1E1815]/50">
                {devotionalWordCount} cuvinte · ~{devotionalReadingTime} min de citit
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#1E1815]/60 mb-2 font-medium">
              Întrebare de reflecție
            </label>
            <textarea
              value={days[selectedDayIndex]?.reflectionQuestion || ''}
              onChange={(e) => handleDayChange(selectedDayIndex, 'reflectionQuestion', e.target.value)}
              placeholder="Unde ai simțit grija lui Dumnezeu săptămâna aceasta?"
              rows={2}
              className="w-full box-border px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent resize-none"
            />
          </div>
        </div>
        </div>
      </ResizablePanel>
      </div>
      </div>
      </div>
    </>
  );
}
