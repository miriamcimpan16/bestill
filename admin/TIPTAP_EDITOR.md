# Editor Tiptap - Documentație

## Prezentare generală

Am înlocuit editorul simplu `contentEditable` cu **Tiptap**, un editor WYSIWYG profesional similar cu Microsoft Word, care oferă o experiență de editare rich-text avansată pentru conținutul devoționalelor.

## Caracteristici implementate

### 1. Aspect de pagină Word

- **Fundal alb/crem curat** cu umbră discretă
- **Margini interioare generoase** (`p-10` = 2.5rem)
- **Font Playfair Display** la 18px
- **Spațiere între rânduri** de 1.8 pentru lizibilitate optimă
- **Click oriunde pe foaie** pentru a pune cursorul și a scrie imediat
- **Undo/Redo** cu `Ctrl+Z` / `Ctrl+Y` nativ

### 2. Toolbar complet (ca în Word)

Toolbar-ul conține următoarele opțiuni de formatare:

#### Acțiuni de bază
- **Undo** (Ctrl+Z) - Revine la starea anterioară
- **Redo** (Ctrl+Y) - Refă acțiunea anulată

#### Formatare text
- **H2** - Titlu secțiune (Heading 2)
- **Bold** (Ctrl+B) - Text îngroșat
- **Italic** (Ctrl+I) - Text înclinat
- **Underline** (Ctrl+U) - Text subliniat

#### Marker / Highlight
Trei culori din paleta temei:
- **Mov prăfuit** (#8C6D7B)
- **Albastru stins** (#5B7083)
- **Verde de pădure** (#4A6B5D)

#### Structură conținut
- **Listă cu puncte** - Listă neordonată
- **Blockquote** - Citat (cu bordură mov pe stânga)

#### Aliniere text
- **Stânga** - Aliniere la stânga
- **Centru** - Aliniere la centru
- **Justificat** - Aliniere justificată

### 3. Import din Word (.docx)

Butonul **"Importă din Word"** din dreapta toolbar-ului permite:

1. Click pe buton → Se deschide selectorul de fișiere
2. Selectează un fișier `.docx`
3. Biblioteca **mammoth** convertește conținutul Word în HTML
4. Conținutul formatat se încarcă automat în editor

**Notă**: Mammoth păstrează formatarea de bază (bold, italic, liste, paragrafe), dar formatări complexe pot fi simplificate.

## Implementare tehnică

### Biblioteci folosite

```json
{
  "@tiptap/react": "^3.35.0",
  "@tiptap/starter-kit": "^3.35.0",
  "@tiptap/extension-underline": "^3.35.0",
  "@tiptap/extension-text-style": "^3.35.0",
  "@tiptap/extension-color": "^3.35.0",
  "@tiptap/extension-highlight": "^3.35.0",
  "@tiptap/extension-text-align": "^3.35.0",
  "mammoth": "^1.13.0"
}
```

### Structură componente

**DevotionalEditor.tsx** - Componenta principală
- Hook `useEditor()` din Tiptap pentru inițializare
- Extensii configurate: StarterKit, Underline, TextStyle, Color, Highlight, TextAlign
- Handler `onUpdate` pentru salvare automată în Firestore
- Handler `handleImportDocx` pentru import din Word

### Stiluri CSS personalizate

În `index.css` sunt definite stiluri specifice pentru `.ProseMirror`:
- Font, dimensiune și line-height
- Spacing între paragrafe
- Stiluri pentru heading, liste, blockquote
- Placeholder când editorul e gol
- Styling pentru selection și cursor

### Persistența datelor

- Editorul salvează conținutul ca **HTML** în Firestore
- În câmpul mic din panoul din dreapta se afișează **doar textul curat** (fără tag-uri HTML vizibile)
- Folosim `editor.getHTML()` pentru salvare și `editor.getText()` pentru preview

## Utilizare

1. **Click pe butonul de expandare** (⤢) de lângă câmpul "DEVOȚIONAL"
2. **Se deschide modalul fullscreen** cu editorul Tiptap
3. **Scrie sau formatează conținut** folosind toolbar-ul
4. **Sau importă direct din Word** cu butonul "Importă din Word"
5. **Modificările se salvează automat** la fiecare editare
6. **Click "Gata"** pentru a închide modalul

## Avantaje față de editorul anterior

| Caracteristică | Editor anterior (contentEditable) | Editor nou (Tiptap) |
|----------------|-----------------------------------|---------------------|
| Formatare text | Doar underline colorat | Bold, Italic, Underline, Heading |
| Highlight | Nu | Da, 3 culori din temă |
| Liste | Nu | Da, bullet lists |
| Citate | Nu | Da, blockquote stilizat |
| Aliniere | Nu | Stânga, Centru, Justificat |
| Import Word | Nu | Da, .docx cu mammoth |
| Undo/Redo | Browser default | Native în editor |
| Keyboard shortcuts | Limitate | Complete (Ctrl+B, Ctrl+I, etc.) |
| Aspect vizual | Simplu | Ca Word, foaie albă cu shadow |

## Exemple de formatare

### Text simplu
```
Acesta este un paragraf simplu.
```

### Text formatat
```
**Acesta este text bold** și *acesta este italic*.
```

### Heading + Listă
```
## Titlu secțiune

- Primul punct
- Al doilea punct
- Al treilea punct
```

### Citat
```
> "Căci atât de mult a iubit Dumnezeu lumea, că a dat pe singurul Lui Fiu..."
```

### Text cu highlight
Text evidențiat cu marker mov/albastru/verde pentru a sublinia cuvinte importante.

## Troubleshooting

### Editorul nu se încarcă
- Verifică consola browser pentru erori
- Asigură-te că toate pachetele npm sunt instalate: `npm install`

### Import Word nu funcționează
- Verifică că fișierul este într-adevăr `.docx` (nu `.doc` vechi)
- Mammoth suportă doar formatul modern Office Open XML

### Stilurile nu se aplică corect
- Verifică că stilurile CSS din `index.css` sunt încărcate
- Clase aplicate: `.ProseMirror` pentru container principal

## Viitor

Posibile îmbunătățiri:
- Adăugare imagini inline
- Tabele pentru structurare conținut
- Link-uri externe
- Export înapoi în Word
- Spell checker în română
