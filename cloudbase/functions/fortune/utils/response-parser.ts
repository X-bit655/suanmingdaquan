function parseResponse(raw) {
  try {
    const p = JSON.parse(raw);
    return { summary: p.summary || "", analysis: p.analysis || raw, advice: p.advice || "", score: typeof p.score === "number" ? Math.min(100, Math.max(1, p.score)) : 50, tags: Array.isArray(p.tags) ? p.tags : [] };
  } catch { return { summary: "", analysis: raw, advice: "", score: 50, tags: [] }; }
}
exports.parseResponse = parseResponse;
