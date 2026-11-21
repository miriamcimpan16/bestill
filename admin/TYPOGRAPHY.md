# Ghid Tipografie - BEStill Admin

## 🎨 Fonturi Folosite

### Playfair Display (Font Principal)

**Unde se aplică**: Peste tot în aplicație
- Body text
- Toate titlurile (H1, H2, H3, H4, H5, H6)
- Input-uri și textarea-uri
- Butoane
- Labels și text secundar

**Caracteristici**:
- Familie: `"Playfair Display", serif`
- Weights: 400-900 (disponibile toate)
- Stiluri: Normal și Italic
- Tip: Serif de contrast înalt (transitional serif)
- Origini: Inspirat de fonturi din secolele XVIII-XIX
- Potrivit pentru: Conținut editorial, aplicații premium, text lung

**De ce Playfair Display?**
- Foarte lizibil la dimensiuni mici și mari
- Caracter elegant și clasic
- Contrast înalt între linii groase și subțiri
- Funcționează excelent pe ecrane HD/Retina
- Se potrivește perfect cu tema maro-crem a aplicației

### Playwrite RO (Font Accent)

**Unde se aplică**: Doar pe titlul "Devoțional" din sidebar

**Caracteristici**:
- Familie: `"Playwrite RO", cursive`
- Weights: 100-400
- Tip: Manuscris (handwriting)
- Origini: Font românesc special
- Rol: Branding și identitate vizuală

**De ce Playwrite RO pe logo?**
- Adaugă personalitate și căldură
- Font manuscris românesc (local touch)
- Face logo-ul memorabil
- Contrast cu restul interfeței (formal vs. personal)

## 📝 Implementare

### index.html
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Playwrite+RO:wght@100..400&display=swap" rel="stylesheet">
```

### index.css
```css
body {
  font-family: "Playfair Display", serif;
}

input,
textarea,
button,
select {
  font-family: "Playfair Display", serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: "Playfair Display", serif;
}
```

### Dashboard.tsx (Logo)
```tsx
<h1 style={{ fontFamily: '"Playwrite RO", cursive' }}>
  Devoțional
</h1>
```

## 📊 Hierarhie Tipografică

### Dimensiuni Text

| Element | Clasa Tailwind | Dimensiune | Utilizare |
|---------|---------------|-----------|-----------|
| Logo Sidebar | `text-2xl` | 1.5rem / 24px | Titlul "Devoțional" |
| H2 Principal | `text-3xl` | 1.875rem / 30px | Titluri pagini (Săptămâna X, Categorii) |
| H3 Secțiuni | `text-2xl` | 1.5rem / 24px | Titluri carduri (Luni · Ziua 1) |
| Text normal | `text-base` | 1rem / 16px | Conținut general |
| Text mic | `text-sm` | 0.875rem / 14px | Statusuri, metadata |
| Text foarte mic | `text-xs` | 0.75rem / 12px | Labels, placeholders |

### Font Weights

| Weight | Utilizare |
|--------|-----------|
| 400 (Regular) | Text normal, input-uri |
| 500 (Medium) | Butoane, labels cu accent |
| 600 (Semi-bold) | Titluri secundare |
| 700 (Bold) | Titluri principale (rare) |

## 🎯 Best Practices

### Line Height (Leading)

- **Titluri mari**: `leading-tight` (1.25)
  - Mai compact, mai dramatic
  - Ex: "Săptămâna 16–22 noiembrie"

- **Text normal**: `leading-normal` (1.5)
  - Implicit în Tailwind
  - Bun pentru lizibilitate text lung

- **Text mic**: `leading-relaxed` (1.625)
  - Mai mult spațiu între linii
  - Ex: descrieri, paragrafe

### Letter Spacing (Tracking)

- **Labels uppercase**: `tracking-wider` (0.05em)
  - Mai mult spațiu între litere
  - Ex: "REFERINȚĂ", "TEXTUL VERSETULUI"

- **Text normal**: tracking implicit
  - Fără ajustări

- **Titluri mari**: uneori `tracking-tight` (-0.025em)
  - Mai condensat pentru impact

## 🔧 Optimizări Performanță

### Preconnect
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```
- Reduce latency la încărcarea fonturilor
- Browser-ul stabilește conexiunea mai devreme

### Font Display Strategy
```
&display=swap
```
- `swap` = arată fontul de sistem imediat, apoi swap la fontul custom
- Evită FOIT (Flash of Invisible Text)
- UX mai bună pe conexiuni lente

### Weight Range Optimization
```
wght@0,400..900;1,400..900
```
- Variabile fonts = un singur fișier pentru toate weights
- Mai puțin bandwidth decât fonts statice
- Google Fonts optimizează automat

## 📱 Responsive Typography

În viitor, pentru tabletă/mobil:

```css
/* Tablet */
@media (max-width: 1024px) {
  h2 { font-size: 1.5rem; }
}

/* Mobile */
@media (max-width: 640px) {
  h2 { font-size: 1.25rem; }
  body { font-size: 0.875rem; }
}
```

## 🌐 Suport Browser

Playfair Display și Playwrite RO sunt suportate de:
- ✅ Chrome/Edge (toate versiunile moderne)
- ✅ Firefox (toate versiunile moderne)
- ✅ Safari (desktop și iOS)
- ✅ Opera

Fallback în caz de nevoie:
- Playfair Display → serif generic (Times New Roman, Georgia)
- Playwrite RO → cursive generic (Brush Script MT, Comic Sans MS)

## 🎨 Combinații de Culori cu Typography

Playfair Display funcționează excelent cu paleta noastră:

| Background | Text Color | Contrast | Lizibilitate |
|-----------|------------|----------|--------------|
| `#1E1815` (maro închis) | `#F4EFEA` (crem) | Înalt | Excelentă |
| `#F4EFEA` (crem) | `#1E1815` (maro) | Înalt | Excelentă |
| `#7A5363` (mov) | `#F4EFEA` (crem) | Mediu-înalt | Foarte bună |

---

**Aplicație dezvoltată pentru Devoțional Students**  
Tipografie optimizată pentru lizibilitate și eleganță · 2024
