'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

type PPECameraProps = {
  onCapture: (imageBlob: Blob, imageDataUrl: string) => void;
  isProcessing?: boolean;
};

export function PPECamera({ onCapture, isProcessing = false }: PPECameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setIsInitializing(true);
      setCameraError('');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setCameraError(
            'Akses kamera ditolak. Mohon izinkan akses kamera untuk melanjutkan.',
          );
        } else if (error.name === 'NotFoundError') {
          setCameraError(
            'Kamera tidak ditemukan. Pastikan perangkat Anda memiliki kamera.',
          );
        } else {
          setCameraError(
            'Gagal mengakses kamera. Silakan coba lagi atau gunakan browser lain.',
          );
        }
      }
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        onCapture(blob, imageDataUrl);
      }
    }, 'image/jpeg');
  }, [onCapture]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-border bg-muted">
        {!isCameraActive && !cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <CameraOff className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground vendor-text">
              Kamera belum aktif
            </p>
          </div>
        )}

        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <Alert variant="destructive">
              <CameraOff className="h-5 w-5" />
              <AlertDescription className="vendor-text">
                {cameraError}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover ${
            isCameraActive ? 'block' : 'hidden'
          }`}
        />

        {/* Hidden canvas for capturing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-3">
        {!isCameraActive ? (
          <Button
            type="button"
            onClick={startCamera}
            disabled={isInitializing}
            className="flex-1"
            size="lg"
          >
            <Camera className="mr-2 h-5 w-5" />
            {isInitializing ? 'Membuka Kamera...' : 'Aktifkan Kamera'}
          </Button>
        ) : (
          <>
            <Button
              type="button"
              onClick={stopCamera}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <CameraOff className="mr-2 h-5 w-5" />
              Matikan Kamera
            </Button>
            <Button
              type="button"
              onClick={captureImage}
              disabled={isProcessing}
              className="flex-1"
              size="lg"
            >
              <Camera className="mr-2 h-5 w-5" />
              {isProcessing ? 'Memproses...' : 'Ambil Gambar & Scan'}
            </Button>
          </>
        )}
      </div>

      {isCameraActive && (
        <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-950/30">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            💡 <strong>Tips:</strong> Posisikan diri Anda agar helm dan rompi
            keselamatan terlihat jelas di kamera.
          </p>
        </div>
      )}
    </div>
  );
}
