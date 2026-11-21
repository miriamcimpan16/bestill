# Completare automată versete biblice - Documentație

## 📖 Prezentare generală

Aplicația BEStill Admin include acum completare automată a textului versetelor biblice când introduci o referință. Funcționează atât în formularul zilei din „Săptămâni", cât și în formularul „Verset nou" din „Categorii".

---

## ⚙️ Cum funcționează

### 1. Auto-completare cu debounce

- După ce scrii o referință biblică (minim 3 caractere), aplicația așteaptă **600ms**
- Dacă nu mai tastezi, aplicația caută automat versetul în API-ul **bible-api.com**
- Textul găsit se completează automat în câmpul „Textul versetului"

### 2. Suport pentru referințe în română

Am creat un dicționar complet de mapare română → engleză pentru toate cărțile Bibliei:

**Exemple acceptate**:
- `Psalmul 23:1` → `Psalms 23:1`
- `Proverbe 3:5-6` → `Proverbs 3:5-6`
- `Isaia 40:31` → `Isaiah 40:31`
- `Matei 11:28` → `Matthew 11:28`
- `Ioan 3:16` → `John 3:16`
- `Romani 8:28` → `Romans 8:28`
- `Evrei 11:1` → `Hebrews 11:1`

### 3. Indicatori vizuali

**În timpul căutării**:
- Apare un spinner animat cu textul „Caut versetul..."

**După căutare**:
- ✅ **Succes**: „✓ Verset preluat automat" (verde)
- ❌ **Eroare**: „Referință negăsită — poți scrie textul manual" (gri)

---

## 📝 Unde funcționează

### 1. Săptămâni → Formularul zilei (panou dreapta)

**Câmpuri**:
- **Referință** - Scrii referința (ex: `Psalmul 23:1`)
- **Textul versetului** - Se completează automat după 600ms

**Indicatori**:
- În timpul căutării: Spinner lângă label-ul „Referință"
- După găsire: Checkmark verde lângă „Textul versetului"
- Dacă nu e găsit: Mesaj discret sub label

### 2. Categorii → Formularul „Verset nou" (panou dreapta, jos)

**Câmpuri**:
- **Verset nou · Referință** - Scrii referința
- **Textul versetului** - Se completează automat

**Indicatori**: La fel ca în Săptămâni

---

## 💡 Utilizare

### Exemplu 1: Adaugă verset în săptămână

1. **Navighează** la tab-ul „Săptămâni"
2. **Selectează** o zi din listă (click pe rând)
3. **Scrie** referința în câmpul „Referință": `Psalmul 23:1`
4. **Așteaptă** 600ms
5. **Textul versetului** se completează automat: _"The LORD is my shepherd; I shall not want."_
6. **Opțional**: Poți edita textul pentru a-l traduce în română

### Exemplu 2: Adaugă verset în categorie

1. **Navighează** la tab-ul „Categorii"
2. **Selectează** o categorie din listă
3. **Scroll** jos la secțiunea „Verset nou"
4. **Scrie** referința: `Isaia 40:31`
5. **Așteaptă** 600ms
6. **Textul versetului** se completează automat
7. **Click** „Adaugă versetul"

---

## 🌍 Dicționar complet de cărți biblice

### Vechiul Testament

| Română | Engleză | Prescurtări acceptate |
|--------|---------|----------------------|
| Geneza | Genesis | gen |
| Exodul | Exodus | exod, ex |
| Levitic | Leviticus | lev |
| Numeri | Numbers | num |
| Deuteronom | Deuteronomy | deut |
| Psalmul / Psalmi | Psalms | psalm, ps |
| Proverbe | Proverbs | prov |
| Isaia | Isaiah | is |
| Ieremia | Jeremiah | ier |
| Daniel | Daniel | dan |

### Noul Testament

| Română | Engleză | Prescurtări acceptate |
|--------|---------|----------------------|
| Matei | Matthew | mat |
| Marcu | Mark | marc |
| Luca | Luke | luc |
| Ioan | John | in |
| Faptele Apostolilor | Acts | fapte, fapt |
| Romani | Romans | rom |
| 1 Corinteni | 1 Corinthians | 1 cor |
| 2 Corinteni | 2 Corinthians | 2 cor |
| Galateni | Galatians | gal |
| Efeseni | Ephesians | ef |
| Filipeni | Philippians | fil |
| Coloseni | Colossians | col |
| 1 Tesaloniceni | 1 Thessalonians | 1 tes |
| 1 Timotei | 1 Timothy | 1 tim |
| 2 Timotei | 2 Timothy | 2 tim |
| Evrei | Hebrews | evr |
| Iacov | James | iac, iacob |
| 1 Petru | 1 Peter | 1 pet |
| 2 Petru | 2 Peter | 2 pet |
| 1 Ioan | 1 John | 1 in |
| Apocalipsa | Revelation | apoc |

