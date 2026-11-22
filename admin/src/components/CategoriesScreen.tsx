import { useState, useEffect } from 'react';
import { OpenWhenCategory } from '../types';
import { categoryService } from '../services/categoryService';
import { fetchBibleVerse, isValidReference } from '../utils/bibleLookup';
import { useIsMobile } from '../hooks/useIsMobile';
import DeleteCategoryModal from './DeleteCategoryModal';
import MobileCategoryDrawer from './MobileCategoryDrawer';

const DEFAULT_CATEGORIES = [
  'Open when you failed an exam.',
  'Open when you feel behind everyone.',
  "Open when you're scared about your future.",
  "Open when you can't sleep.",
  'Open when you feel spiritually distant.',
  'Open when you miss home.',
  'Open when you have no motivation.',
  'Open when you witnessed suffering.',
  'Open when you feel like quitting.',
  'Open when you need a reminder that God loves you.'
];

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<OpenWhenCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<OpenWhenCategory | null>(null);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newVerseRef, setNewVerseRef] = useState('');
  const [newVerseText, setNewVerseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<OpenWhenCategory | null>(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(false);
  const [verseError, setVerseError] = useState<string | null>(null);
  const [verseSearchTimeout, setVerseSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    initializeCategories();
  }, []);

  const initializeCategories = async () => {
    try {
      setIsLoading(true);
      const existingCategories = await categoryService.getAllCategories();
      
      // Verifică fiecare categorie individual după titlu
      const existingTitles = existingCategories.map(c => c.title);
      const missingCategories = DEFAULT_CATEGORIES.filter(title => !existingTitles.includes(title));
      
      if (missingCategories.length > 0) {
        console.log(`Lipsesc ${missingCategories.length} categorii, le adaug...`);
        
        for (const title of missingCategories) {
          const categoryId = `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await categoryService.saveCategory({
            id: categoryId,
            title: title,
            verses: []
          });
          // Așteptare mică între adăugări pentru a evita ID-uri duplicate
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        setMessage(`${missingCategories.length} categorii adăugate cu succes!`);
        setTimeout(() => setMessage(''), 3000);
      }
      
      // Reîncarcă categoriile
      const updatedCategories = await categoryService.getAllCategories();
      setCategories(updatedCategories);
      if (updatedCategories.length > 0) {
        setSelectedCategory(updatedCategories[0]);
      }
    } catch (error) {
      console.error('Eroare la inițializarea categoriilor:', error);
      setMessage('Eroare la încărcarea categoriilor.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Eroare la încărcarea categoriilor:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryTitle.trim()) {
      setMessage('Te rog introdu un titlu pentru categorie');
      return;
    }

    setIsLoading(true);
    try {
      const categoryId = `category_${Date.now()}`;
      await categoryService.saveCategory({
        id: categoryId,
        title: newCategoryTitle,
        verses: []
      });

      setMessage('Categorie adăugată cu succes!');
      setNewCategoryTitle('');
      await loadCategories();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Eroare la adăugarea categoriei:', error);
      setMessage('Eroare la adăugare. Încearcă din nou.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerseLookup = async (reference: string) => {
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
        // Actualizează DOAR textul versetului, NU referința!
        setNewVerseText(result.text);
        setVerseError(null);
      } else {
        setVerseError('Referință negăsită — poți scrie textul manual');
      }
      
      setIsLoadingVerse(false);
    }, 800); // Debounce 800ms
    
    setVerseSearchTimeout(timeout);
  };

  const handleAddVerse = async () => {
    if (!selectedCategory) {
      setMessage('Te rog selectează o categorie');
      return;
    }

    if (!newVerseRef.trim() || !newVerseText.trim()) {
      setMessage('Te rog completează ambele câmpuri pentru verset');
      return;
    }

    setIsLoading(true);
    try {
      const order = selectedCategory.verses.length + 1;
      
      await categoryService.addVerse(selectedCategory.id, {
        verseReference: newVerseRef,
        verseText: newVerseText,
        order
      });

      setMessage('Verset adăugat cu succes!');
      setNewVerseRef('');
      setNewVerseText('');
      await loadCategories();
      
      // Actualizează categoria selectată
      const updatedCategory = await categoryService.getCategory(selectedCategory.id);
      if (updatedCategory) {
        setSelectedCategory(updatedCategory);
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Eroare la adăugarea versetului:', error);
      setMessage('Eroare la adăugare. Încearcă din nou.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVerse = async (verseId: string) => {
    if (!selectedCategory) return;

    setIsLoading(true);
    try {
      await categoryService.deleteVerse(selectedCategory.id, verseId);
      
      setMessage('Verset șters cu succes!');
      await loadCategories();
      
      // Actualizează categoria selectată
      const updatedCategory = await categoryService.getCategory(selectedCategory.id);
      if (updatedCategory) {
        setSelectedCategory(updatedCategory);
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Eroare la ștergerea versetului:', error);
      setMessage('Eroare la ștergere. Încearcă din nou.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (category: OpenWhenCategory) => {
    // Deschide modalul de confirmare
    setCategoryToDelete(category);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setIsLoading(true);
    try {
      await categoryService.deleteCategory(categoryToDelete.id);
      
      setMessage('Categorie ștearsă cu succes!');
      await loadCategories();
      
      // Dacă categoria ștearsă era selectată, selectează prima categorie rămasă
      if (selectedCategory?.id === categoryToDelete.id) {
        const updatedCategories = await categoryService.getAllCategories();
        setSelectedCategory(updatedCategories.length > 0 ? updatedCategories[0] : null);
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Eroare la ștergerea categoriei:', error);
      setMessage('Eroare la ștergere. Încearcă din nou.');
    } finally {
      setIsLoading(false);
      setCategoryToDelete(null); // Închide modalul
    }
  };

  const handleCategoryClick = (category: OpenWhenCategory) => {
    setSelectedCategory(category);
    if (isMobile) {
      setIsMobileDrawerOpen(true);
    }
  };

  const handleVerseLookupMobile = (reference: string) => {
    setNewVerseRef(reference);
    handleVerseLookup(reference);
  };

  return (
    <>
      {/* Modal de confirmare ștergere */}
      {categoryToDelete && (
        <DeleteCategoryModal
          categoryTitle={categoryToDelete.title}
          onConfirm={confirmDeleteCategory}
          onCancel={() => setCategoryToDelete(null)}
        />
      )}

      {/* Mobile Drawer pentru editare categorie */}
      {isMobile && selectedCategory && (
        <MobileCategoryDrawer
          category={selectedCategory}
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          onDeleteCategory={handleDeleteCategory}
          onDeleteVerse={handleDeleteVerse}
          onAddVerse={handleAddVerse}
          newVerseRef={newVerseRef}
          setNewVerseRef={handleVerseLookupMobile}
          newVerseText={newVerseText}
          setNewVerseText={setNewVerseText}
          isLoadingVerse={isLoadingVerse}
          verseError={verseError}
          isLoading={isLoading}
        />
      )}

    <div className="flex-1 flex gap-6 p-4 lg:p-6 bg-[#2A1F1C] overflow-y-visible lg:overflow-hidden flex-col lg:flex-row max-w-full lg:h-screen">
      {/* MOBILE/TABLET: Layout vertical (< 1024px) */}
      {/* DESKTOP: Layout orizontal (>= 1024px) */}
      
      {/* Lista categoriilor */}
      <div className="w-full lg:w-auto lg:flex-[0.4] flex flex-col max-w-full">
        {/* Header */}
        <div className="mb-4 lg:mb-6 w-full max-w-full">
          <div className="flex items-start justify-between mb-3 flex-col lg:flex-row gap-3 w-full max-w-full">
            <div className="flex-1 w-full max-w-full">
              <h2 className="text-2xl lg:text-3xl text-[#F4EFEA] mb-2">
                Categorii „Open when..."
              </h2>
              <p className="text-sm text-[#F4EFEA]/60">
                {categories.length} categorii
              </p>
            </div>
            
            <button
              onClick={() => {
                const title = prompt('Titlu categorie nouă (ex: "you feel like quitting"):');
                if (title) {
                  setNewCategoryTitle(title);
                  setTimeout(() => handleAddCategory(), 0);
                }
              }}
              disabled={isLoading}
              className="w-full lg:w-auto min-h-[44px] px-6 py-2.5 bg-[#F4EFEA] text-[#1E1815] rounded hover:bg-[#F4EFEA]/90 active:bg-[#F4EFEA]/80 transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs font-medium"
            >
              Categorie nouă
            </button>
          </div>

          {/* Mesaj */}
          {message && (
            <div className="bg-[#7A5363] text-[#F4EFEA] px-4 py-2 rounded text-sm inline-block">
              {message}
            </div>
          )}
        </div>

        {/* Lista categoriilor */}
        <div className="flex-1 bg-[#3d2e28] rounded-lg overflow-y-visible lg:overflow-hidden w-full max-w-full">
          <div className="h-full overflow-y-auto">
            {categories.length === 0 ? (
              <div className="flex items-center justify-center h-full text-[#F4EFEA]/40">
                {isLoading ? 'Se încarcă...' : 'Nicio categorie. Adaugă una nouă!'}
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className={`px-4 lg:px-6 py-4 cursor-pointer transition border-b border-[#F4EFEA]/5 group min-h-[60px] lg:min-h-0 w-full max-w-full ${
                    selectedCategory?.id === category.id
                      ? 'bg-[#7A5363] hover:bg-[#7A5363]'
                      : 'hover:bg-[#4d3e38] active:bg-[#4d3e38]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div 
                      className="flex-1 text-[#F4EFEA] font-medium"
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-[#F4EFEA]/60 text-sm">
                        {category.verses.length} v.
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category);
                        }}
                        disabled={isLoading}
                        className="opacity-0 group-hover:opacity-100 transition text-red-400 hover:text-red-300 disabled:opacity-50 p-1"
                        title="Șterge categoria"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Panoul detalii categorie - DOAR DESKTOP (>= 1024px) */}
      {selectedCategory ? (
        <div className="hidden lg:block w-full lg:w-[420px] bg-[#F4EFEA] rounded-lg p-4 lg:p-6 overflow-y-auto flex-shrink-0 mt-4 lg:mt-0 max-w-full lg:h-full">
          <div className="flex items-start justify-between mb-1 w-full max-w-full">
            <h3 className="text-2xl text-[#1E1815] flex-1">
              {selectedCategory.title}
            </h3>
            <button
              onClick={() => handleDeleteCategory(selectedCategory)}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700 transition disabled:opacity-50 p-1"
              title="Șterge categoria"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <p className="text-xs uppercase tracking-wider text-[#1E1815]/50 mb-6">
            Titlul categoriei
          </p>

          <div className="mb-6">
            <input
              type="text"
              value={selectedCategory.title}
              onChange={async (e) => {
                const newTitle = e.target.value;
                setSelectedCategory({ ...selectedCategory, title: newTitle });
                
                // Salvează automat cu debounce
                clearTimeout((window as any).categoryTitleTimeout);
                (window as any).categoryTitleTimeout = setTimeout(async () => {
                  await categoryService.saveCategory({
                    id: selectedCategory.id,
                    title: newTitle,
                    verses: []
                  });
                  await loadCategories();
                }, 500);
              }}
              placeholder="Open when you feel like quitting"
              className="w-full px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs uppercase tracking-wider text-[#1E1815]/60 mb-3 font-medium">
              Versete în categorie
            </label>
            
            <div className="space-y-3 mb-4 max-h-[280px] overflow-y-auto">
              {selectedCategory.verses.length === 0 ? (
                <div className="text-[#1E1815]/40 text-sm text-center py-8 border border-dashed border-[#1E1815]/20 rounded">
                  Niciun verset adăugat încă
                </div>
              ) : (
                selectedCategory.verses.map((verse) => (
                  <div 
                    key={verse.id}
                    className="bg-white border border-[#1E1815]/20 rounded p-3 relative group hover:border-[#7A5363]/30 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[#1E1815] text-sm mb-1">
                          {verse.verseReference}
                        </div>
                        <div className="text-[#1E1815]/70 text-sm line-clamp-2">
                          {verse.verseText}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteVerse(verse.id)}
                        disabled={isLoading}
                        className="opacity-0 group-hover:opacity-100 transition flex-shrink-0 text-red-600 hover:text-red-700 disabled:opacity-50"
                        title="Șterge"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-[#1E1815]/20 pt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs uppercase tracking-wider text-[#1E1815]/60 font-medium">
                Verset nou · Referință
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
              value={newVerseRef}
              onChange={(e) => {
                setNewVerseRef(e.target.value);
                // Apelează handleVerseLookup mereu - funcția va verifica validitatea
                handleVerseLookup(e.target.value);
              }}
              placeholder="de ex. Isaia 40:31"
              className="w-full px-4 py-2.5 mb-4 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent"
            />

            <div className="flex items-center justify-between mb-3">
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
                  ✓ Verset preluat automat
                </span>
              )}
            </div>
            <textarea
              value={newVerseText}
              onChange={(e) => setNewVerseText(e.target.value)}
              placeholder="Textul versetului..."
              rows={4}
              className="w-full px-4 py-2.5 mb-4 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent resize-none"
            />

            <button
              onClick={handleAddVerse}
              disabled={isLoading || !newVerseRef.trim() || !newVerseText.trim()}
              className="w-full min-h-[44px] py-3 bg-[#1E1815] text-[#F4EFEA] rounded hover:bg-[#2A1F1C] active:bg-[#2A1F1C] transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs font-medium"
            >
              Adaugă versetul
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex w-full lg:w-[420px] max-w-full bg-[#F4EFEA] rounded-lg p-6 items-center justify-center flex-shrink-0 mt-4 lg:mt-0 lg:h-full">
          <div className="text-[#1E1815]/40 text-center">
            <p className="text-lg mb-2">Selectează o categorie</p>
            <p className="text-sm">sau creează una nouă</p>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
