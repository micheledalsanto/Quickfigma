import React, { useMemo, useState } from "react";

export default function TOC({ headings, pages, currentPageIndex, onPageChange, isMobile = false, onClose }) {
  // Raggruppa per capitolo H1, conserva gli anchor esatti di rehype-slug
  const chapters = useMemo(() => {
    if (!headings || headings.length === 0) return [];
    const out = [];
    let current = null;
    for (const h of headings) {
      if (h.level === 1) {
        if (current) out.push(current);
        current = { title: h.text, anchor: h.anchor, children: [] };
      } else if (current) {
        current.children.push({
          level: h.level,
          title: h.text,
          anchor: h.anchor,
        });
      }
    }
    if (current) out.push(current);
    return out;
  }, [headings]);

  if (!chapters.length) return null;

  return (
    <nav className={`${isMobile ? 'h-screen flex flex-col' : 'border border-slate-700 rounded-lg p-4'} bg-slate-800 shadow-lg`}>
      <div className={`text-lg font-bold ${isMobile ? 'p-4 flex items-center justify-between' : 'mb-4 pb-2'} text-white border-b border-slate-600 font-geist`}>
        <span>📚 Indice</span>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {pages && pages.length > 0 && currentPageIndex !== undefined && !isMobile && (
        <div className="mb-4 px-3 py-2 bg-slate-700 rounded-lg">
          <div className="text-xs text-slate-400 font-inter">Pagina corrente</div>
          <div className="text-sm text-white font-medium font-geist">
            {pages[currentPageIndex]?.title}
          </div>
          <div className="text-xs text-slate-400 font-inter mt-1">
            {currentPageIndex + 1} di {pages.length}
          </div>
        </div>
      )}
      <div className={`${isMobile ? 'flex-1 overflow-y-auto p-4' : 'p-4'}`}>
        <ul className="space-y-2">
          {chapters.map((ch, idx) => (
            <TOCChapter key={idx} chapter={ch} pages={pages} onPageChange={onPageChange} isMobile={isMobile} onClose={onClose} />
          ))}
          
          {/* Capitoli in arrivo */}
          <li className="mt-4 pt-4 border-t border-slate-600">
            <div className={`p-2 ${isMobile ? '' : 'rounded'} bg-slate-700/50 border border-slate-600 border-dashed`}>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-600 text-white px-1.5 py-0.5 rounded font-inter">
                  SOON
                </span>
                <span className="text-slate-400 font-geist font-semibold text-sm">
                  Capitolo 4: Coming Soon
                </span>
              </div>
            </div>
          </li>
          
          <li>
            <div className={`p-2 ${isMobile ? '' : 'rounded'} bg-slate-700/50 border border-slate-600 border-dashed`}>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-600 text-white px-1.5 py-0.5 rounded font-inter">
                  SOON
                </span>
                <span className="text-slate-400 font-geist font-semibold text-sm">
                  Capitolo 5: Coming Soon
                </span>
              </div>
            </div>
          </li>
          
          <li>
            <div className={`p-2 ${isMobile ? '' : 'rounded'} bg-slate-700/50 border border-slate-600 border-dashed`}>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-600 text-white px-1.5 py-0.5 rounded font-inter">
                  SOON
                </span>
                <span className="text-slate-400 font-geist font-semibold text-sm">
                  Capitolo 6: Coming Soon
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function TOCChapter({ chapter, pages, onPageChange, isMobile = false, onClose }) {
  const [open, setOpen] = useState(false);

  const handleChapterClick = () => {
    // Su mobile: solo espandi/contrai, non navigare
    if (isMobile) {
      setOpen((v) => !v);
      return;
    }
    
    // Su desktop: naviga come prima
    if (pages && onPageChange) {
      // Caso speciale per FIGMA MASTERY - trova la sua pagina dedicata
      if (chapter.title === "FIGMA MASTERY") {
        const figmaPageIndex = pages.findIndex(page => page.title === "FIGMA MASTERY");
        if (figmaPageIndex !== -1) {
          onPageChange(figmaPageIndex);
        } else {
          onPageChange(0);
        }
        setOpen((v) => !v);
        return;
      }
      
      // Prima, cerca una pagina che corrisponde esattamente al titolo del capitolo
      let pageIndex = pages.findIndex(page => page.title === chapter.title);
      
      // Se non trovi una pagina diretta, cerca la prima sottosezione di questo capitolo
      if (pageIndex === -1 && chapter.children && chapter.children.length > 0) {
        // Cerca la prima sottosezione (child) di questo capitolo
        const firstChild = chapter.children[0];
        pageIndex = pages.findIndex(page => page.title === firstChild.title);
      }
      
      // Se ancora non trovi, cerca nel contenuto delle pagine
      if (pageIndex === -1) {
        pageIndex = pages.findIndex(page => {
          const chapterLine = `# ${chapter.title}`;
          const lines = page.content.split('\n');
          return lines.slice(0, 5).some(line => line.trim() === chapterLine);
        });
      }
      
      if (pageIndex !== -1) {
        onPageChange(pageIndex);
      }
    }
    setOpen((v) => !v);
  };
  
  // Determina se questo è un capitolo principale
  const isMainChapter = pages && pages.some(page => {
    if (!page.isChapter) return false;
    
    // Match esatto del titolo
    if (page.title === chapter.title) return true;
    
    // Verifica che il capitolo sia all'inizio del contenuto
    const chapterLine = `# ${chapter.title}`;
    const lines = page.content.split('\n');
    return lines.slice(0, 3).some(line => line.trim() === chapterLine);
  });

  const handleSubsectionClick = (subsection) => {
    // Trova la pagina che contiene questa sottosezione
    if (pages && onPageChange) {
      const pageIndex = pages.findIndex(page => {
        // Cerca per anchor
        if (subsection.anchor && page.content.includes(subsection.anchor)) return true;
        
        // Cerca per titolo esatto
        if (page.title === subsection.title) return true;
        
        // Cerca la riga con ## seguito dal titolo
        const sectionLine = `## ${subsection.title}`;
        if (page.content.includes(sectionLine)) return true;
        
        // Cerca la riga con ### seguito dal titolo
        const subSectionLine = `### ${subsection.title}`;
        if (page.content.includes(subSectionLine)) return true;
        
        return false;
      });
      
      if (pageIndex !== -1) {
        onPageChange(pageIndex);
        
        // Per ## e ### naviga all'ancora se esiste
        if ((subsection.level === 2 || subsection.level === 3) && subsection.anchor) {
          setTimeout(() => {
            const element = document.getElementById(subsection.anchor);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
        
        // Chiudi il modal mobile se aperto
        if (isMobile && onClose) {
          onClose();
        }
      }
    }
  };

  return (
    <li>
      {/* Click sul capitolo: naviga alla pagina */}
      <button
        onClick={handleChapterClick}
        className={`w-full text-left font-semibold flex items-center gap-2 hover:bg-slate-700 p-2 ${isMobile ? '' : 'rounded'} transition-colors ${
          isMainChapter ? 'bg-slate-700' : ''
        }`}
      >
        <span className={`transition-colors font-geist font-semibold ${
          isMainChapter ? 'text-blue-200' : 'text-blue-300 hover:text-blue-200'
        }`}>
          {chapter.title}
        </span>
        <span className="text-xs text-slate-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && chapter.children.length > 0 && (
        <ul className="mt-2 ml-6 space-y-1 border-l border-slate-600 pl-3">
          {chapter.children.map((c, i) => (
            <li key={i}>
              {/* Click sui sottopunti: naviga alla pagina */}
              <button
                onClick={() => handleSubsectionClick(c)}
                className={`text-sm hover:text-white hover:bg-slate-700 block p-1 ${isMobile ? '' : 'rounded'} transition-colors font-inter w-full text-left ${
                  c.level === 2 
                    ? 'text-slate-200 font-medium' 
                    : c.level === 3 
                    ? 'text-slate-400 ml-4 font-normal' 
                    : 'text-slate-300'
                }`}
              >
                {c.level === 3 && '→ '}{c.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
