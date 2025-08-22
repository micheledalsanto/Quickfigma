# QUICKFIGMA 🎨

Una guida pratica al Design Sistemico in Figma, presentata attraverso un'interfaccia web moderna e responsive.

![QUICKFIGMA Screenshot](https://img.shields.io/badge/React-18.x-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC) ![Vite](https://img.shields.io/badge/Vite-5.x-646CFF)

## 📖 Descrizione

QUICKFIGMA è una documentazione interattiva che fornisce una guida pratica per creare progetti di design scalabili e professionali utilizzando tecniche efficaci del settore. La documentazione è strutturata come un sito web moderno con navigazione intuitiva, ricerca avanzata e design responsive.

## ✨ Caratteristiche

- **📱 Design Responsive**: Ottimizzato per desktop, tablet e mobile
- **🔍 Ricerca Avanzata**: Sistema di ricerca full-text nella documentazione
- **📑 Navigazione Pagine**: Sistema di paginazione stile PDF per una lettura fluida
- **🗂️ TOC Interattivo**: Indice navigabile con gerarchia visiva (H1, H2, H3)
- **🌐 URL Routing**: Hash-based routing per condivisione diretta dei link
- **📋 Back to Top**: Navigazione rapida all'inizio delle sezioni
- **🎨 Font Pairing**: Geist per i titoli, Inter per il contenuto
- **⚡ Performance**: Build ottimizzata con Vite

## 🚀 Tecnologie Utilizzate

- **React 18** - Framework UI
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **React Markdown** - Rendering markdown
- **Rehype/Remark** - Elaborazione markdown avanzata
- **Lunr.js** - Motore di ricerca client-side

## 🛠️ Installazione e Setup

```bash
# Clona il repository
git clone https://github.com/micheledalsanto/quickfigma.git
cd quickfigma

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Build per produzione
npm run build

# Preview build di produzione
npm run preview
```

## 📁 Struttura del Progetto

```
src/
├── components/
│   ├── TOC.jsx              # Indice navigabile
│   ├── MarkdownPage.jsx     # Renderer pagine markdown
│   ├── SearchBox.jsx        # Componente ricerca
│   └── Modal.jsx           # Modali per disclaimer/credits
├── lib/
│   ├── parsePages.js       # Parser markdown in pagine
│   ├── extractTOC.js       # Estrazione table of contents
│   └── search.js           # Engine di ricerca
├── styles.css              # Stili globali e utility
└── App.jsx                 # Componente principale

public/
└── docs/
    └── guide.md            # Documentazione principale
```

## 🎯 Funzionalità Principali

### Sistema di Paginazione
La documentazione è automaticamente divisa in pagine basate sui headers `##`, creando un'esperienza di lettura simile a un libro digitale.

### Ricerca Intelligente
Sistema di ricerca full-text che indicizza tutto il contenuto markdown e fornisce risultati con snippet e navigazione diretta.

### TOC Gerarchico
- **H1** (Capitoli) - Evidenziati in blu
- **H2** (Sezioni) - Navigazione diretta con scroll
- **H3** (Sottosezioni) - Indentate con freccia, scroll automatico

### Mobile Experience
- Menu burger con TOC fullscreen
- Animazioni smooth per apertura/chiusura
- Layout ottimizzato per lettura mobile
- Controlli di navigazione compatti

## 🎨 Customizzazione

### Font
```css
/* Configurato in tailwind.config.js */
fontFamily: {
  'geist': ['Geist', 'system-ui', 'sans-serif'],        // Titoli
  'inter': ['Inter', 'system-ui', 'sans-serif'],        // Contenuto
  'space-grotesk': ['Space Grotesk', 'system-ui']       // Brand
}
```

### Colori
Il tema utilizza una palette basata su Tailwind con focus su slate/blue per un aspetto professionale e moderno.

## 📄 Licenza

### Contenuto
La documentazione è rilasciata sotto licenza [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

### Codice
Il codice sorgente è disponibile sotto licenza MIT per massima libertà di utilizzo.

## 🤝 Contributi

I contributi sono benvenuti! Per contribuire:

1. Fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/amazing-feature`)
3. Commit delle modifiche (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Apri una Pull Request

## 📬 Contatti

**Michele Dal Santo**
- GitHub: [@micheledalsanto](https://github.com/micheledalsanto)
- LinkedIn: [Michele Dal Santo](https://linkedin.com/in/micheledalsanto)

## 🙏 Ringraziamenti

- **Figma Team** per aver creato un ottimo strumento di design
- **React Community** per l'ecosistema ricco e ben documentato
- **Tailwind CSS** per il framework CSS utility-first
- **Claude AI** per l'assistenza nello sviluppo

---

⭐ Se questo progetto ti è stato utile, lascia una stella!