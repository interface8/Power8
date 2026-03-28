import type { OCRResult } from "@/types/solar";

export async function extractApplianceData(
  imageFile: File,
): Promise<OCRResult> {
  const Tesseract = await import("tesseract.js");
  const {
    data: { text, confidence },
  } = await Tesseract.recognize(imageFile, "eng");

  const watts = extractWatts(text);
  const amps = extractAmps(text);
  const volts = extractVolts(text);

  return {
    rawText: text,
    extractedWatts: watts ?? (amps && volts ? amps * volts : null),
    extractedAmps: amps,
    extractedVolts: volts,
    confidence,
  };
}

function extractWatts(text: string): number | null {
  // Match patterns like "100W", "100 W", "100 Watts", "100w", "Power: 100W"
  const patterns = [
    /(\d+(?:\.\d+)?)\s*[Ww](?:atts?)?(?:\s|$|[,.])/,
    /(?:power|wattage|rated)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*[Ww]?/i,
    /(\d+(?:\.\d+)?)\s*[Ww]\b/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      if (value > 0 && value < 100000) return value;
    }
  }
  return null;
}

function extractAmps(text: string): number | null {
  const patterns = [
    /(\d+(?:\.\d+)?)\s*[Aa](?:mps?|mperes?)?(?:\s|$|[,.])/,
    /(?:current|amperage|rated)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*[Aa]?/i,
    /(\d+(?:\.\d+)?)\s*[Aa]\b/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      if (value > 0 && value < 1000) return value;
    }
  }
  return null;
}

function extractVolts(text: string): number | null {
  const patterns = [
    /(\d+(?:\.\d+)?)\s*[Vv](?:olts?)?(?:\s|$|[,.])/,
    /(?:voltage|rated)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*[Vv]?/i,
    /(\d+(?:\.\d+)?)\s*[Vv]\b/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      if (value > 0 && value < 100000) return value;
    }
  }
  return null;
}
