import { useState, useEffect } from 'react';
import { Day, DayStatus } from '../types';
import { weekService } from '../services/weekService';
import { getMondayOfWeek, getSundayOfWeek, formatDateISO, generateWeekDays, formatDateRO } from '../utils/dateUtils';
import ResizablePanel from './ResizablePanel';
import DevotionalEditor from './DevotionalEditor';

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
      {/* Modal Editor */}
      {isEditorOpen && (
        <DevotionalEditor
          value={days[selectedDayIndex]?.content || ''}
          onChange={(value) => handleDayChange(selectedDayIndex, 'content', value)}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      <div className="flex-1 flex gap-6 p-6 bg-[#2A1F1C] overflow-hidden">
      {/* Coloana centrală - Lista zilelor */}
      <div className="flex-1 flex flex-col">
        {/* Header cu titlu și butoane - ALINIAT PE ACEEAȘI LINIE */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-3">
            {/* Titlu în stânga */}
            <div className="flex-1">
              <h2 className="text-3xl text-[#F4EFEA] leading-tight">
                Săptămâna {mondayDay}–{sundayDay} {monthName}
              </h2>
            </div>
            
            {/* Calendar + Butoane în dreapta - TOATE LA h-10 */}
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={formatDateISO(selectedMonday)}
                onChange={handleWeekChange}
                className="h-10 px-3 bg-[#3d2e28] text-[#F4EFEA] rounded border border-[#F4EFEA]/20 focus:outline-none focus:ring-2 focus:ring-[#7A5363] text-sm"
              />
              <button
                onClick={() => handleSave('DRAFT')}
                disabled={isSaving}
                className="h-10 px-6 bg-transparent border border-[#F4EFEA] text-[#F4EFEA] rounded hover:bg-[#F4EFEA]/10 transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs font-medium whitespace-nowrap"
              >
                Salvează ciornă
              </button>
              <button
                onClick={() => handleSave('PUBLISHED')}
                disabled={isSaving}
                className="h-10 px-6 bg-[#F4EFEA] text-[#1E1815] rounded hover:bg-[#F4EFEA]/90 transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs font-medium whitespace-nowrap"
              >
                Publică săptămâna
              </button>
            </div>
          </div>

          {/* Status și mesaj pe linia a doua */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-[#F4EFEA]/60">
              {completedDays} zile completate din 7 · stare: {currentStatus === 'PUBLISHED' ? 'publicată' : 'ciornă'}
            </p>
            
            {/* Mesaj de salvare */}
            {saveMessage && (
              <div className="bg-[#7A5363] text-[#F4EFEA] px-4 py-1.5 rounded text-sm">
                {saveMessage}
              </div>
            )}
          </div>
        </div>

        {/* Tabel cu zilele */}
        <div className="flex-1 bg-[#3d2e28] rounded-lg overflow-hidden flex flex-col">
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
      <ResizablePanel minWidth={340} maxWidth={750} defaultWidth={460}>
        <h3 className="text-2xl text-[#1E1815] mb-1">
          {dayNames[selectedDayIndex]} · Ziua {selectedDayIndex + 1}
        </h3>
        <p className="text-xs uppercase tracking-wider text-[#1E1815]/50 mb-6">
          {formatDateRO(days[selectedDayIndex]?.date || formatDateISO(selectedMonday))}
        </p>
        
        <div className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#1E1815]/60 mb-2 font-medium">
              Referință
            </label>
            <input
              type="text"
              value={days[selectedDayIndex]?.verseReference || ''}
              onChange={(e) => handleDayChange(selectedDayIndex, 'verseReference', e.target.value)}
              placeholder="Psalmul 23:1"
              className="w-full px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#1E1815]/60 mb-2 font-medium">
              Textul versetului
            </label>
            <textarea
              value={days[selectedDayIndex]?.verseText || ''}
              onChange={(e) => handleDayChange(selectedDayIndex, 'verseText', e.target.value)}
              placeholder="Domnul este Păstorul meu: nu voi duce lipsă de nimic."
              rows={3}
              className="w-full px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent resize-none"
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
              className="w-full px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs uppercase tracking-wider text-[#1E1815]/60 font-medium">
                Devoțional
              </label>
              <button
                onClick={() => setIsEditorOpen(true)}
                className="text-[#7A5363] hover:text-[#1E1815] transition flex items-center gap-1 text-xs"
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
              rows={8}
              className="w-full min-h-[200px] px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent resize-y leading-relaxed"
              readOnly
              title="Click pe 'Extinde' pentru a edita conținutul"
            />
            <div className="flex justify-end mt-1">
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
              rows={3}
              className="w-full px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent resize-none"
            />
          </div>
        </div>
      </ResizablePanel>
      </div>
    </>
  );
}
