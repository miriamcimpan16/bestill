# 📖 Bible Verse Lookup - Local JSON Implementation

## Overview

Sistema de căutare a versetelor biblice folosește acum un fișier JSON local în loc de API-uri externe, asigurând funcționalitate **instant**, **offline** și **100% sigură**.

## ✅ Caracteristici

- ✨ **Offline-first**: Zero cereri HTTP, toate datele sunt locale
- ⚡ **Instant**: Căutare imediată fără latență de rețea
- 🇷🇴 **Română Cornilescu**: Traducere oficială Dumitru Cornilescu
- 📚 **66 de cărți**: Întreaga Biblie (Vechiul + Noul Testament)
- 🔢 **Suport intervale**: Ex: `Proverbe 3:5-6`
- 🔍 **Validare strictă**: Format `Cartea Capitol:Verset` sau `Cartea Capitol:Verset-Verset`
- 🚀 **4.3 MB**: Dimensiune rezonabilă pentru bundle production

## 📂 Structura Fișierelor

```
admin/
├── src/
│   ├── data/
│   │   └── ro_cornilescu.json       # 📖 Biblia în română (4.3 MB)
│   └── utils/
│       └── bibleLookup.ts           # 🔍 Funcții de căutare
```

## 🔧 Implementare Tehnică

### Structura JSON

```json
[
  {
    "abbrev": "gn",
    "name": "Geneza",
    "chapters": [
      ["verset 1", "verset 2", "verset 3", ...],
      ["capitol 2, verset 1", "capitol 2, verset 2", ...],
      ...
    ]
  },
  ...
]
```

### API Public

#### `fetchBibleVerse(reference: string)`

Caută un verset sau interval de versete din JSON local.

**Parametri:**
- `reference`: Referință biblică în română (ex: `"Proverbe 3:5"`, `"Proverbe 3:5-6"`)

**Returnează:**
```typescript
Promise<{
  text: string;      // Textul versetului sau intervalului
  reference: string; // Referința originală
} | null>
```

**Exemple:**

```typescript
// Un singur verset
const result1 = await fetchBibleVerse('Proverbe 3:5');
// { text: "Încrede-te în Domnul din toată inima ta și nu te bizui pe înțelepciunea ta!", reference: "Proverbe 3:5" }

// Interval de versete
const result2 = await fetchBibleVerse('Proverbe 3:5-6');
// { text: "Încrede-te în Domnul... Recunoaște-L în toate căile tale...", reference: "Proverbe 3:5-6" }

// Psalmul
const result3 = await fetchBibleVerse('Psalmul 23:1');
// { text: "Domnul este Păstorul meu: nu voi duce lipsă de nimic.", reference: "Psalmul 23:1" }

// Noul Testament
const result4 = await fetchBibleVerse('Ioan 3:16');
// { text: "Fiindcă atât de mult a iubit Dumnezeu lumea...", reference: "Ioan 3:16" }
```

#### `isValidReference(reference: string)`

Validează formatul unei referințe biblice.

**Parametri:**
- `reference`: Referință de validat

**Returnează:** `boolean`

**Exemple:**

```typescript
isValidReference('Proverbe 3:5');      // ✅ true
isValidReference('Proverbe 3:5-6');    // ✅ true
isValidReference('Psalmul 23:1');      // ✅ true
isValidReference('Ioan 3:16');         // ✅ true

isValidReference('Proverbe 3');        // ❌ false (lipsește versetul)
isValidReference('Proverbe');          // ❌ false (lipsește capitol:verset)
isValidReference('Test 1:1');          // ❌ false (carte inexistentă)
```

## 📖 Cărți Suportate

### Vechiul Testament (39 cărți)

| Carte Română | Abrevieri | Exemple |
|--------------|-----------|---------|
| Geneza | gen, geneza | `Geneza 1:1` |
| Exodul | ex, exod, exodul | `Exodul 20:1` |
| Leviticul | lev, levitic | `Levitic 19:18` |
| Numeri | num, numeri | `Numeri 6:24` |
| Deuteronom | deut, deuteronom | `Deuteronom 6:5` |
| Iosua | ios, iosua | `Iosua 1:9` |
| Judecători | jud, judecatori | `Judecători 6:12` |
| Rut | rut | `Rut 1:16` |
| 1 Samuel | 1 sam, 1 samuel | `1 Samuel 17:45` |
| 2 Samuel | 2 sam, 2 samuel | `2 Samuel 7:12` |
| 1 Regi | 1 regi, 1 imparatilor | `1 Regi 3:9` |
| 2 Regi | 2 regi, 2 imparatilor | `2 Regi 2:11` |
| 1 Cronici | 1 cronici | `1 Cronici 16:34` |
| 2 Cronici | 2 cronici | `2 Cronici 7:14` |
| Ezra | ezra | `Ezra 3:11` |
| Neemia | neemia | `Neemia 8:10` |
| Estera | estera | `Estera 4:14` |
| Iov | iov, job | `Iov 19:25` |
| Psalmul | ps, psalm, psalmi | `Psalmul 23:1` |
| Proverbe | prov, proverbe | `Proverbe 3:5` |
| Ecclesiast | ecl, ecclesiast | `Ecclesiast 3:1` |
| Cântarea Cântărilor | cantarea | `Cantarea 2:4` |
| Isaia | is, isaia | `Isaia 40:31` |
| Ieremia | ier, ieremia | `Ieremia 29:11` |
| Plângerile | plangeri, plangerile | `Plângerile 3:22` |
| Ezechiel | ez, ezechiel | `Ezechiel 36:26` |
| Daniel | dan, daniel | `Daniel 6:10` |
| Osea | osea | `Osea 6:3` |
| Ioel | ioel | `Ioel 2:28` |
| Amos | amos | `Amos 5:24` |
| Obadia | obadia | `Obadia 1:15` |
| Iona | iona | `Iona 2:1` |
| Mica | mica | `Mica 6:8` |
| Naum | naum | `Naum 1:7` |
| Habacuc | habacuc | `Habacuc 2:4` |
| Țefania | tefania, țefania | `Țefania 3:17` |
| Hagai | hagai | `Hagai 2:9` |
| Zaharia | zaharia | `Zaharia 4:6` |
| Maleahi | maleahi | `Maleahi 3:10` |

