# Actualizare Editor Tiptap - Rezumat

## Ce s-a schimbat?

Am înlocuit editorul simplu `contentEditable` cu **Tiptap**, un editor WYSIWYG profesional similar cu Microsoft Word.

## Caracteristici noi

### 1. Aspect de pagină Word 📄

- Foaie albă cu umbră, margini generoase (2.5rem)
- Font Playfair Display la 18px, line-height 1.8
- Click oriunde pentru a scrie imediat
- Undo/Redo nativ (Ctrl+Z, Ctrl+Y)

### 2. Toolbar complet de formatare 🎨

**Acțiuni de bază:**
- Undo / Redo

**Formatare text:**
- H2 (Heading 2 pentru titluri de secțiuni)
- Bold (Ctrl+B)
- Italic (Ctrl+I)  
- Underline (Ctrl+U)

**Marker / Highlight:**
- Mov prăfuit (#8C6D7B)
- Albastru stins (#5B7083)
- Verde de pădure (#4A6B5D)

**Structură:**
- Listă cu puncte
- Blockquote (citat cu bordură mov)

**Aliniere:**
- Stânga / Centru / Justificat

### 3. Import din Word (.docx) 📥

Butonul **"Importă din Word"** permite:
- Click → selectează fișier `.docx`
- Biblioteca `mammoth` convertește automat în HTML
- Conținutul formatat se încarcă direct în editor

## Implementare tehnică

### Pachete instalate

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-underline \
  @tiptap/extension-text-style @tiptap/extension-color \
  @tiptap/extension-highlight @tiptap/extension-text-align mammoth
```

### Fișiere modificate

1. **DevotionalEditor.tsx** - Componenta principală
   - Integrat `useEditor()` hook din Tiptap
   - Adăugat toolbar complet cu toate opțiunile
   - Implementat import Word cu `mammoth`
   - Salvare automată în Firestore (HTML)

2. **WeeksScreen.tsx** - Preview text curat
   - Adăugat funcție `stripHtml()` pentru extragere text curat
   - Textarea din panoul dreapta afișează doar text, fără HTML
   - Word count calculat pe text curat

3. **index.css** - Stiluri Tiptap
   - Stiluri pentru `.ProseMirror` (container editor)
   - Font, spacing, heading, liste, blockquote
   - Placeholder când editorul e gol
   - Selection și cursor styling

4. **types/mammoth.d.ts** - Tipuri TypeScript
   - Declarație de modul pentru `mammoth`
   - Interfață pentru opțiuni și rezultate

## Flow de lucru

### Utilizator

1. Click pe butonul ⤢ **Extinde** de lângă câmpul DEVOȚIONAL
2. Se deschide modalul fullscreen cu editor Tiptap
3. Scrie și formatează text cu toolbar-ul
4. SAU click **"Importă din Word"** pentru a încărca un `.docx`
5. Modificările se salvează automat în Firestore (HTML)
6. Click **Gata** pentru a închide

### Persistență date

- **Firestore**: Salvează HTML complet (cu formatare)
- **Preview**: Afișează doar text curat în textarea mică
- **Word count**: Calculat pe text curat (fără tag-uri HTML)

## Comparație cu editorul anterior

| Caracteristică | Înainte (contentEditable) | Acum (Tiptap) |
|----------------|---------------------------|---------------|
| Formatare text | Doar underline colorat | Bold, Italic, Underline, H2 |
| Highlight | ❌ | ✅ 3 culori |
| Liste | ❌ | ✅ Bullet lists |
| Citate | ❌ | ✅ Blockquote |
| Aliniere | ❌ | ✅ Stânga, Centru, Justificat |
| Import Word | ❌ | ✅ .docx cu mammoth |
| Undo/Redo | Browser default | ✅ Native în editor |
| Shortcuts | Limitate | ✅ Complete (Ctrl+B, I, U, Z, Y) |
| Aspect | Simplu | ✅ Ca Word, foaie albă |

## Screenshot conceptual

```
┌─────────────────────────────────────────────────────────────────┐
│ Editare devoțional                        [X]                   │
│ 245 cuvinte · ~2 min de citit                                   │
├─────────────────────────────────────────────────────────────────┤
│ [↶][↷] │ H2 │ B I U │ Marker: ■ ■ ■ │ • " │ ≡ ≡ ≡ │ [Importă]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│     ┌───────────────────────────────────────────────┐          │
│     │                                               │          │
│     │  ## Un păstor adevărat                        │          │
│     │                                               │          │
│     │  Un păstor își cunoaște oile pe nume și      │          │
│     │  știe de ce are nevoie fiecare. Nu sunt      │          │
│     │  doar numere pentru el – sunt creaturi       │          │
│     │  cu personalitate, cu frici și speranțe.     │          │
│     │                                               │          │
│     │  > "Domnul este Păstorul meu..."             │          │
│     │                                               │          │
│     └───────────────────────────────────────────────┘          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Modificările se salvează automat                    [Gata]     │
└─────────────────────────────────────────────────────────────────┘
```

## Testare

### Teste recomandate

1. **Formatare de bază**
   - Scrie text, aplică bold/italic/underline
   - Verifică că formatarea apare corect

2. **Highlight**
   - Selectează text, aplică fiecare din cele 3 culori
   - Verifică că culorile din temă se aplică

3. **Liste și citate**
   - Creează listă cu puncte
   - Adaugă blockquote
   - Verifică styling corect

4. **Import Word**
   - Creează un fișier `.docx` simplu cu formatare (bold, liste)
   - Importă în editor
   - Verifică că formatarea de bază este păstrată

5. **Salvare și persistență**
   - Editează conținut, închide modalul
   - Verifică că textarea mică afișează text curat
   - Reîncarcă pagina, verifică că datele sunt în Firestore

6. **Undo/Redo**
   - Scrie text, apasă Ctrl+Z
   - Verifică că se anulează acțiunea
   - Apasă Ctrl+Y pentru redo

## Posibile îmbunătățiri viitoare

- [ ] Imagini inline în devoțional
- [ ] Tabele pentru structurare complexă
- [ ] Link-uri externe
- [ ] Export înapoi în Word
- [ ] Spell checker în română
- [ ] Template-uri predefinite de devoțional

## Suport

Pentru întrebări sau probleme:
- Verifică documentația Tiptap: https://tiptap.dev/
- Verifică documentația mammoth: https://github.com/mwilliamson/mammoth.js

---

**Data actualizării**: 21 noiembrie 2024  
**Versiune**: Tiptap 3.35.0, mammoth 1.13.0
