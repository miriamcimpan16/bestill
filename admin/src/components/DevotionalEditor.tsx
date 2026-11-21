import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import mammoth from 'mammoth';

interface DevotionalEditorProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export default function DevotionalEditor({ value, onChange, onClose }: DevotionalEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [currentContent, setCurrentContent] = useState(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2],
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-none min-h-full',
      },
    },
    onUpdate: ({ editor }) => {
      // Salvează conținutul local, NU apelează onChange automat
      setCurrentContent(editor.getHTML());
    },
  });

  // Click pe container deschide tastatura pe mobil
  const handleContainerClick = () => {
    if (editor && !editor.isFocused) {
      editor.chain().focus().run();
    }
  };

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  const handleImportDocx = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      if (editor) {
        editor.commands.setContent(result.value);
      }
    } catch (error) {
      console.error('Eroare la importul fișierului .docx:', error);
      alert('Nu s-a putut importa fișierul. Asigură-te că este un document Word valid.');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    // Salvează conținutul când se apasă butonul
    onChange(currentContent);
    onClose();
  };

  if (!editor) {
    return null;
  }

  const text = editor.getText();
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div 
      className="fixed inset-0 bg-[#1E1815]/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div 
        className="bg-[#F4EFEA] rounded-lg shadow-2xl w-[92vw] max-w-5xl h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1815]/10 flex-shrink-0">
          <div>
            <h3 className="text-xl text-[#1E1815] font-medium">Editare devoțional</h3>
            <p className="text-xs text-[#1E1815]/60 mt-1">
              {wordCount} cuvinte · ~{readingTime} min de citit
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#1E1815]/60 hover:text-[#1E1815] transition"
            title="Închide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Toolbar - Simplu pe mobil, complet pe desktop */}
        <div className="flex items-center gap-1 lg:gap-1.5 px-4 lg:px-6 py-3 border-b border-[#1E1815]/10 bg-[#F4EFEA]/50 flex-shrink-0 flex-wrap overflow-x-auto">
          {/* Mobile: doar esențialele */}
          <div className="flex lg:hidden items-center gap-1 flex-wrap">
            {/* Bold, Italic, List */}
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`min-h-[40px] min-w-[40px] p-2 rounded hover:bg-[#1E1815]/10 active:bg-[#1E1815]/20 transition ${
                editor.isActive('bold') ? 'bg-[#1E1815]/20' : ''
              }`}
              title="Bold"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6zM6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
              </svg>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`min-h-[40px] min-w-[40px] p-2 rounded hover:bg-[#1E1815]/10 active:bg-[#1E1815]/20 transition ${
                editor.isActive('italic') ? 'bg-[#1E1815]/20' : ''
              }`}
              title="Italic"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="4" x2="10" y2="4"/>
                <line x1="14" y1="20" x2="5" y2="20"/>
                <line x1="15" y1="4" x2="9" y2="20"/>
              </svg>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`min-h-[40px] min-w-[40px] p-2 rounded hover:bg-[#1E1815]/10 active:bg-[#1E1815]/20 transition ${
                editor.isActive('bulletList') ? 'bg-[#1E1815]/20' : ''
              }`}
              title="Listă"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <circle cx="4" cy="6" r="1" fill="currentColor"/>
                <circle cx="4" cy="12" r="1" fill="currentColor"/>
                <circle cx="4" cy="18" r="1" fill="currentColor"/>
              </svg>
            </button>
          </div>

          {/* Desktop: toolbar complet */}
          <div className="hidden lg:flex items-center gap-1.5 flex-wrap">
          {/* Undo / Redo */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-[#1E1815]/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7v6h6M21 17a9 9 0 00-9-9 9 9 0 00-9 9" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-[#1E1815]/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 7v6h-6M3 17a9 9 0 019-9 9 9 0 019 9" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="h-6 w-px bg-[#1E1815]/20 mx-1"></div>

          {/* Heading */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1.5 rounded hover:bg-[#1E1815]/10 transition text-sm font-semibold ${
              editor.isActive('heading', { level: 2 }) ? 'bg-[#1E1815]/20' : ''
            }`}
            title="Titlu secțiune (H2)"
          >
            H2
          </button>

          <div className="h-6 w-px bg-[#1E1815]/20 mx-1"></div>

          {/* Bold, Italic, Underline */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-[#1E1815]/10 transition ${
              editor.isActive('bold') ? 'bg-[#1E1815]/20' : ''
            }`}
            title="Bold (Ctrl+B)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6zM6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
            </svg>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-[#1E1815]/10 transition ${
              editor.isActive('italic') ? 'bg-[#1E1815]/20' : ''
            }`}
            title="Italic (Ctrl+I)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="4" x2="10" y2="4"/>
              <line x1="14" y1="20" x2="5" y2="20"/>
              <line x1="15" y1="4" x2="9" y2="20"/>
            </svg>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-[#1E1815]/10 transition ${
              editor.isActive('underline') ? 'bg-[#1E1815]/20' : ''
            }`}
            title="Underline (Ctrl+U)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M4 21h16"/>
            </svg>
          </button>

          <div className="h-6 w-px bg-[#1E1815]/20 mx-1"></div>

          {/* Highlight colors */}
          <span className="text-xs text-[#1E1815]/60 font-medium uppercase tracking-wider px-2">Marker:</span>
          
          <button
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#8C6D7B' }).run()}
            className={`p-2 rounded hover:bg-[#1E1815]/10 transition ${
              editor.isActive('highlight', { color: '#8C6D7B' }) ? 'bg-[#1E1815]/20' : ''
            }`}
            title="Marker mov prăfuit"
          >
            <div className="w-5 h-5 rounded" style={{ backgroundColor: '#8C6D7B' }}></div>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#5B7083' }).run()}
            className={`p-2 rounded hover:bg-[#1E1815]/10 transition ${
              editor.isActive('highlight', { color: '#5B7083' }) ? 'bg-[#1E1815]/20' : ''
            }`}
            title="Marker albastru stins"
          >
            <div className="w-5 h-5 rounded" style={{ backgroundColor: '#5B7083' }}></div>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#4A6B5D' }).run()}
            className={`p-2 rounded hover:bg-[#1E1815]/10 transition ${
              editor.isActive('highlight', { color: '#4A6B5D' }) ? 'bg-[#1E1815]/20' : ''
            }`}
            title="Marker verde de pădure"
          >
            <div className="w-5 h-5 rounded" style={{ backgroundColor: '#4A6B5D' }}></div>
          </button>

          <div className="h-6 w-px bg-[#1E1815]/20 mx-1"></div>

          {/* Bullet list */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-[#1E1815]/10 transition ${
              editor.isActive('bulletList') ? 'bg-[#1E1815]/20' : ''
            }`}
            title="Listă cu puncte"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <circle cx="4" cy="6" r="1" fill="currentColor"/>
              <circle cx="4" cy="12" r="1" fill="currentColor"/>
              <circle cx="4" cy="18" r="1" fill="currentColor"/>
            </svg>
          </button>

          {/* Blockquote */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-[#1E1815]/10 transition ${
              editor.isActive('blockquote') ? 'bg-[#1E1815]/20' : ''
            }`}
            title="Citat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
            </svg>
          </button>

          <div className="h-6 w-px bg-[#1E1815]/20 mx-1"></div>

          {/* Text align */}
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-[#1E1815]/10 transition ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-[#1E1815]/20' : ''
            }`}
            title="Aliniere stânga"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="17" y1="10" x2="3" y2="10"/>
              <line x1="21" y1="6" x2="3" y2="6"/>
              <line x1="21" y1="14" x2="3" y2="14"/>
              <line x1="17" y1="18" x2="3" y2="18"/>
            </svg>
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-[#1E1815]/10 transition ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-[#1E1815]/20' : ''
            }`}
            title="Aliniere centru"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="10" x2="6" y2="10"/>
              <line x1="21" y1="6" x2="3" y2="6"/>
              <line x1="21" y1="14" x2="3" y2="14"/>
              <line x1="18" y1="18" x2="6" y2="18"/>
            </svg>
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded hover:bg-[#1E1815]/10 transition ${
              editor.isActive({ textAlign: 'justify' }) ? 'bg-[#1E1815]/20' : ''
            }`}
            title="Aliniere justificat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="21" y1="10" x2="3" y2="10"/>
              <line x1="21" y1="6" x2="3" y2="6"/>
              <line x1="21" y1="14" x2="3" y2="14"/>
              <line x1="21" y1="18" x2="3" y2="18"/>
            </svg>
          </button>

          <div className="flex-1" />

          {/* Import Word button - doar desktop */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx"
            onChange={handleImportDocx}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="hidden lg:flex px-4 py-2 bg-[#1E1815] text-[#F4EFEA] rounded hover:bg-[#2A1F1C] transition text-xs font-medium uppercase tracking-wider items-center gap-2"
            title="Importă din Word (.docx)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Importă din Word
          </button>
          </div>
        </div>

        {/* Editor - ca o foaie Word, cu click handler pentru focus mobil */}
        <div 
          ref={editorContainerRef}
          onClick={handleContainerClick}
          className="flex-1 overflow-y-auto bg-gradient-to-b from-[#E8E3DD] to-[#F4EFEA] p-4 lg:p-8"
        >
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-sm min-h-full">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#1E1815]/10 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-transparent border border-[#1E1815] text-[#1E1815] rounded hover:bg-[#1E1815]/10 transition uppercase tracking-wider text-xs font-medium"
          >
            Anulează
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#1E1815] text-[#F4EFEA] rounded hover:bg-[#2A1F1C] transition uppercase tracking-wider text-xs font-medium"
          >
            Salvează și închide
          </button>
        </div>
      </div>
    </div>
  );
}
