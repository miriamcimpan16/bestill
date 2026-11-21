# Deployment Guide - BEStill Admin Panel

## 🔐 Securitate

### Variabile de mediu (IMPORTANT!)

Cheile Firebase **NU** sunt incluse în repository pentru securitate. Trebuie să configurezi variabilele de mediu în platforma de deployment (Vercel, Netlify, etc.).

### Variabile necesare:

Copiază valorile din fișierul `.env.local` (care NU este în Git) și adaugă-le în platforma de deployment:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

---

## 📦 Deployment pe Vercel

### 1. Conectare repository

1. Mergi la [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import repository: `miriamcimpan16/bestill`
4. Selectează folderul **`admin/`** ca Root Directory

### 2. Configurare Build

**Framework Preset**: Vite  
**Build Command**: `npm run build`  
**Output Directory**: `dist`  
**Install Command**: `npm install`

### 3. Adaugă variabilele de mediu

În secțiunea **Environment Variables**, adaugă toate cele 7 variabile Firebase:

```
VITE_FIREBASE_API_KEY = [valoarea ta]
VITE_FIREBASE_AUTH_DOMAIN = [valoarea ta]
VITE_FIREBASE_PROJECT_ID = [valoarea ta]
VITE_FIREBASE_STORAGE_BUCKET = [valoarea ta]
VITE_FIREBASE_MESSAGING_SENDER_ID = [valoarea ta]
VITE_FIREBASE_APP_ID = [valoarea ta]
VITE_FIREBASE_MEASUREMENT_ID = [valoarea ta]
```

⚠️ **Asigură-te că toate variabilele încep cu `VITE_`** (Vite expune doar variabilele cu acest prefix în frontend)

### 4. Deploy

Click **"Deploy"** și așteaptă ~2 minute. Vercel va:
- Instala dependențele
- Builda aplicația cu variabilele de mediu
- Deploy-a pe un URL public (ex: `bestill-admin.vercel.app`)

---

## 📦 Deployment pe Netlify

### 1. Conectare repository

1. Mergi la [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Conectează GitHub și selectează `miriamcimpan16/bestill`

### 2. Configurare Build

**Base directory**: `admin`  
**Build command**: `npm run build`  
**Publish directory**: `admin/dist`

### 3. Adaugă variabilele de mediu

În **Site settings** → **Environment variables**, adaugă toate cele 7 variabile Firebase cu prefix `VITE_`.

### 4. Deploy

Click **"Deploy site"** și așteaptă build-ul.

---

## 🔧 Development local

### 1. Clone repository

```bash
git clone https://github.com/miriamcimpan16/bestill.git
cd bestill/admin
```

### 2. Instalează dependențele

```bash
npm install
```

### 3. Configurează variabilele de mediu

Creează fișierul `.env.local` în `admin/`:

```bash
cp .env.example .env.local
```

Editează `.env.local` și completează cu valorile reale din Firebase Console:

1. Mergi la [Firebase Console](https://console.firebase.google.com)
2. Selectează proiectul `devotional-students`
3. Settings (⚙️) → Project Settings → General
4. Scroll la **Your apps** → Web app
5. Copiază valorile în `.env.local`

### 4. Rulează development server

```bash
npm run dev
```

Aplicația va rula pe `http://localhost:5173`

---

## 🔒 Securitate - Checklist

✅ **Verificat**: Fișierul `.env.local` este în `.gitignore`  
✅ **Verificat**: Cheile Firebase sunt în variabile de mediu, nu hardcodate  
✅ **Verificat**: `node_modules/` este ignorat de Git  
✅ **Verificat**: Fișierul `.env.example` (fără valori) este în repository pentru referință  

⚠️ **NU** pune niciodată chei reale în commit-uri Git!  
⚠️ **NU** face screenshot-uri cu variabilele de mediu și nu le distribui public!  

---

## 🔄 Update deployment

### Cum să faci update după modificări

1. **Local**: Fă modificările, testează local
2. **Commit**: 
   ```bash
   git add .
   git commit -m "feat: descriere modificare"
   git push origin main
   ```
3. **Auto-deploy**: Vercel/Netlify vor detecta push-ul și vor redeploya automat

---

## 📊 Monitorizare

### Firebase Console

- **Authentication**: Verifică utilizatorii autentificați
- **Firestore**: Verifică datele (weeks, openWhenCategories)
- **Usage**: Monitorizează numărul de requests

### Vercel/Netlify Dashboard

- **Analytics**: Vezi traficul
- **Logs**: Verifică eventualele erori
- **Deployments**: Istoric deploy-uri

---

## 🐛 Troubleshooting

### Eroare: "Firebase: Error (auth/...)"

**Cauză**: Variabilele de mediu nu sunt setate corect  
**Soluție**: Verifică că toate cele 7 variabile `VITE_FIREBASE_*` sunt configurate în platforma de deployment

### Aplicația nu se încarcă

**Cauză**: Build-ul a eșuat  
**Soluție**: 
1. Verifică logs-urile de build în Vercel/Netlify
2. Testează build-ul local: `npm run build`
3. Verifică că toate dependențele sunt instalate

### Eroare: "Cannot find module"

**Cauză**: Dependențe lipsă sau cache învechit  
**Soluție**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📞 Suport

Pentru probleme tehnice:
- Verifică [Issues pe GitHub](https://github.com/miriamcimpan16/bestill/issues)
- Citește documentația Firebase: [firebase.google.com/docs](https://firebase.google.com/docs)
- Documentație Vite: [vitejs.dev](https://vitejs.dev)

---

**Ultima actualizare**: 21 noiembrie 2024  
**Repository**: https://github.com/miriamcimpan16/bestill  
**Branch**: main