### Noul Testament (27 cărți)

| Carte Română | Abrevieri | Exemple |
|--------------|-----------|---------|
| Matei | mat, matei | `Matei 5:16` |
| Marcu | marc, marcu | `Marcu 16:15` |
| Luca | luc, luca | `Luca 6:38` |
| Ioan | in, ioan | `Ioan 3:16` |
| Faptele Apostolilor | fapt, fapte | `Fapte 1:8` |
| Romani | rom, romani | `Romani 8:28` |
| 1 Corinteni | 1 cor, 1 corinteni | `1 Corinteni 13:4` |
| 2 Corinteni | 2 cor, 2 corinteni | `2 Corinteni 5:17` |
| Galateni | gal, galateni | `Galateni 5:22` |
| Efeseni | ef, efeseni | `Efeseni 2:8` |
| Filipeni | fil, filipeni | `Filipeni 4:13` |
| Coloseni | col, coloseni | `Coloseni 3:23` |
| 1 Tesaloniceni | 1 tes, 1 tesaloniceni | `1 Tesaloniceni 5:16` |
| 2 Tesaloniceni | 2 tes, 2 tesaloniceni | `2 Tesaloniceni 3:3` |
| 1 Timotei | 1 tim, 1 timotei | `1 Timotei 4:12` |
| 2 Timotei | 2 tim, 2 timotei | `2 Timotei 2:15` |
| Tit | tit | `Tit 3:5` |
| Filimon | filimon | `Filimon 1:6` |
| Evrei | evr, evrei | `Evrei 11:1` |
| Iacov | iac, iacov, iacob | `Iacov 1:5` |
| 1 Petru | 1 pet, 1 petru | `1 Petru 5:7` |
| 2 Petru | 2 pet, 2 petru | `2 Petru 3:9` |
| 1 Ioan | 1 in, 1 ioan | `1 Ioan 4:8` |
| 2 Ioan | 2 in, 2 ioan | `2 Ioan 1:6` |
| 3 Ioan | 3 in, 3 ioan | `3 Ioan 1:4` |
| Iuda | iuda | `Iuda 1:24` |
| Apocalipsa | apoc, apocalipsa | `Apocalipsa 21:4` |

## 🧪 Testare

Deschide în browser: `http://localhost:5173/test-bible-lookup.html`

Sau testează manual în componentele WeeksScreen și CategoriesScreen:

1. Deschide panou **Săptămâni** sau **Categorii**
2. Selectează o săptămână sau categorie
3. Scrie în câmpul **REFERINȚĂ BIBLICĂ**: `Proverbe 3:5`
4. Așteaptă 800ms (debounce)
5. Câmpul **TEXTUL VERSETULUI** se va completa automat

## 📊 Performanță

| Metric | Valoare |
|--------|---------|
| Dimensiune fișier | 4.3 MB |
| Total cărți | 66 |
| Total capitole | 1,189 |
| Total versete | ~31,102 |
| Timp căutare | < 5ms (instant) |
| Network requests | 0 (offline) |
| Cache browser | Da (după primul load) |

## 🔒 Securitate

- ✅ **Zero dependențe externe**: Nu mai există apeluri API externe
- ✅ **Funcționare offline**: Nu mai există risc de indisponibilitate API
- ✅ **Date statice**: JSON readonly, nu poate fi modificat runtime
- ✅ **Validare strictă**: Regex validation pentru toate input-urile
- ✅ **Type-safe**: TypeScript strict mode activat

## 📚 Sursa Datelor

Fișierul `ro_cornilescu.json` provine din:
- **Repository**: [thiagobodruk/bible](https://github.com/thiagobodruk/bible)
- **Versiune**: VDC (Versiunea Dumitru Cornilescu)
- **Format**: JSON structurat pe cărți → capitole → versete
- **License**: Verifică licența originală din repository

## 🚀 Următorii Pași

- [x] Descărcare JSON local
- [x] Implementare funcție `fetchBibleVerse` cu JSON
- [x] Suport intervale de versete
- [x] Validare strictă format
- [x] Integrare în WeeksScreen și CategoriesScreen
- [x] Test manual în browser
- [ ] Push la GitHub (branch: `feature/local-bible-json`)
- [ ] Verificare bundle size în producție
- [ ] Optimizare lazy loading pentru JSON (opțional)

## 💡 Tips

### Reduce Bundle Size (opțional)

Dacă 4.3 MB pare prea mare, poți:

1. **Lazy load JSON-ul** doar când utilizatorul folosește prima dată căutarea
2. **Compress cu gzip**: Server-ul trebuie configurat să servească `.json.gz`
3. **Split by Testament**: Separă Vechiul și Noul Testament în fișiere separate

### Cache Strategy

JSON-ul este încărcat o singură dată și rămâne în memoria browser-ului. Vite îl va include în bundle și va fi cached automat.

---

**📅 Creat**: 2025-01-17  
**👤 Autor**: BEStill Admin Panel  
**🔖 Versiune**: 1.0.0
