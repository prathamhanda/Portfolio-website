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
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

// Extract thumbnail images from projects data
export const getProjectThumbnails = (): string[] => {
  return [
    "/projects/brain-tumor-detector-cover.png",
    "/projects/ai-road-intelligence-cover.png",
    "/projects/roomsonrent-cover.png",
    "/projects/dot-ignorer-cover.png",
    "/projects/chip-8-emulator-cover.png",
    "/projects/breast-cancer-predictor-cover.png",
    "/projects/caresentry-ai-cover.png",
    "/projects/moviemania-cover.png",
    "/projects/dedup-backup-engine-cover.png",
    "/projects/dbuck-website-cover.png",
    "/projects/better-youtube-cover.png",
    "/projects/studybud-ai-ecosystem-cover.png",
    "/projects/portfolio-website-cover.png"
  ];
};