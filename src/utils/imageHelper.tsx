// utils/imageHelper.ts

/**
 * Get the complete image URL for product images
 * Handles both new storage paths and legacy image paths
 * 
 * @param imagePath - The image path from the database (image_url field)
 * @returns Complete URL to the image or fallback image
 */
export const getProductImageUrl = (imagePath: string | null | undefined): string => {
    const STORAGE_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL || 'http://localhost:8000/storage/';
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400';
  
    // Return fallback if no image path provided
    if (!imagePath) {
      return FALLBACK_IMAGE;
    }
  
    // If it's already a complete URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
  
    // Handle legacy relative paths (./img/...)
    if (imagePath.startsWith('./')) {
      return `${BACKEND_URL}/${imagePath.substring(2)}`;
    }
  
    // Handle new storage paths (products/filename.ext)
    if (imagePath.startsWith('products/')) {
      return `${STORAGE_BASE_URL}${imagePath}`;
    }
  
    // Handle paths that start with storage/ already
    if (imagePath.startsWith('storage/')) {
      return `${BACKEND_URL}/${imagePath}`;
    }
  
    // Handle just filename (assume it's in products folder)
    if (!imagePath.includes('/')) {
      return `${STORAGE_BASE_URL}products/${imagePath}`;
    }
  
    // Default case - prepend storage URL
    return `${STORAGE_BASE_URL}${imagePath}`;
  };
  
  /**
   * React component prop for handling image load errors
   * Sets fallback image when original image fails to load
   */
  export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400';
  };
  
  /**
   * Get image URL with automatic error handling for React components
   * Returns both src and onError handler
   */
  export const getImageProps = (imagePath: string | null | undefined) => ({
    src: getProductImageUrl(imagePath),
    onError: handleImageError
  });
  
  // Export default for convenience
  export default getProductImageUrl;