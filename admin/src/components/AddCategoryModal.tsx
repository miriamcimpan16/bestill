import { useState } from 'react';

interface AddCategoryModalProps {
  onConfirm: (title: string) => void;
  onCancel: () => void;
}

export default function AddCategoryModal({ onConfirm, onCancel }: AddCategoryModalProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onConfirm(title.trim());
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-[#1E1815]/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onCancel}
    >
      <div 
        className="bg-[#F4EFEA] rounded-lg shadow-2xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl text-[#1E1815] font-medium mb-3">
            Categorie nouă
          </h3>
          <p className="text-sm text-[#1E1815]/60">
            Alege un titlu pentru categoria „Open when..."
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-wider text-[#1E1815]/60 mb-2 font-medium">
              Titlu categorie
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="de ex. you feel like quitting"
              autoFocus
              className="w-full px-4 py-3 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 bg-transparent border border-[#1E1815] text-[#1E1815] rounded hover:bg-[#1E1815]/10 transition uppercase tracking-wider text-xs font-medium"
            >
              Anulează
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-6 py-2.5 bg-[#1E1815] text-[#F4EFEA] rounded hover:bg-[#2A1F1C] transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs font-medium"
            >
              Adaugă categoria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
