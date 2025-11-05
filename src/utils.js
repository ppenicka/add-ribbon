import { SCREENS } from "./constants";

export const processImage = (img, screenIndex, previewUrl, imageFormat) => {
  // Revoke previous blob URL if it exists
  if (previewUrl.value?.startsWith("blob:")) {
    URL.revokeObjectURL(previewUrl.value);
  }

  const quality = 0.9;
  const screen = SCREENS[screenIndex];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = screen.size[0];
  canvas.height = screen.size[1];

  // Draw the image first, stretched to fit canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Create a temporary canvas for the ribbon overlay
  const ribbonCanvas = document.createElement("canvas");
  ribbonCanvas.width = canvas.width;
  ribbonCanvas.height = canvas.height;
  const ribbonCtx = ribbonCanvas.getContext("2d");

  if (!ribbonCtx) return;

  // Draw first black ribbon on overlay
  ribbonCtx.fillStyle = "black";
  ribbonCtx.fillRect(0, 0, ribbonCanvas.width, screen.ribbonHeight);

  // Draw second black ribbon below the first
  ribbonCtx.fillRect(
    0,
    screen.ribbonHeight,
    ribbonCanvas.width,
    screen.borderRadius
  );

  // Cut out the middle area with rounded top from the second ribbon
  ribbonCtx.globalCompositeOperation = "destination-out";
  ribbonCtx.beginPath();
  ribbonCtx.moveTo(screen.borderRadius, screen.ribbonHeight);
  ribbonCtx.arcTo(
    0,
    screen.ribbonHeight,
    0,
    screen.ribbonHeight + screen.borderRadius,
    screen.borderRadius
  );
  ribbonCtx.lineTo(0, screen.ribbonHeight + screen.borderRadius);
  ribbonCtx.lineTo(canvas.width, screen.ribbonHeight + screen.borderRadius);
  ribbonCtx.arcTo(
    canvas.width,
    screen.ribbonHeight,
    canvas.width - screen.borderRadius,
    screen.ribbonHeight,
    screen.borderRadius
  );
  ribbonCtx.closePath();
  ribbonCtx.fill();

  // Draw the ribbon overlay on top of the image
  ctx.drawImage(ribbonCanvas, 0, 0);

  const fallbackToPng = () => {
    previewUrl.value = canvas.toDataURL("image/png");
    imageFormat.value = "png";
  };

  canvas.toBlob(
    (blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        previewUrl.value = url;
        imageFormat.value = "webp";
      } else {
        fallbackToPng();
      }
    },
    "image/webp",
    quality
  );
};
