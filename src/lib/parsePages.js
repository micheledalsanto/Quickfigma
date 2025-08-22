export function parseMarkdownToPages(markdown) {
  if (!markdown) return [];
  
  const lines = markdown.split('\n');
  const pages = [];
  let currentPage = [];
  let pageTitle = "Introduzione";
  let currentChapter = null;
  let pendingChapterContent = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Se troviamo un # (capitolo principale)
    if (line.match(/^#\s+(.+)$/) && !line.match(/^##/)) {
      // Salva la pagina precedente se ha contenuto
      if (currentPage.length > 0) {
        pages.push({
          title: pageTitle,
          content: currentPage.join('\n').trim(),
          id: slugify(pageTitle),
          isChapter: false
        });
      }
      
      // Se c'era un capitolo in attesa, gestiscilo
      if (currentChapter && pendingChapterContent.length > 0) {
        // Caso speciale per FIGMA MASTERY - crea sempre una pagina
        if (currentChapter === "FIGMA MASTERY") {
          const contentWithoutTitle = pendingChapterContent.slice(1);
          pages.push({
            title: currentChapter,
            content: contentWithoutTitle.join('\n').trim(),
            id: slugify(currentChapter),
            isChapter: false
          });
        }
        // Altri capitoli: non creiamo pagina, aspettiamo la prima ##
      }
      
      // Inizia un nuovo capitolo ma non crea subito una pagina
      currentChapter = line.replace(/^#\s+/, '');
      pendingChapterContent = [line];
      currentPage = [];
      pageTitle = "";
    }
    // Se troviamo un ## (sottosezione)
    else if (line.match(/^##\s+(.+)$/)) {
      // Se c'era un capitolo in attesa, questa è la sua prima sottosezione
      if (currentChapter && pendingChapterContent.length > 0) {
        // Il capitolo inizia con questa sottosezione, usa il titolo della sottosezione
        pageTitle = line.replace(/^##\s+/, '');
        // Non includere la riga del capitolo # nel contenuto, solo la sottosezione ##
        currentPage = [line];
        // Aggiungi tutto il contenuto del capitolo tranne la riga del titolo #
        for (let j = 1; j < pendingChapterContent.length; j++) {
          currentPage.splice(-1, 0, pendingChapterContent[j]);
        }
        pendingChapterContent = [];
        currentChapter = null;
      } else {
        // Salva la pagina precedente se ha contenuto
        if (currentPage.length > 0) {
          pages.push({
            title: pageTitle,
            content: currentPage.join('\n').trim(),
            id: slugify(pageTitle),
            isChapter: false
          });
        }
        
        // Inizia una nuova pagina
        pageTitle = line.replace(/^##\s+/, '');
        currentPage = [line];
      }
    } else {
      // Aggiungi la riga al contenuto appropriato
      if (pendingChapterContent.length > 0) {
        pendingChapterContent.push(line);
      } else {
        currentPage.push(line);
      }
    }
  }
  
  // Gestisci il contenuto finale
  if (currentChapter && pendingChapterContent.length > 0) {
    // Caso speciale: se è FIGMA MASTERY, crea una pagina
    if (currentChapter === "FIGMA MASTERY") {
      // Rimuovi la riga del titolo # e crea una pagina con il contenuto
      const contentWithoutTitle = pendingChapterContent.slice(1);
      pages.push({
        title: currentChapter,
        content: contentWithoutTitle.join('\n').trim(),
        id: slugify(currentChapter),
        isChapter: false
      });
    }
    // Altri capitoli senza sottosezioni non creano pagine (opzione B)
  } else if (currentPage.length > 0) {
    pages.push({
      title: pageTitle,
      content: currentPage.join('\n').trim(),
      id: slugify(pageTitle),
      isChapter: false
    });
  }
  
  return pages;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // rimuove accenti
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}