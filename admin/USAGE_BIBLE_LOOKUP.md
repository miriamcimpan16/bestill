# 🔍 Cum să Folosești Bible Verse Lookup

## Quick Start

### 1️⃣ În WeeksScreen sau CategoriesScreen

Funcționalitatea este **deja integrată și activă**. Nu trebuie să faci nimic special!

#### Pași:

1. **Selectează o săptămână** (în WeeksScreen) sau **o categorie** (în CategoriesScreen)
2. **Scrie referința biblică** în câmpul "REFERINȚĂ BIBLICĂ"
   - Ex: `Proverbe 3:5`
   - Ex: `Proverbe 3:5-6` (pentru interval)
   - Ex: `Psalmul 23:1`
   - Ex: `Ioan 3:16`
3. **Așteaptă 800ms** (debounce automat)
4. **Textul versetului** va apărea automat în câmpul "TEXTUL VERSETULUI"

### 2️⃣ Formatul Referințelor

#### Format Valid: `Cartea Capitol:Verset`

✅ **Exemple Corecte:**
```
Geneza 1:1
Exodul 20:3
Proverbe 3:5
Proverbe 3:5-6      ← interval
Psalmul 23:1
Psalmul 119:105
Ioan 3:16
Romani 8:28
Efeseni 2:8-9       ← interval
```

❌ **Exemple Incorecte:**
```
Proverbe 3          ← lipsește versetul
Proverbe            ← lipsește capitol și verset
Test 1:1            ← carte inexistentă
Pro 3:5             ← abreviere nerecunoscută (folosește "Proverbe")
```

### 3️⃣ Abrevieri Acceptate

Poți folosi și abrevieri pentru cărțile biblice:

| Carte Completă | Abrevieri Acceptate |
|----------------|---------------------|
| Geneza | gen, geneza |
| Proverbe | prov, proverbe |
| Psalmul | ps, psalm, psalmi, psalmul |
| Ioan | in, ioan |
| Romani | rom, romani |
| 1 Corinteni | 1 cor, 1 corinteni |
| Efeseni | ef, efeseni |
| Filipeni | fil, filipeni |

**Vezi lista completă în:** `BIBLE_LOOKUP_LOCAL.md`

### 4️⃣ Intervale de Versete

Poți specifica un interval de versete folosind cratime (`-`):

```
Proverbe 3:5-6      → returnează "Încrede-te în Domnul... Recunoaște-L în toate căile..."
Efeseni 2:8-9       → returnează ambele versete concatenate
Psalmul 23:1-3      → returnează primele 3 versete
```

## 🎯 Comportament

### ✅ Când Funcționează

1. **Format valid**: `Cartea Capitol:Verset` sau `Cartea Capitol:Verset-Verset`
2. **Carte existentă**: Din cele 66 de cărți biblice
3. **Capitol valid**: Capitol existent în cartea respectivă
4. **Verset valid**: Verset existent în capitolul respectiv

### ⏳ Debounce (800ms)

Funcția de căutare așteaptă **800ms** după ce încetezi să tastezi înainte de a căuta versetul.

**De ce?**
- Evită căutări inutile în timp ce tastezi
- Reduce încărcarea procesorului
- Îmbunătățește UX (nu blochează input-ul)

### 🔍 Validare Automată

Câmpul "REFERINȚĂ BIBLICĂ" este validat în timp real:

- 🟢 **Verde**: Format valid, căutare în curs
- 🔴 **Roșu**: Format invalid sau verset negăsit
- ⚪ **Neutru**: Încă tastezi, debounce activ

### 📝 Câmpul "TEXTUL VERSETULUI"

- **Actualizare automată**: Se completează automat când versetul este găsit
- **Nu se suprascrie**: Poți edita manual textul dacă vrei
- **Persistență**: Textul rămâne și după ce modifici referința

## 🧪 Testare

### Test Manual în Browser

1. Pornește serverul: `npm run dev` (în folder `admin/`)
2. Deschide: `http://localhost:5173/`
3. Loghează-te cu contul Firebase
4. Mergi la **Săptămâni** sau **Categorii**
5. Testează cu referințe diverse

### Test Page Dedicată

Deschide: `http://localhost:5173/test-bible-lookup.html`

Această pagină rulează **5 teste automate**:
1. ✅ Proverbe 3:5 (un singur verset)
2. ✅ Proverbe 3:5-6 (interval)
3. ✅ Psalmul 23:1
4. ✅ Ioan 3:16
5. ✅ Validare referință invalidă

## 🐛 Troubleshooting

### Problema: "Referință negăsită"

**Cauze posibile:**
1. **Format invalid**: Verifică că ai scris `Cartea Capitol:Verset`
2. **Carte greșită**: Verifică ortografia (ex: "Proverbe", nu "Provebe")
3. **Capitol/verset inexistent**: Verifică că capitolul și versetul există
4. **Abreviere nerecunoscută**: Folosește abrevieri din tabel sau numele complet

**Soluție:**
- Verifică ortografia
- Folosește numele complet al cărții
- Consultă `BIBLE_LOOKUP_LOCAL.md` pentru lista de abrevieri

### Problema: "Căutarea e prea lentă"

**Cauza:** JSON-ul (4.3 MB) se încarcă la primul acces.

**Soluție:**
- După prima căutare, JSON-ul rămâne în cache
- Refresh la pagină va reîncărca JSON-ul
- Performanța va fi instant după cache

### Problema: "Nu pot scrie în câmpul REFERINȚĂ"

**Cauza:** Field-ul este blocat sau disabled.

**Soluție:**
- Verifică că ai selectat o săptămână/categorie
- Verifică că formularul nu este în modul "read-only"

## 💡 Tips & Tricks

### 1. Copiere Rapidă

Dacă ai o listă de referințe, poți copia-lipi direct:

```
Proverbe 3:5-6
```

→ Peste 800ms, textul va apărea automat

### 2. Editare Manuală

Dacă vrei să modifici textul versetului:
1. Așteaptă ca textul să apară automat
2. Click în câmpul "TEXTUL VERSETULUI"
3. Editează după preferință
4. Salvează formularul

### 3. Verificare Rapidă

Pentru a verifica dacă un format e valid **fără** să aștepți 800ms:
- Verifică că formatul este: `Cartea Capitol:Verset`
- Asigură-te că cartea există în Biblie
- Verifică că ai pus spațiu între carte și capitol

### 4. Intervale Mari

Poți folosi intervale mari (ex: `Psalmul 119:1-10`), dar:
- Textul va fi foarte lung
- Poate depăși limita câmpului
- Recomandare: Max 3-5 versete per interval

## 📚 Resurse

- **Lista completă cărți & abrevieri**: `BIBLE_LOOKUP_LOCAL.md`
- **Documentație tehnică**: `BIBLE_LOOKUP_LOCAL.md`
- **Test automat**: `http://localhost:5173/test-bible-lookup.html`
- **Cod sursă**: `admin/src/utils/bibleLookup.ts`

---

**📅 Ultima actualizare**: 2025-01-17  
**📧 Suport**: Contact project maintainer