📋 **Dicționar complet**: Vezi `admin/src/utils/bibleLookup.ts`

---

## 🔧 Implementare tehnică

### Fișiere create/modificate

1. **`src/utils/bibleLookup.ts`** (NOU)
   - Dicționar complet de mapare RO → EN
   - Funcție `normalizeReference()` - transformă referința română în engleză
   - Funcție `fetchBibleVerse()` - apelează API-ul bible-api.com
   - Hook `useBibleLookup()` - pentru componente React (opțional)

2. **`src/components/WeeksScreen.tsx`**
   - Import `fetchBibleVerse`
   - State pentru loading/error: `isLoadingVerse`, `verseError`, `verseSearchTimeout`
   - Funcție `handleVerseLookup()` - caută versetul cu debounce 600ms
   - Modificat `handleDayChange()` - detectează când se schimbă `verseReference`
   - Adăugat indicatori vizuali (spinner, checkmark, eroare)

3. **`src/components/CategoriesScreen.tsx`**
   - Import `fetchBibleVerse`
   - State pentru loading/error: `isLoadingVerse`, `verseError`, `verseSearchTimeout`
   - Funcție `handleVerseLookup()` - același pattern ca în WeeksScreen
   - Modificat `onChange` pentru `newVerseRef` - apelează `handleVerseLookup()`
   - Adăugat indicatori vizuali

### API folosit

**URL**: `https://bible-api.com/{reference}?translation=kjv`

**Exemplu**:
```
GET https://bible-api.com/Psalms+23:1?translation=kjv
```

**Răspuns**:
```json
{
  "reference": "Psalms 23:1",
  "verses": [...],
  "text": "The LORD is my shepherd; I shall not want.",
  "translation_id": "kjv",
  "translation_name": "King James Version"
}
```

**Traducție**: KJV (King James Version) - engleză

---

## ✅ Caracteristici

- ✅ **Debounce 600ms** - nu face request la fiecare tastă
- ✅ **Suport română** - dicționar complet de mapare
- ✅ **Indicator loading** - spinner animat
- ✅ **Feedback vizual** - checkmark sau eroare
- ✅ **Câmp editabil** - poți modifica textul după completare
- ✅ **Graceful degradation** - dacă API-ul nu răspunde, poți scrie manual
- ✅ **Curățare text** - elimină newline-uri și spații extra
- ✅ **Non-blocking** - aplicația funcționează și fără API

---

## 🐛 Troubleshooting

### Versetul nu se găsește

**Cauze posibile**:
1. Referința nu e corectă (ex: capitol sau verset inexistent)
2. Numele cărții nu e în dicționar
3. API-ul bible-api.com este offline

**Soluție**: Scrie manual textul versetului

### Căutarea e prea lentă

**Cauză**: Debounce de 600ms + timp de răspuns API (500-1000ms)

**Soluție**: Așteaptă ~1-1.5 secunde după ce termini de scris

### Textul apare în engleză

**Cauză**: API-ul bible-api.com returnează doar traducerea KJV (engleză)

**Soluție**: 
1. Copiază textul în engleză
2. Editează manual în română
3. SAU folosește Google Translate pentru traducere rapidă

### Referința nu e recunoscută

**Cauză**: Numele cărții nu e în dicționar sau e scris greșit

**Soluție**:
1. Verifică spelling-ul (ex: `Psalmul`, nu `Psalmu`)
2. Încearcă prescurtarea (ex: `Ps 23:1` în loc de `Psalmul 23:1`)
3. Scrie direct în engleză (ex: `Psalms 23:1`)

---

## 🚀 Îmbunătățiri viitoare

- [ ] API pentru Biblia în limba română (Cornilescu)
- [ ] Cache local pentru versete căutate frecvent
- [ ] Suport pentru intervale de versete (ex: `Ioan 3:16-18`)
- [ ] Buton manual „Caută verset" (pe lângă auto-complete)
- [ ] Preview verset înainte de adăugare
- [ ] Sugestii de referințe în dropdown (typeahead)

---

## 📚 Resurse

- **API Documentație**: https://bible-api.com/
- **Cod sursă**: `admin/src/utils/bibleLookup.ts`
- **Biblia KJV**: https://www.kingjamesbibleonline.org/

---

**Implementat de**: Kiro AI  
**Data**: 21 noiembrie 2024  
**Versiune**: v1.3
