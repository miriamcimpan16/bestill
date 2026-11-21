# BEStill Admin Panel

Aplicație web React + TypeScript + Tailwind CSS pentru administrarea devoționalelor săptămânale și categoriilor "Open when...".

## Caracteristici

### 🗓️ Ecran Săptămâni
- Selectare săptămână (Luni-Duminică)
- Drag & drop pentru reordonarea zilelor
- Editare completă pentru fiecare zi:
  - Referință biblică
  - Text verset
  - Titlu devoțional
  - Conținut devoțional
  - Întrebare de reflecție
- Salvare ca ciornă sau publicare directă
- Interfață bazată pe imaginea `admin-1.png`

### 📂 Ecran Categorii "Open when..."
- Gestionare categorii (adăugare, editare, ștergere)
- Adăugare versete în fiecare categorie
- Ștergere versete individuale
- Interfață bazată pe imaginea `admin-2.png`

### 🔐 Autentificare
- Login simplu cu Email + Parolă
- Firebase Authentication
- Sesiune persistentă

## Tehnologii

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Firebase** - Backend services
  - Firestore - Database
  - Authentication - User management

## Instalare

```bash
# Instalează dependențele
npm install

# Rulează în modul development
npm run dev

# Build pentru producție
npm run build

# Preview build-ul de producție
npm run preview
```

## Structură Firebase

### Colecția `weeks`
```
weeks/{weekId}
  - weekStart: string (ISO date)
  - weekEnd: string (ISO date)
  - status: 'DRAFT' | 'PUBLISHED'
  - createdAt: string
  - updatedAt: string
  
  Sub-colecție: days/{dayId}
    - dayOfWeek: number (1-7)
    - date: string (ISO date)
    - verseReference: string
    - verseText: string
    - title: string
    - content: string
    - reflectionQuestion: string
    - order: number
```

### Colecția `openWhenCategories`
```
openWhenCategories/{categoryId}
  - title: string
  - createdAt: string
  - updatedAt: string
  
  Sub-colecție: verses/{verseId}
    - verseReference: string
    - verseText: string
    - order: number
```

## Design

Aplicația folosește exact layouturile din:
- `public/admin-1.png` - pentru ecranul Săptămâni
- `public/admin-2.png` - pentru ecranul Categorii

Elementele interactive sunt poziționate absolut peste aceste imagini pentru a respecta designul exact.

## Configurare Firebase

Configurația Firebase se află în `src/config/firebase.ts`. 

Pentru a configura propriul proiect Firebase:
1. Creează un proiect în [Firebase Console](https://console.firebase.google.com/)
2. Activează Authentication (Email/Password)
3. Creează o bază de date Firestore
4. Copiază configurația în `src/config/firebase.ts`

## Culori

- Fundal principal: `#3d2e28` (maro închis)
- Text deschis: `#f5f0e8` (crem)
- Accent: `#a67c6d` (roz-maro)
- Zi selectată: `#8b6b77` (mov-maro)

## Dezvoltare

Proiectul folosește:
- ESLint pentru linting
- TypeScript strict mode
- Hot Module Replacement (HMR)

## Licență

Proprietate privată - Devoțional Students
