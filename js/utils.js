// Parse the "fees" text of a university. One program per line:
//   Arabic | English | Turkish | price     or     name | price
export function parseFees(text) {
  return String(text || "").split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
    const parts = line.split("|").map((x) => x.trim());
    const price = parts.length > 1 ? parts.pop() : "";
    const name = parts.length >= 3 ? { ar: parts[0], en: parts[1], tr: parts[2] } : { ar: parts[0], en: parts[0], tr: parts[0] };
    return { name, price };
  });
}
