"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, RotateCcw } from "lucide-react";

const MAX_IMAGES = 5;

interface PhotoCaptureProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  disabled?: boolean;
}

export function PhotoCapture({
  images,
  onImagesChange,
  disabled,
}: PhotoCaptureProps) {
  const [useCamera, setUseCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = useCallback(
    (dataUrl: string, maxWidth = 1024): Promise<string> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        };
        img.src = dataUrl;
      });
    },
    [],
  );

  const addImage = useCallback(
    (imageData: string) => {
      if (images.length < MAX_IMAGES) {
        onImagesChange([...images, imageData]);
      }
    },
    [images, onImagesChange],
  );

  const removeImage = useCallback(
    (index: number) => {
      onImagesChange(images.filter((_, i) => i !== index));
    },
    [images, onImagesChange],
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        const compressed = await compressImage(dataUrl);
        addImage(compressed);
      };
      reader.readAsDataURL(file);

      // Reset input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [compressImage, addImage],
  );

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setUseCamera(true);
    } catch {
      // Fallback to file input
      fileInputRef.current?.click();
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setUseCamera(false);
  }, []);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(videoRef.current, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    const compressed = await compressImage(dataUrl);
    addImage(compressed);
    stopCamera();
  }, [compressImage, addImage, stopCamera]);

  const canAddMore = images.length < MAX_IMAGES;

  return (
    <div className="flex flex-col gap-3">
      {/* Camera View */}
      {useCamera && (
        <div className="relative rounded-lg overflow-hidden bg-black">
          <video ref={videoRef} autoPlay playsInline className="w-full" />
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/80"
              onClick={stopCamera}
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              className="rounded-full h-16 w-16"
              onClick={capturePhoto}
            >
              <Camera className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden"
            >
              <img
                src={img}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-black transition-colors"
                onClick={() => removeImage(index)}
                disabled={disabled}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons (show when camera is not active) */}
      {!useCamera && canAddMore && (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={startCamera}
            disabled={disabled}
          >
            <Camera className="w-5 h-5" />
            <span className="text-xs">
              {images.length === 0 ? "Take Photo" : "Add Photo"}
            </span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <Upload className="w-5 h-5" />
            <span className="text-xs">
              {images.length === 0 ? "Upload Image" : "Add Image"}
            </span>
          </Button>
        </div>
      )}

      {/* Clear all */}
      {images.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground"
          onClick={() => onImagesChange([])}
          disabled={disabled}
        >
          <RotateCcw className="w-3 h-3 mr-1" /> Clear all photos
        </Button>
      )}

      {images.length >= MAX_IMAGES && (
        <p className="text-xs text-muted-foreground text-center">
          Maximum {MAX_IMAGES} photos reached
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
