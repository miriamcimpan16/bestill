# Changelog - BEStill Admin

## 2024-11-21 - Cursor precis și modal de ștergere elegant

### 🎯 Cursor personalizat cu precizie maximă

**Probleme rezolvate**:
- Regula globală `* { cursor: ... !important; }` încetinea randarea
- Hotspot-ul cursorului era greșit (0,0 în loc de vârful real)
- Selecția textului era dificilă în input-uri și editoare

**Implementare nouă**:
```css
html, body {
  cursor: url('/mouse.png') 7 2, auto;
}

/* Cursor personalizat pe butoane */
button, a, [role="button"] {
  cursor: url('/mouse.png') 7 2, pointer;
}

/* Cursor text standard pentru editare - precizie maximă */
input, textarea, [contenteditable="true"], .ProseMirror {
  cursor: text !important;
}
```

**Beneficii**:
- Performanță îmbunătățită (fără reguli globale grele)
- Hotspot corect la coordonatele (7, 2) - vârful cursorului
- Selecție text perfectă în input-uri, textarea și editor Tiptap

### 🗑️ Modal elegant de confirmare la ștergerea categoriei

**Înainte**:
- `window.confirm()` urât din browser
- Fără stilizare, nu se potrivește cu design-ul

**Acum**:
- Modal elegant cu design consistent (card crem pe fundal estompat)
- Mesaj clar: „Ești sigură că vrei să ștergi categoria «Nume»?"
- Notă discretă: „Toate versetele din această categorie vor fi șterse definitiv."
- **Două butoane clare**:
  - **"Anulează"** - Închide fără ștergere
  - **"Șterge categoria"** - Confirmă și șterge (fundal roșu)

**Componență nouă**: `DeleteCategoryModal.tsx`

**Implementare**:
```typescript
const [categoryToDelete, setCategoryToDelete] = useState<OpenWhenCategory | null>(null);

// Deschide modalul
const handleDeleteCategory = (category: OpenWhenCategory) => {
  setCategoryToDelete(category);
};

// Confirmă ștergerea
const confirmDeleteCategory = async () => {
  await categoryService.deleteCategory(categoryToDelete.id);
  setCategoryToDelete(null); // Închide modalul
};
```

### 📂 Fișiere modificate/create

1. **src/index.css** - Cursor precis cu hotspot (7, 2)
2. **src/components/DeleteCategoryModal.tsx** (NOU) - Modal de confirmare
3. **src/components/CategoriesScreen.tsx** - Integrare modal

---

## 2024-11-21 - Cursor personalizat și salvare manuală

### ✅ Cursor personalizat pentru întreaga aplicație

**Imagine cursor**: `public/mouse.png`
- **Dimensiune**: Redimensionat de la 272x287px la **32x32px** (limita standard Chrome/Edge)
- **Format**: PNG cu transparență păstrată
- **Aplicare**: Pe toate elementele din aplicație via CSS global
- **Fallback**: `auto` dacă imaginea nu se încarcă

```css
* {
  cursor: url('/mouse.png') 0 0, auto !important;
}
```

**Beneficii**:
- Branding consistent și unic
- Experiență vizuală personalizată
- Funcționează pe butoane, input-uri, liste, toate elementele

### 💾 Salvare manuală pentru devoțional (nu mai e automat)

**Schimbări în `DevotionalEditor.tsx`**:

**Înainte**:
- Salvare automată la fiecare editare (onUpdate)
- Un singur buton "Gata"

**Acum**:
- Modificările rămân locale până la salvare explicită
- **Două butoane** în footer:
  - **"Anulează"** - Închide fără salvare (pierde modificările)
  - **"Salvează și închide"** - Salvează în Firestore + închide

**Implementare**:
```typescript
const [currentContent, setCurrentContent] = useState(value);

onUpdate: ({ editor }) => {
  setCurrentContent(editor.getHTML()); // Local only
},

const handleSave = () => {
  onChange(currentContent); // Save to Firestore
  onClose();
};
```

**Beneficii**:
- Control complet asupra salvării
- Posibilitate de anulare modificări
- Nu se salvează accidental conținut incomplet
- Mai puține operații Firestore (economie costuri)

### 📂 Fișiere modificate

1. **public/mouse.png** - Redimensionat la 32x32px
2. **src/index.css** - Adăugat cursor personalizat global
3. **src/components/DevotionalEditor.tsx** - Salvare manuală cu 2 butoane

