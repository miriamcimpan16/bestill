# Design System - BEStill Admin

## Paleta de Culori

### Culori Principale

- **Maro închis (fundal principal)**: `#1E1815`
  - Folosit pentru: sidebar, fundal general, butoane primare
  
- **Maro ciocolată (fundal secundar)**: `#2A1F1C`
  - Folosit pentru: fundal zone de conținut, hover states
  
- **Maro mediu**: `#3d2e28`
  - Folosit pentru: zone de listă, carduri
  
- **Maro mai deschis**: `#4d3e38`
  - Folosit pentru: hover pe liste

### Culori Accent

- **Crem (text deschis și butoane)**: `#F4EFEA`
  - Folosit pentru: text principal pe fundal întunecat, butoane active, panouri laterale
  
- **Mov prăfuit (selecție)**: `#7A5363`
  - Folosit pentru: elemente selectate, focus states, highlight

### Opacități

- **Text secundar**: 60% opacitate (`/60`)
- **Text placeholder**: 40% opacitate (`/40`)
- **Borduri**: 10-20% opacitate (`/10`, `/20`)
- **Hover overlay**: 10% opacitate (`/10`)

## Tipografie

### Font Families

- **Playfair Display (principal)**: "Playfair Display", serif
  - Folosit pentru: **toate elementele aplicației** (body, titluri, text, input-uri, butoane, textarea)
  - Weights disponibile: 400-900 (normal și italic)
  - Font serif elegant, clasic, cu contrast înalt între linii subțiri și groase
  - Ideal pentru aplicații premium și conținut editorial
  
- **Playwrite RO (accent)**: "Playwrite RO", cursive
  - Folosit **exclusiv** pentru: titlul "Devoțional" din sidebar (branding)
  - Font manuscris elegant, românesc
  - Weights disponibile: 100-400

### Google Fonts

Ambele fonturi sunt încărcate din Google Fonts în `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Playwrite+RO:wght@100..400&display=swap" rel="stylesheet">
```

### Dimensiuni Text

- **H1 (Logo)**: 2xl (1.5rem/24px)
- **H2 (Titluri principale)**: 3xl (1.875rem/30px)
- **H3 (Titluri carduri)**: 2xl (1.5rem/24px)
- **Text normal**: base (1rem/16px)
- **Text mic**: sm (0.875rem/14px)
- **Text foarte mic**: xs (0.75rem/12px)

### Font Weights

- **Normal**: 400
- **Medium**: 500
- **Semi-bold**: 600

## Spacing

### Padding

- **Sidebar**: p-6 (1.5rem/24px) header, p-4 (1rem/16px) conținut
- **Conținut principal**: p-6 (1.5rem/24px)
- **Carduri/Panouri**: p-6 (1.5rem/24px)
- **Butoane**: px-6 py-2.5 sau px-4 py-3
- **Input-uri**: px-4 py-2.5

### Gaps

- **Layout principal**: gap-6 (1.5rem/24px)
- **Formulare**: space-y-5 sau space-y-4
- **Liste**: space-y-2 sau space-y-3

### Margin

- **Bottom header**: mb-6
- **Bottom labels**: mb-2 sau mb-3
- **Between sections**: mb-6

## Componente

### Butoane

#### Buton Primar (Solid)
```
bg-[#F4EFEA] text-[#1E1815]
hover:bg-[#F4EFEA]/90
px-6 py-2.5
rounded
uppercase tracking-wider text-xs font-medium
```

#### Buton Secundar (Outline)
```
bg-transparent border border-[#F4EFEA] text-[#F4EFEA]
hover:bg-[#F4EFEA]/10
px-6 py-2.5
rounded
uppercase tracking-wider text-xs font-medium
```

#### Buton Terțiar (Ghost)
```
text-[#F4EFEA]
hover:bg-[#F4EFEA]/10
px-4 py-2
rounded
```

### Input-uri

```
w-full
px-4 py-2.5
border border-[#1E1815]/20
rounded
bg-white text-[#1E1815]
placeholder:text-[#1E1815]/40
focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent
```

### Textarea

Aceleași stiluri ca input-urile, plus:
```
resize-none
rows={3-6}
```

### Labels

```
block
text-xs uppercase tracking-wider
text-[#1E1815]/60
mb-2
font-medium
```

### Carduri

```
bg-[#F4EFEA]
rounded-lg
p-6
overflow-y-auto
```

### Liste

#### Item normal
```
px-6 py-4
hover:bg-[#4d3e38]
cursor-pointer
transition
border-b border-[#F4EFEA]/5
```

#### Item selectat
```
bg-[#7A5363]
hover:bg-[#7A5363]
```

### Tabel/Grid

#### Header
```
grid grid-cols-[auto_1fr_2fr]
gap-4
px-6 py-3
bg-[#2A1F1C]
border-b border-[#F4EFEA]/10
```

Text header:
```
text-xs uppercase tracking-wider
text-[#F4EFEA]/60
font-medium
```

## Layout

### Sidebar

- Lățime: `w-[220px]`
- Flex vertical: `flex flex-col`
- Border: `border-r border-[#F4EFEA]/10`

### Conținut Principal

- Flex 1: `flex-1`
- Flex horizontal: `flex`
- Overflow: `overflow-hidden`

### Panel Lateral Dreapta

- Lățime fixă: `w-[420px]`
- Flex-shrink: `flex-shrink-0`
- Overflow: `overflow-y-auto`

## Interacțiuni

### Hover States

- Butoane: schimbă opacitatea sau adaugă background subtil
- Liste: `hover:bg-[#4d3e38]`
- Inputs: nu are hover explicit (doar focus)

### Focus States

- Ring: `focus:ring-2 focus:ring-[#7A5363]`
- Border: `focus:border-transparent`
- Outline: `focus:outline-none`

### Active States

- Butoane navigare: `bg-[#F4EFEA] text-[#1E1815]`
- Liste: `bg-[#7A5363]`

### Disabled States

```
disabled:opacity-50
disabled:cursor-not-allowed
```

## Animații și Tranziții

- Duration: 150ms (default)
- Timing: cubic-bezier(0.4, 0, 0.2, 1)
- Smooth scroll: `scroll-smooth`

## Scrollbars

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(30, 24, 21, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(244, 239, 234, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(244, 239, 234, 0.3);
}
```

## Borders și Radius

- **Border radius standard**: `rounded` (0.25rem/4px)
- **Border radius mare**: `rounded-lg` (0.5rem/8px)
- **Border width**: 1px sau 2px
- **Border opacity**: 5%, 10%, 20%

## Shadows

Folosite minimal, doar pentru carduri importante:
```
shadow-xl
```

## Responsive (Future)

Aplicația este optimizată pentru desktop (1280px+).
Pentru tabletă/mobil, consideră:
- Stack vertical pentru layout
- Sidebar collapsible
- Panel lateral ca modal overlay
