// Helper function to create slug from name
export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

// Function to get design configuration based on Jenis name
import { DesignConfig } from './types'

export function getJenisDesignConfig(jenisName: string): DesignConfig {
  const name = jenisName.toLowerCase().trim()
  
  if (name.includes('quality of services') || name === 'quality of services') {
    return {
      type: 'quality-of-services',
      layout: 'split-two-columns', // Left-right split for 2 details
      showIcons: true, // Show check/x icons
    }
  }

  else if (name.includes('sop pelaporan eskos') || name === 'sop pelaporan eskos') {
    return {
      type: 'sop-pelaporan-eskos',
      layout: 'vertical', // Stack vertically
      showIcons: false,
    }
  }
  else if (
    name.includes('tips') && (name.includes('tricks') || name.includes('trick')) && (name.includes('customer') || name.includes('cs'))
  ) {
    return {
      type: 'tips-tricks-customer-services',
      layout: 'card-grid', // Display as cards in grid
      showIcons: false,
    }
  }
  else if (name.includes('all-materi-training') || name.includes('all materi training')) {
    return {
      type: 'all-materi-training',
      layout: 'slides-grid',
      showIcons: false,
    }
  }
  else if (
    name.includes('behaviour-customer-service') || 
    name.includes('behaviour customer service') || 
    name.includes('behavior-customer-service') || 
    name.includes('behavior customer service') ||
    name.includes('behaviour-customer-care') || 
    name.includes('behaviour customer care') || 
    name.includes('behavior-customer-care') || 
    name.includes('behavior customer care') ||
    (name.includes('behaviour') && name.includes('customer') && (name.includes('service') || name.includes('care'))) ||
    (name.includes('behavior') && name.includes('customer') && (name.includes('service') || name.includes('care')))
  ) {
    return {
      type: 'behaviour-customer-service',
      layout: 'card-grid',
      showIcons: false,
    }
  }
  else if (name.includes('faq') || name === 'faq' || name.includes('frequently asked questions')) {
    return {
      type: 'faq',
      layout: 'faq-list',
      showIcons: false,
    }
  }
  
  // Default design
  return {
    type: 'default',
    layout: 'vertical', // Stack vertically
    showIcons: false,
  }
}

// Function to convert slide/share links to embeddable URL (Google Slides basic support)
export function getSlideEmbedUrl(url: string): string {
  try {
    const u = url.trim()
    // Pattern 1: https://docs.google.com/presentation/d/{id}/edit...
    const m1 = u.match(/https?:\/\/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/)
    if (m1 && m1[1]) {
      return `https://docs.google.com/presentation/d/${m1[1]}/embed?start=false&loop=false&delayms=3000&rm=minimal`
    }
    // Pattern 2: https://docs.google.com/presentation/d/e/{id}/pub?... or /embed
    const m2 = u.match(/https?:\/\/docs\.google\.com\/presentation\/d\/e\/([a-zA-Z0-9_-]+)/)
    if (m2 && m2[1]) {
      return `https://docs.google.com/presentation/d/e/${m2[1]}/embed?start=false&loop=false&delayms=3000&rm=minimal`
    }
    // Google Drive preview links
    const mDrive = u.match(/https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (mDrive && mDrive[1]) {
      return `https://drive.google.com/file/d/${mDrive[1]}/preview`
    }
    // Fallback: return original (browser may still embed)
    return u
  } catch {
    return url
  }
}

