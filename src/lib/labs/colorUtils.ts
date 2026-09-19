/**
 * Mathematical WCAG 2.1 Color Contrast and Accessibility Engine.
 * Computes exact sRGB relative luminance and contrast ratios based on W3C specifications.
 */

export interface RgbColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface ContrastEvaluation {
  ratio: number; // e.g. 4.82
  ratioFormatted: string; // "4.82:1"
  wcagAANormal: boolean; // >= 4.5:1
  wcagAALarge: boolean; // >= 3.0:1
  wcagAAANormal: boolean; // >= 7.0:1
  wcagAAALarge: boolean; // >= 4.5:1
  statusText: string;
}

/**
 * Parse hex string ("#ffffff", "#fff", "ffffff") into RGB components.
 */
export function parseHexColor(hex: string): RgbColor | null {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  return null;
}

/**
 * Converts an sRGB color component to linear relative luminance component.
 */
function channelLuminance(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Calculates W3C relative luminance for an sRGB color (0.0 to 1.0).
 */
export function calculateRelativeLuminance(color: RgbColor): number {
  const r = channelLuminance(color.r);
  const g = channelLuminance(color.g);
  const b = channelLuminance(color.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Evaluates contrast ratio between foreground and background colors.
 */
export function evaluateContrast(fgHex: string, bgHex: string): ContrastEvaluation {
  const fg = parseHexColor(fgHex) || { r: 255, g: 255, b: 255 };
  const bg = parseHexColor(bgHex) || { r: 0, g: 0, b: 0 };

  const lum1 = calculateRelativeLuminance(fg);
  const lum2 = calculateRelativeLuminance(bg);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  const rounded = Math.round(ratio * 100) / 100;

  const wcagAANormal = rounded >= 4.5;
  const wcagAALarge = rounded >= 3.0;
  const wcagAAANormal = rounded >= 7.0;
  const wcagAAALarge = rounded >= 4.5;

  let statusText = 'Fail';
  if (wcagAAANormal) statusText = 'Pass AAA (Enhanced)';
  else if (wcagAANormal) statusText = 'Pass AA (Standard)';
  else if (wcagAALarge) statusText = 'Pass AA Large Only';

  return {
    ratio: rounded,
    ratioFormatted: `${rounded.toFixed(2)}:1`,
    wcagAANormal,
    wcagAALarge,
    wcagAAANormal,
    wcagAAALarge,
    statusText
  };
}