---

## 2024-11-21 - Editor Tiptap Profesional

### ✅ Înlocuit editor simplu cu Tiptap WYSIWYG

**Editor de tip Word pentru devoționale**:
- **Aspect de pagină Word**: foaie albă cu umbră, margini generoase (2.5rem)
- **Font Playfair Display**: 18px cu line-height 1.8 pentru lizibilitate
- **Click oriunde** pentru a scrie imediat
- **Undo/Redo nativ**: Ctrl+Z / Ctrl+Y funcționează perfect

### 🎨 Toolbar complet de formatare

**Acțiuni de bază**:
- Undo (↶) / Redo (↷)

**Formatare text**:
- **H2** - Titlu secțiune (Heading 2)
- **Bold** (Ctrl+B) - Text îngroșat
- **Italic** (Ctrl+I) - Text înclinat
- **Underline** (Ctrl+U) - Text subliniat

**Marker / Highlight** (3 culori din temă):
- Mov prăfuit (#8C6D7B)
- Albastru stins (#5B7083)
- Verde de pădure (#4A6B5D)

**Structură conținut**:
- Listă cu puncte (bullet list)
- Blockquote (citat cu bordură mov)

**Aliniere text**:
- Stânga / Centru / Justificat

### 📥 Import din Word (.docx)

- Buton **"Importă din Word"** în dreapta toolbar-ului
- Biblioteca `mammoth` convertește .docx → HTML
- Formatarea de bază (bold, italic, liste, paragrafe) este păstrată

### 💾 Salvare inteligentă

- **Firestore**: Salvează HTML complet (cu toată formatarea)
- **Preview**: Textarea mică din panoul dreapta afișează **doar text curat** (fără tag-uri HTML)
- **Word count**: Calculat pe text curat pentru acuratețe

### 📦 Pachete instalate

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-underline \
  @tiptap/extension-text-style @tiptap/extension-color \
  @tiptap/extension-highlight @tiptap/extension-text-align mammoth
```

### 📂 Fișiere modificate/create

1. **DevotionalEditor.tsx** (rescris complet)
   - Integrat `useEditor()` hook din Tiptap
   - Toolbar complet cu toate opțiunile de formatare
   - Import Word cu `mammoth`
   - Salvare automată în Firestore (HTML)

2. **WeeksScreen.tsx**
   - Adăugat funcție `stripHtml()` pentru extragere text curat
   - Textarea read-only în preview (doar text, fără HTML)
   - Word count calculat pe text curat

3. **index.css**
   - Stiluri complete pentru `.ProseMirror` (container editor)
   - Font, spacing, heading, liste, blockquote
   - Placeholder când editorul e gol
   - Selection și cursor styling

4. **types/mammoth.d.ts** (NOU)
   - Declarație TypeScript pentru biblioteca `mammoth`
   - Interfață pentru opțiuni și rezultate

5. **TIPTAP_EDITOR.md** (NOU)
   - Documentație completă pentru editor
   - Exemple de utilizare
   - Troubleshooting

6. **TIPTAP_UPDATE.md** (NOU)
   - Rezumat actualizare
   - Comparație înainte/după
   - Flow de lucru

### 🔄 Comparație cu editorul anterior

| Caracteristică | Înainte | Acum |
|----------------|---------|------|
| Formatare text | Doar underline colorat | Bold, Italic, Underline, H2 |
| Highlight | ❌ | ✅ 3 culori |
| Liste | ❌ | ✅ Bullet lists |
| Citate | ❌ | ✅ Blockquote |
| Aliniere | ❌ | ✅ Stânga, Centru, Justificat |
| Import Word | ❌ | ✅ .docx cu mammoth |
| Undo/Redo | Browser default | ✅ Native în editor |
| Shortcuts | Limitate | ✅ Complete (Ctrl+B, I, U, Z, Y) |
| Aspect | Simplu | ✅ Ca Word, foaie albă |

---

## 2024-11-21 - Actualizare Tipografie

### ✅ Font Playfair Display ca font principal

- **Aplicat pe întreaga aplicație**: body, titluri, text, input-uri, textarea, butoane
- **Font elegant serif**: "Playfair Display" cu weights 400-900 (normal și italic)
- **Consistență vizuală**: același font pentru toate elementele UI
- **Configurare în index.css**: 
  ```css
  body, input, textarea, button, select, h1, h2, h3, h4, h5, h6 {
    font-family: "Playfair Display", serif;
  }
  ```

### ✅ Playwrite RO pentru branding

- **Păstrat doar pe titlul "Devoțional"** din sidebar
- **Font manuscris românesc** pentru un accent elegant și memorabil
- **Aplicat inline**: `style={{ fontFamily: '"Playwrite RO", cursive' }}`

### 📂 Fișiere modificate

1. **index.html**
   - Adăugat `preconnect` pentru Google Fonts (optimizare performanță)
   - Link complet pentru Playfair Display (400-900) și Playwrite RO (100-400)

2. **index.css**
   - Înlocuit font-stack generic cu "Playfair Display"
   - Aplicat pe body, input, textarea, button, select, h1-h6

3. **WeeksScreen.tsx**
   - Eliminat `font-serif` (acum redundant)

4. **CategoriesScreen.tsx**
   - Eliminat `font-serif` (acum redundant)

5. **Login.tsx**
   - Eliminat `font-serif` (acum redundant)

---

## 2024-11-21 - Îmbunătățiri UI

### ✅ 1. Font Playwrite RO pe titlul din sidebar

- Adăugat Google Fonts link în `index.html` pentru "Playwrite RO"
- Aplicat fontul `"Playwrite RO", cursive` pe titlul "Devoțional" din sidebar
- Font elegant, manuscris pentru branding consistent

### ✅ 2. Aliniere perfectă în header (Săptămâni)

- Titlul săptămânii, calendarul și butoanele sunt acum pe **aceeași linie orizontală**
- Toate elementele din dreapta (calendar + 2 butoane) sunt aliniate la **h-10 (40px)** 
- Layout responsive cu `flex items-center justify-between`
- Statusul ("X zile completate") și mesajul de salvare sunt pe linia a doua

### ✅ 3. Panou lateral redimensionabil

**Componentă: `ResizablePanel.tsx`**

Caracteristici:
- **Redimensionare cu drag**: mâner invizibil pe marginea stângă a panoului
- **Cursor**: `ew-resize` pentru feedback vizual clar
- **Limite**: `minWidth: 340px`, `maxWidth: 750px`, `default: 460px`
- **Hover feedback**: margine subtilă mov prăfuit la hover
- **Fără butoane vizibile**: design curat, fără elemente care ies din panou
- **State persistent**: lățimea se păstrează pe parcursul sesiunii

**Scrollbar personalizat**:
- Lățime: **6px** (subțire și discret)
- Culori: 
  - Thumb: `#8C6D7B` (mov prăfuit)
  - Thumb hover: `#7A5363` (mov mai închis)
  - Track: `rgba(196, 182, 174, 0.2)` (maro deschis transparent)
- Colțuri rotunjite: `border-radius: 3px`
- Aplicat pe clasa `.custom-scrollbar`

### 📂 Fișiere modificate

1. **index.html**
   - Adăugat link Google Fonts

2. **Dashboard.tsx**
   - Aplicat font Playwrite RO pe titlu

3. **WeeksScreen.tsx**
   - Restructurat header cu aliniere perfectă
   - Înlocuit panoul fix cu `<ResizablePanel>`
   - Importat componenta ResizablePanel

4. **index.css**
   - Adăugat stiluri `.custom-scrollbar` pentru scrollbar personalizat

5. **ResizablePanel.tsx** (NOU)
   - Componentă reutilizabilă pentru panouri redimensionabile
   - Logic de drag & drop
   - Buton collapse/expand
   - Props configurabile (min, max, default width)

### 🎨 Design improvements

- **UX mai bună**: utilizatorii pot ajusta panoul după preferințe
- **Spațiu flexibil**: mai mult spațiu pentru conținut lung sau mai puțin pentru listă
- **Feedback vizual**: animații smooth, hover states clare
- **Consistență**: scrollbar stilizat se potrivește cu paleta de culori

### 🔧 Tehnologii folosite

- React hooks: `useState`, `useRef`, `useEffect`
- TypeScript: props tipizate, type safety
- CSS-in-JS: stiluri inline + Tailwind CSS
- DOM API: event listeners pentru mouse events

---

## Versiuni anterioare

### 2024-11-21 - Release inițial

- Ecran Săptămâni cu drag & drop
- Ecran Categorii "Open when..."
- Autentificare Firebase
- Design system complet
- Interfață curată, fără imagini de fundal
