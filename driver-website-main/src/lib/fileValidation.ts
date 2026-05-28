export type ImageVisualKind = "document" | "portrait" | "signature";

export const isSupportedImageFile = (file: File) => {
  if (file.type) return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type);
  return /\.(jpe?g|png|webp)$/i.test(file.name);
};

export const isSupportedDocumentFile = (file: File) => {
  if (file.type === "application/pdf") return true;
  return isSupportedImageFile(file);
};

export const validateMaxFileSize = (file: File, maxMb: number) => file.size <= maxMb * 1024 * 1024;

export const readImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const dimensions = { width: img.naturalWidth, height: img.naturalHeight };
      URL.revokeObjectURL(url);
      resolve(dimensions);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to read image dimensions"));
    };

    img.src = url;
  });
};

export const validateImageVisual = async (file: File, kind: ImageVisualKind) => {
  const { width, height } = await readImageDimensions(file);
  const ratio = width / height;
  const shortestSide = Math.min(width, height);

  if (kind === "document") {
    return shortestSide >= 320 && ratio >= 1.15 && ratio <= 2.35;
  }

  if (kind === "portrait") {
    return shortestSide >= 240 && ratio >= 0.55 && ratio <= 1.35;
  }

  return shortestSide >= 120 && ratio >= 2.2 && ratio <= 8;
};
