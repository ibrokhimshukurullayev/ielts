export function buildHighlightedSegments(text, comments) {
  const ranges = comments
    .map((c) => {
      if (typeof c.start === "number" && typeof c.end === "number") {
        return { start: c.start, end: c.end, comment: c };
      }
      const start = text.indexOf(c.quote);
      return start === -1 ? null : { start, end: start + c.quote.length, comment: c };
    })
    .filter(Boolean)
    .sort((a, b) => a.start - b.start);

  const merged = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start < cursor) continue;
    merged.push(r);
    cursor = r.end;
  }

  if (merged.length === 0) return [{ text, comment: null }];

  const segments = [];
  let pos = 0;
  for (const r of merged) {
    if (r.start > pos) segments.push({ text: text.slice(pos, r.start), comment: null });
    segments.push({ text: text.slice(r.start, r.end), comment: r.comment });
    pos = r.end;
  }
  if (pos < text.length) segments.push({ text: text.slice(pos), comment: null });
  return segments;
}
