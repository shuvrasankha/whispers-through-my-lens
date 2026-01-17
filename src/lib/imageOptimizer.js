/**
 * Netlify Image CDN utility for optimizing images on-the-fly
 * Transforms remote images through Netlify's edge network for faster loading
 */

/**
 * Generate an optimized image URL using Netlify Image CDN
 * @param {string} imageUrl - The original image URL
 * @param {Object} options - Transformation options
 * @param {number} options.width - Target width in pixels
 * @param {number} options.height - Target height in pixels (optional)
 * @param {string} options.fit - How the image should fit: 'contain', 'cover', 'fill'
 * @param {string} options.format - Output format: 'avif', 'webp', 'jpg', 'png'
 * @param {number} options.quality - Quality 1-100 (default 75)
 * @returns {string} - Optimized image URL via Netlify Image CDN
 */
export function getOptimizedImageUrl(imageUrl, options = {}) {
  if (!imageUrl) return '';

  const {
    width,
    height,
    fit = 'cover',
    format = 'webp',
    quality = 80
  } = options;

  // Build query parameters
  const params = new URLSearchParams();
  params.append('url', imageUrl);

  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  if (fit) params.append('fit', fit);
  if (format) params.append('fm', format);
  if (quality) params.append('q', quality.toString());

  return `/.netlify/images?${params.toString()}`;
}

/**
 * Preset configurations for common image sizes
 */
export const IMAGE_PRESETS = {
  // Thumbnail for cards in grid
  thumbnail: {
    width: 400,
    height: 300,
    fit: 'cover',
    format: 'webp',
    quality: 75
  },
  // Medium size for detail views
  medium: {
    width: 800,
    height: 600,
    fit: 'contain',
    format: 'webp',
    quality: 80
  },
  // Large for hero images
  hero: {
    width: 1200,
    height: 800,
    fit: 'cover',
    format: 'webp',
    quality: 85
  },
  // Full resolution for photo detail page
  full: {
    width: 1600,
    fit: 'contain',
    format: 'webp',
    quality: 85
  }
};

/**
 * Helper to get optimized URL with a preset
 * @param {string} imageUrl - The original image URL
 * @param {string} preset - One of: 'thumbnail', 'medium', 'hero', 'full'
 * @returns {string} - Optimized image URL
 */
export function getPresetImageUrl(imageUrl, preset = 'thumbnail') {
  const presetOptions = IMAGE_PRESETS[preset] || IMAGE_PRESETS.thumbnail;
  return getOptimizedImageUrl(imageUrl, presetOptions);
}
