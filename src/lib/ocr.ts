import type { OCRResult } from "@/types/solar";
import { detectCategory } from "@/lib/appliance-profiles";

// --- Noise normalization ---
function normalizeOCRText(text: string): string {
  return text
    .replace(/[Oo](?=\d)/g, "0") // O before digit → 0
    .replace(/(?<=\d)[Oo]/g, "0") // O after digit → 0
    .replace(/[Ss](?=\d)/g, "5") // S before digit → 5
    .replace(/(?<=\d)[Ss]/g, "5") // S after digit → 5
    .replace(/[Il|](?=\d)/g, "1") // I/l/| before digit → 1
    .replace(/(?<=\d)[Il|]/g, "1") // I/l/| after digit → 1
    .replace(/VV/g, "W") // VV → W
    .replace(/vv/g, "w"); // vv → w
}

// --- Frequency-based extraction (all matches, pick best) ---
function extractAllValues(
  text: string,
  patterns: RegExp[],
  min: number,
  max: number,
): number[] {
  const values: number[] = [];
  for (const pattern of patterns) {
    const regex = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
    let match;
    while ((match = regex.exec(text)) !== null) {
      const value = parseFloat(match[1]);
      if (value > min && value < max) {
        values.push(value);
      }
    }
  }
  return values;
}

function pickBestValue(values: number[]): number | null {
  if (values.length === 0) return null;
  if (values.length === 1) return values[0];

  // Frequency-based: return the most common value
  const freq: Record<number, number> = {};
  for (const v of values) {
    freq[v] = (freq[v] ?? 0) + 1;
  }
  let best = values[0];
  let bestCount = 0;
  for (const key of Object.keys(freq)) {
    const val = Number(key);
    const count = freq[val];
    if (count > bestCount) {
      bestCount = count;
      best = val;
    }
  }
  return best;
}

// --- Context weighting ---
const BOOST_KEYWORDS = /power\s*input|rated\s*power|output\s*power|wattage|consumption/i;
const NOISE_KEYWORDS = /serial|model\s*no|date|batch|barcode|lot/i;

function computeAdjustedConfidence(rawConfidence: number, text: string): number {
  let adj = rawConfidence;

  if (BOOST_KEYWORDS.test(text)) adj = Math.min(100, adj + 10);
  if (NOISE_KEYWORDS.test(text)) adj = Math.max(0, adj - 15);

  // Penalize very short text (likely bad scan)
  if (text.length < 20) adj = Math.max(0, adj - 20);

  return Math.round(adj);
}

// --- Pattern lists ---
const WATT_PATTERNS = [
  /(\d+(?:\.\d+)?)\s*[Ww](?:atts?)?(?:\s|$|[,.])/,
  /(?:power|wattage|rated)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*[Ww]?/i,
  /(\d+(?:\.\d+)?)\s*[Ww]\b/,
];

const AMP_PATTERNS = [
  /(\d+(?:\.\d+)?)\s*[Aa](?:mps?|mperes?)?(?:\s|$|[,.])/,
  /(?:current|amperage|rated)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*[Aa]?/i,
  /(\d+(?:\.\d+)?)\s*[Aa]\b/,
];

const VOLT_PATTERNS = [
  /(\d+(?:\.\d+)?)\s*[Vv](?:olts?)?(?:\s|$|[,.])/,
  /(?:voltage|rated)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*[Vv]?/i,
  /(\d+(?:\.\d+)?)\s*[Vv]\b/,
];

// --- Main entry point ---
export async function extractApplianceData(
  imageFile: File,
): Promise<OCRResult> {
  const Tesseract = await import("tesseract.js");
  const {
    data: { text: rawText, confidence: rawConfidence },
  } = await Tesseract.recognize(imageFile, "eng");

  const text = normalizeOCRText(rawText);

  const allWatts = extractAllValues(text, WATT_PATTERNS, 0, 100000);
  const allAmps = extractAllValues(text, AMP_PATTERNS, 0, 1000);
  const allVolts = extractAllValues(text, VOLT_PATTERNS, 0, 100000);

  const watts = pickBestValue(allWatts);
  const amps = pickBestValue(allAmps);
  const volts = pickBestValue(allVolts);

  const adjustedConfidence = computeAdjustedConfidence(rawConfidence, text);

  // Category detection from OCR text
  const profile = detectCategory(text);

  return {
    rawText,
    extractedWatts: watts ?? (amps && volts ? amps * volts : null),
    extractedAmps: amps,
    extractedVolts: volts,
    confidence: rawConfidence,
    adjustedConfidence,
    allMatches: { watts: allWatts, amps: allAmps, volts: allVolts },
    detectedCategory: profile?.category ?? null,
  };
}
