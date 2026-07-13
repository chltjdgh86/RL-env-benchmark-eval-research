const words = (value) => String(value).trim().split(/\s+/).filter(Boolean);

const MARKDOWN_ENTITIES = Object.freeze({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "\\": "&#92;",
  "`": "&#96;",
  "[": "&#91;",
  "]": "&#93;",
  "(": "&#40;",
  ")": "&#41;",
  "*": "&#42;",
  "_": "&#95;",
  "#": "&#35;",
  "|": "&#124;",
});

export const escapeMarkdownText = (value) => String(value)
  .replace(/[&<>"'\\`\[\]()*_#|]/g, (character) => MARKDOWN_ENTITIES[character])
  .replaceAll("\n", " ");

export const markdownUrl = (value) => encodeURI(String(value).toWellFormed()).replaceAll("(", "%28").replaceAll(")", "%29");

const decodeCodePoint = (value, radix) => {
  const codePoint = Number.parseInt(value, radix);
  return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff && !(codePoint >= 0xd800 && codePoint <= 0xdfff)
    ? String.fromCodePoint(codePoint)
    : "�";
};

export const decodeHtmlEntities = (value) => String(value)
  .replace(/&#(\d+);/g, (_entity, code) => decodeCodePoint(code, 10))
  .replace(/&#x([0-9a-f]+);/gi, (_entity, code) => decodeCodePoint(code, 16))
  .replaceAll("&amp;", "&")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">")
  .replaceAll("&quot;", '"')
  .replaceAll("&#39;", "'")
  .replaceAll("&nbsp;", " ");

const locatorMetadata = (locator) => {
  const value = String(locator?.value ?? "");
  if (locator?.kind === "html_heading") return `html heading ${value.match(/^H[1-6]\b/i)?.[0]?.toUpperCase() ?? ""}`.trim();
  if (locator?.kind === "page") return `page locator ${value.match(/\b(?:page|p\.)\s*\d+\b/i)?.[0] ?? ""}`.trim();
  if (locator?.kind === "filing_field") return "filing field locator";
  if (locator?.kind === "commit") return "commit locator";
  return `${String(locator?.kind ?? "source").replaceAll("_", " ")} locator`;
};

export function renderSourceRegistryEvidence(observations, escape = (value) => String(value)) {
  let remainingQuoteWords = 25;
  const rendered = [];
  let attributedWordCount = 0;
  for (const observation of observations) {
    const excerptWords = words(observation.excerpt);
    const retainedWords = excerptWords.slice(0, remainingQuoteWords);
    attributedWordCount += retainedWords.length;
    remainingQuoteWords -= retainedWords.length;
    const clipped = retainedWords.length < excerptWords.length;
    const quote = `${retainedWords.join(" ")}${clipped ? " …" : ""}`;
    rendered.push(`${escape(locatorMetadata(observation.locator))}: ${escape(quote)}`);
  }
  return { markdown: rendered.join("<br>"), attributedWordCount };
}
