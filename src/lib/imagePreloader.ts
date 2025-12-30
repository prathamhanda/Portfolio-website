export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

export const preloadImages = async (imagePaths: string[]): Promise<void> => {
  try {
    await Promise.all(imagePaths.map(preloadImage));
    console.log(`Successfully preloaded ${imagePaths.length} images`);
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

// Extract thumbnail images from projects data
export const getProjectThumbnails = (): string[] => {
  return [
    "/projects/5.png",      // Brain Tumor Detector
    "/projects/66.png",     // AI-RoadIntelligence  
    "/projects/2.png",      // RoomsOnRent
    "/projects/6.png",      // Dot Ignorer
    "/projects/Dot-ignorer.png", // Another Dot Ignorer variant
    "/projects/4.png",      // Additional project images
    "/projects/3.png",      
    "/projects/66a.png",
    "/projects/a4.png",
    "/projects/a5.png"
  ];
};