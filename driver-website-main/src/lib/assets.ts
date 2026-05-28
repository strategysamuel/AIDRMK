export const assetPath = (fileName: string) => `/assets/${fileName}`;

export const galleryPath = (fileName: string) => `/gallery/${fileName}`;

export const logoPath = "/logo.jpeg";

export const normalizePublicImageUrl = (url?: string | null) => {
  if (!url) return "/placeholder.svg";

  if (url.startsWith("/src/assets/gallery/")) {
    return url.replace("/src/assets/gallery/", "/gallery/");
  }

  if (url.startsWith("/src/assets/")) {
    return url.replace("/src/assets/", "/assets/");
  }

  return url;
};
