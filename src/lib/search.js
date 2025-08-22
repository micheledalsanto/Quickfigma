// Motore di ricerca minimale senza flexsearch

export function buildIndex(markdown) {
  const docs = [];
  let current = { id: 0, title: "Intro", body: [], anchor: "intro" };

  function push() {
    if (!current) return;
    docs.push({
      ...current,
      body: current.body.join("\n")
    });
  }

  const lines = markdown.split("\n");
  for (const line of lines) {
    const m = /^(#{1,3})\s+(.*)/.exec(line);
    if (m) {
      push();
      const title = m[2];
      current = {
        id: docs.length + 1,
        title,
        body: [],
        anchor: slugify(title),
      };
    } else {
      current.body.push(line);
    }
  }
  push();

  return { _docs: docs };
}

export function searchInIndex(index, q) {
  if (!q) return [];
  const query = q.toLowerCase();

  return index._docs
    .filter((d) => {
      const bodyText = (Array.isArray(d.body) ? d.body.join(" ") : d.body).toLowerCase();
      return (
        d.title.toLowerCase().includes(query) ||
        bodyText.includes(query)
      );
    })
    .map((doc) => ({
      title: doc.title,
      snippet:
        (Array.isArray(doc.body) ? doc.body.join(" ") : doc.body)
          .slice(0, 140)
          .replace(/\s+/g, " ") + "…",
      anchor: doc.anchor,
    }));
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
