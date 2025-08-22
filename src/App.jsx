import React, { useEffect, useState } from "react";
import MarkdownPage from "./components/MarkdownPage.jsx";
import TOC from "./components/TOC.jsx";
import SearchBox from "./components/SearchBox.jsx";
import Modal from "./components/Modal.jsx";
import { buildIndex, searchInIndex } from "./lib/search.js";
import { extractTOC } from "./lib/extractTOC.js";
import { parseMarkdownToPages } from "./lib/parsePages.js";

export default function App() {
  const [md, setMd] = useState("");
  const [index, setIndex] = useState(null);
  const [matches, setMatches] = useState([]);
  const [query, setQuery] = useState("");
  const [toc, setToc] = useState([]);
  const [pages, setPages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showLicense, setShowLicense] = useState(false);
  const [showMobileTOC, setShowMobileTOC] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Funzione per aggiornare URL
  const updateURL = (pageIndex) => {
    if (pages[pageIndex]) {
      const slug = pages[pageIndex].id;
      window.history.pushState(null, '', `#${slug}`);
    }
  };

  // Funzione per trovare pagina da URL
  const findPageFromURL = () => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return 0;
    
    const pageIndex = pages.findIndex(page => page.id === hash);
    return pageIndex !== -1 ? pageIndex : 0;
  };

  // Gestisce cambio pagina con URL sync
  const handlePageChange = (newIndex) => {
    setCurrentPageIndex(newIndex);
    updateURL(newIndex);
  };

  // carica markdown
  useEffect(() => {
    fetch("/docs/guide.md")
      .then((r) => r.text())
      .then((text) => {
        console.log("Markdown loaded, length:", text.length);
        setMd(text);
      });
  }, []);

  // costruisci indice ricerca
  useEffect(() => {
    if (!md) return;
    const i = buildIndex(md);
    console.log("Index built with docs:", i._docs.length);
    setIndex(i);
  }, [md]);

  // costruisci TOC con rehype-slug
  useEffect(() => {
    if (!md) return;
    extractTOC(md).then((res) => {
      console.log("TOC estratta:", res);
      setToc(res);
    });
  }, [md]);

  // dividi markdown in pagine
  useEffect(() => {
    if (!md) return;
    const parsedPages = parseMarkdownToPages(md);
    console.log("Pagine create:", parsedPages.length);
    console.log("Tutte le pagine:", parsedPages.map((p, i) => ({ index: i, title: p.title, contentStart: p.content.substring(0, 50) + "..." })));
    console.log("Capitoli principali:", parsedPages.filter(p => p.isChapter).map(p => p.title));
    setPages(parsedPages);
  }, [md]);

  // Sincronizza con URL al caricamento iniziale
  useEffect(() => {
    if (pages.length > 0) {
      const urlPageIndex = findPageFromURL();
      if (urlPageIndex !== currentPageIndex) {
        setCurrentPageIndex(urlPageIndex);
      }
    }
  }, [pages]);

  // Gestisce navigazione browser (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      if (pages.length > 0) {
        const urlPageIndex = findPageFromURL();
        setCurrentPageIndex(urlPageIndex);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [pages]);

  // navigazione da tastiera
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT') return; // Non intercettare quando si scrive nella ricerca
      
      if (e.key === 'ArrowLeft' || e.key === 'h') {
        e.preventDefault();
        handlePageChange(Math.max(0, currentPageIndex - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        e.preventDefault();
        handlePageChange(Math.min(pages.length - 1, currentPageIndex + 1));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [pages.length, currentPageIndex]);

  // gestione ricerca
  const onSearch = (q) => {
    setQuery(q);
    if (!index || !q?.trim()) {
      setMatches([]);
      return;
    }
    const res = searchInIndex(index, q).slice(0, 50);
    console.log("Results:", res);
    setMatches(res);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-none xl:max-w-8xl px-3 sm:px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Burger menu per mobile */}
              <button
                onClick={() => setShowMobileTOC(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Logo e titolo desktop */}
              <div className="hidden md:flex items-center gap-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 24C12.4183 24 16 20.4183 16 16H8V24Z" fill="#0ACF83"/>
                  <path d="M0 16C0 20.4183 3.58172 24 8 24C8 19.5817 8 16 8 16H0Z" fill="#A259FF"/>
                  <path d="M0 8C0 12.4183 3.58172 16 8 16H8V8C8 8 4.24264 8 0 8Z" fill="#F24E1E"/>
                  <path d="M8 0C3.58172 0 0 3.58172 0 8C4.24264 8 8 8 8 8V0Z" fill="#FF7262"/>
                  <path d="M16 8C16 12.4183 19.5817 16 24 16C24 11.5817 24 8 24 8H16Z" fill="#1ABCFE"/>
                </svg>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 font-space-grotesk tracking-tight truncate">
                  QUICKFIGMA
                </h1>
              </div>
            </div>
            
            {/* Logo + nome mobile in alto a destra */}
            <div className="md:hidden flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 24C12.4183 24 16 20.4183 16 16H8V24Z" fill="#0ACF83"/>
                <path d="M0 16C0 20.4183 3.58172 24 8 24C8 19.5817 8 16 8 16H0Z" fill="#A259FF"/>
                <path d="M0 8C0 12.4183 3.58172 16 8 16H8V8C8 8 4.24264 8 0 8Z" fill="#F24E1E"/>
                <path d="M8 0C3.58172 0 0 3.58172 0 8C4.24264 8 8 8 8 8V0Z" fill="#FF7262"/>
                <path d="M16 8C16 12.4183 19.5817 16 24 16C24 11.5817 24 8 24 8H16Z" fill="#1ABCFE"/>
              </svg>
              <h1 className="text-lg font-bold text-slate-800 font-space-grotesk tracking-tight">
                QUICKFIGMA
              </h1>
            </div>
            
            {/* Ricerca solo su desktop */}
            <div className="hidden md:block">
              <SearchBox onSearch={onSearch} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-none xl:max-w-8xl px-3 sm:px-4 lg:px-8 py-6 w-full">
        <div className="md:grid md:grid-cols-12 md:gap-6 lg:gap-8 w-full">
          {/* Sidebar TOC - nascosto su mobile */}
          <aside className="hidden md:block md:col-span-3">
            <div>
              <TOC 
                headings={toc} 
                pages={pages}
                currentPageIndex={currentPageIndex}
                onPageChange={handlePageChange}
              />
            </div>
          </aside>

          {/* Contenuto centrale */}
          <section className="md:col-span-9">
            {/* Ricerca mobile - sopra al contenuto */}
            <div className="md:hidden mb-6">
              <SearchBox onSearch={onSearch} />
            </div>
          <div className="bg-white rounded-2xl shadow overflow-hidden w-full">
            {query.trim() === "" ? (
              // Mostra pagina corrente
              <>
                {/* Header della pagina - nascosto su mobile */}
                <div className="hidden md:block border-b bg-slate-50 px-6 py-4">
                  {pages[currentPageIndex] && (
                    <h1 className="text-lg font-bold text-slate-800 font-geist">
                      {pages[currentPageIndex].title}
                    </h1>
                  )}
                </div>

                {/* Contenuto della pagina - scrollabile */}
                <div 
                  className="overflow-y-auto w-full relative" 
                  style={{ 
                    maxHeight: window.innerWidth < 768 ? 'calc(100vh - 320px)' : 'calc(100vh - 360px)', 
                    position: 'relative' 
                  }}
                  onScroll={(e) => {
                    const scrollTop = e.target.scrollTop;
                    setShowBackToTop(scrollTop > 200);
                  }}
                  id="content-container"
                >
                  <div className="prose max-w-none p-4 sm:p-4 md:p-12 w-full">
                    {/* Titolo mobile */}
                    {pages[currentPageIndex] && (
                      <h1 className="md:hidden text-xl font-bold text-slate-800 font-geist mb-6">
                        {pages[currentPageIndex].title}
                      </h1>
                    )}
                    
                    {pages[currentPageIndex] && (
                      <MarkdownPage markdown={pages[currentPageIndex].content} />
                    )}
                  </div>
                </div>
                
                {/* Footer con navigazione */}
                <div className="border-t bg-slate-50 px-3 sm:px-4 md:px-6 py-4 flex items-center justify-between">
                  <button
                    onClick={() => handlePageChange(Math.max(0, currentPageIndex - 1))}
                    disabled={currentPageIndex === 0}
                    className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm bg-slate-800 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors font-inter"
                  >
                    <span className="hidden md:inline">← Precedente</span>
                    <span className="md:hidden">← Prec</span>
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 font-inter">
                      {currentPageIndex + 1} / {pages.length}
                    </span>
                    {showBackToTop && (
                      <button
                        onClick={() => {
                          const container = document.getElementById('content-container');
                          if (container) {
                            container.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded transition-colors"
                        title="Torna all'inizio"
                      >
                        ↑ Top
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(Math.min(pages.length - 1, currentPageIndex + 1))}
                    disabled={currentPageIndex === pages.length - 1}
                    className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm bg-slate-800 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors font-inter"
                  >
                    <span className="hidden md:inline">Successiva →</span>
                    <span className="md:hidden">Succ →</span>
                  </button>
                </div>
              </>
            ) : matches.length > 0 ? (
              // Mostra risultati ricerca
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4 font-geist">
                  Risultati per: "{query}"
                </h2>
                <ul className="space-y-4">
                  {matches.map((m, i) => (
                    <li key={i} className="text-sm">
                      <button
                        onClick={() => {
                          // chiudi ricerca e mostra markdown
                          setQuery("");
                          setMatches([]);
                          // cerca la pagina che contiene questo anchor
                          const pageIndex = pages.findIndex(page => 
                            page.content.includes(m.anchor)
                          );
                          if (pageIndex !== -1) {
                            setCurrentPageIndex(pageIndex);
                          }
                        }}
                        className="block text-left w-full"
                      >
                        <span className="font-semibold text-blue-600 underline font-geist">
                          {m.title || "(senza titolo)"}
                        </span>
                        <div className="text-gray-700 font-inter">{m.snippet}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              // Nessun risultato
              <div className="text-gray-500 p-6 font-inter">Nessun risultato trovato</div>
            )}
          </div>
          </section>
        </div>
      </main>
      
      <footer className="border-t bg-gray-50">
        <div className="mx-auto max-w-none xl:max-w-8xl px-3 sm:px-4 lg:px-8 py-3">
          <div className="text-center text-xs text-gray-500 font-inter space-y-1">
            <div>
              © 2025 Made with ❤️ by{' '}
              <a 
                href="https://github.com/micheledalsanto" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                Michele Dal Santo
              </a>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => setShowDisclaimer(true)}
                className="text-gray-600 hover:text-gray-800 transition-colors underline"
              >
                Disclaimer
              </button>
              <span>•</span>
              <button
                onClick={() => setShowCredits(true)}
                className="text-gray-600 hover:text-gray-800 transition-colors underline"
              >
                Credits
              </button>
              <span>•</span>
              <button
                onClick={() => setShowLicense(true)}
                className="text-gray-600 hover:text-gray-800 transition-colors underline"
              >
                License
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal TOC Mobile */}
      {showMobileTOC && (
        <div className="fixed inset-0 z-50 md:hidden bg-white overflow-hidden animate-slide-in">
          <TOC 
            headings={toc} 
            pages={pages}
            currentPageIndex={currentPageIndex}
            onPageChange={handlePageChange}
            isMobile={true}
            onClose={() => setShowMobileTOC(false)}
          />
        </div>
      )}

      {/* Blocca scroll del body quando il menu mobile è aperto */}
      {showMobileTOC && (
        <style>{`
          body { overflow: hidden; }
        `}</style>
      )}

      {/* Modali */}
      <Modal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        title="Disclaimer"
      >
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <strong>QUICKFIGMA</strong> è una risorsa educativa indipendente creata per aiutare designer e professionisti 
            ad approfondire le proprie competenze nell'utilizzo di Figma.
          </p>
          
          <p>
            Tutto il contenuto presente in questa documentazione si ispira alla{' '}
            <a 
              href="https://help.figma.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              documentazione ufficiale di Figma
            </a>{' '}
            e alle{' '}
            <a 
              href="https://www.figma.com/best-practices/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              best practices
            </a>{' '}
            pubblicate dal team ufficiale.
          </p>

          <p>
            <strong>Proprietà intellettuale:</strong> Figma è un marchio registrato di Figma, Inc. 
            Tutti i diritti sui marchi, loghi e denominazioni appartengono ai rispettivi proprietari. 
            Questo progetto non è affiliato con o sponsorizzato da Figma, Inc.
          </p>

          <p>
            Il contenuto di questa guida è il frutto di ricerche personali, esperienze pratiche e 
            anni di utilizzo professionale di questo software che amo profondamente. 
            Le metodologie e le tecniche presentate riflettono il mio approccio personale e 
            le competenze acquisite nel tempo.
          </p>

          <p className="text-gray-600 italic">
            Ultimo aggiornamento: Gennaio 2025
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={showCredits}
        onClose={() => setShowCredits(false)}
        title="Credits & Acknowledgments"
      >
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Questa documentazione è stata sviluppata con il supporto di strumenti avanzati di intelligenza artificiale 
            che hanno contribuito alla stesura, strutturazione e ottimizzazione dei contenuti.
          </p>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Strumenti utilizzati:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>
                <strong>Claude AI</strong> by Anthropic - Assistenza nella stesura, revisione e organizzazione dei contenuti
              </li>
              <li>
                <strong>React</strong> - Framework per lo sviluppo dell'interfaccia
              </li>
              <li>
                <strong>Tailwind CSS</strong> - Styling e design system
              </li>
              <li>
                <strong>Vite</strong> - Build tool e development server
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Fonts:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Space Grotesk</strong> - Titolo principale</li>
              <li><strong>Geist</strong> - Titoli e headings</li>
              <li><strong>Inter</strong> - Contenuto e testo</li>
            </ul>
          </div>

          <p>
            Ringrazio la community di designer e sviluppatori che condivide conoscenza e 
            contribuisce all'evoluzione degli strumenti di design.
          </p>

          <p className="text-gray-600 italic">
            Un ringraziamento speciale a Figma per aver creato uno strumento che ha rivoluzionato 
            il modo in cui lavoriamo nel design digitale.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={showLicense}
        onClose={() => setShowLicense(false)}
        title="License"
      >
        <div className="space-y-4 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Creative Commons Attribution-NonCommercial-ShareAlike 4.0</h3>
            <p>
              Questa documentazione è rilasciata sotto licenza{' '}
              <a 
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                CC BY-NC-SA 4.0
              </a>.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-1">Sei libero di:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Condividere</strong> — copiare e ridistribuire il materiale con qualsiasi mezzo e formato</li>
              <li><strong>Adattare</strong> — remixare, trasformare e costruire sul materiale</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-1">Alle seguenti condizioni:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Attribuzione</strong> — Devi riconoscere una menzione di paternità adeguata</li>
              <li><strong>Non commerciale</strong> — Non puoi utilizzare il materiale per scopi commerciali</li>
              <li><strong>Stessa licenza</strong> — Se remixi, trasformi o costruisci sul materiale, devi distribuire i tuoi contributi con la stessa licenza dell'originale</li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-800 mb-1">Codice sorgente:</h4>
            <p>
              Il codice sorgente di questo progetto è disponibile su{' '}
              <a 
                href="https://github.com/micheledalsanto" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                GitHub
              </a>{' '}
              sotto licenza MIT per la massima libertà di utilizzo e contribuzione.
            </p>
          </div>

          <p className="text-gray-600 italic text-xs">
            Per maggiori informazioni sui termini di licenza, consulta il{' '}
            <a 
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              testo completo della licenza
            </a>.
          </p>
        </div>
      </Modal>
    </div>
  );
}
