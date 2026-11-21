interface DeleteCategoryModalProps {
  categoryTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteCategoryModal({ categoryTitle, onConfirm, onCancel }: DeleteCategoryModalProps) {
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
            Ești sigură că vrei să ștergi categoria?
          </h3>
          <p className="text-lg text-[#1E1815] mb-2">
            «{categoryTitle}»
          </p>
          <p className="text-sm text-[#1E1815]/60">
            Toate versetele din această categorie vor fi șterse definitiv.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 bg-transparent border border-[#1E1815] text-[#1E1815] rounded hover:bg-[#1E1815]/10 transition uppercase tracking-wider text-xs font-medium"
          >
            Anulează
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-[#B85C5C] text-[#F4EFEA] rounded hover:bg-[#A04848] transition uppercase tracking-wider text-xs font-medium"
          >
            Șterge categoria
          </button>
        </div>
      </div>
    </div>
  );
}
