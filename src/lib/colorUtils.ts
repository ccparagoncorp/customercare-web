/**
 * Utility functions for generating color palettes from brand colorbase
 */

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

// Lighten a color by a percentage
function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  const { r, g, b } = rgb
  const newR = Math.min(255, Math.floor(r + (255 - r) * percent / 100))
  const newG = Math.min(255, Math.floor(g + (255 - g) * percent / 100))
  const newB = Math.min(255, Math.floor(b + (255 - b) * percent / 100))
  
  return rgbToHex(newR, newG, newB)
}

// Darken a color by a percentage
function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  const { r, g, b } = rgb
  const newR = Math.max(0, Math.floor(r * (1 - percent / 100)))
  const newG = Math.max(0, Math.floor(g * (1 - percent / 100)))
  const newB = Math.max(0, Math.floor(b * (1 - percent / 100)))
  
  return rgbToHex(newR, newG, newB)
}

// Generate color palette from base color
export function generateColorPalette(baseColor: string) {
  const defaultColor = '#03438f' // Default brand color
  const color = baseColor || defaultColor
  
  return {
    primary: color,
    primaryLight: lightenColor(color, 20),
    primaryLighter: lightenColor(color, 40),
    primaryDark: darkenColor(color, 20),
    primaryDarker: darkenColor(color, 40),
    
    // Gradient variations
    gradientFrom: color,
    gradientTo: lightenColor(color, 30),
    
    // Text colors
    textPrimary: color,
    textSecondary: lightenColor(color, 30),
    
    // Background variations
    bgPrimary: `${color}10`, // 10% opacity
    bgSecondary: `${color}20`, // 20% opacity
    bgTertiary: `${color}30`, // 30% opacity
    
    // Border colors
    borderPrimary: color,
    borderSecondary: lightenColor(color, 20),
    
    // Status colors based on primary
    success: lightenColor(color, 10),
    warning: lightenColor(color, 50),
    error: darkenColor(color, 10),
  }
}

// Generate CSS custom properties for a color palette
export function generateCSSVariables(palette: ReturnType<typeof generateColorPalette>) {
  return {
    '--brand-primary': palette.primary,
    '--brand-primary-light': palette.primaryLight,
    '--brand-primary-lighter': palette.primaryLighter,
    '--brand-primary-dark': palette.primaryDark,
    '--brand-primary-darker': palette.primaryDarker,
    '--brand-gradient-from': palette.gradientFrom,
    '--brand-gradient-to': palette.gradientTo,
    '--brand-text-primary': palette.textPrimary,
    '--brand-text-secondary': palette.textSecondary,
    '--brand-bg-primary': palette.bgPrimary,
    '--brand-bg-secondary': palette.bgSecondary,
    '--brand-bg-tertiary': palette.bgTertiary,
    '--brand-border-primary': palette.borderPrimary,
    '--brand-border-secondary': palette.borderSecondary,
  }
}

// Get Tailwind color classes based on palette
export function getTailwindColors(palette: ReturnType<typeof generateColorPalette>) {
  return {
    primary: `[color:${palette.primary}]`,
    primaryLight: `[color:${palette.primaryLight}]`,
    primaryLighter: `[color:${palette.primaryLighter}]`,
    primaryDark: `[color:${palette.primaryDark}]`,
    primaryDarker: `[color:${palette.primaryDarker}]`,
    
    bgPrimary: `[background-color:${palette.bgPrimary}]`,
    bgSecondary: `[background-color:${palette.bgSecondary}]`,
    bgTertiary: `[background-color:${palette.bgTertiary}]`,
    
    borderPrimary: `[border-color:${palette.borderPrimary}]`,
    borderSecondary: `[border-color:${palette.borderSecondary}]`,
    
    gradientFrom: `[background:linear-gradient(to_right,${palette.gradientFrom},${palette.gradientTo})]`,
    gradientTo: `[background:linear-gradient(to_bottom_right,${palette.gradientFrom},${palette.gradientTo})]`,
  }
}
