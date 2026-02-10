'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, CameraOff, RefreshCw, Lightbulb } from 'lucide-react';
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
    // Play scan sound
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1); // Drop to A4

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    }

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

        {/* Scanning Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
            {/* Scanning Laser */}
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-75 shadow-[0_0_15px_var(--color-primary)] animate-scan" />

            {/* Grid Overlay */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(to right, var(--color-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* Tech Corners */}
            <div className="absolute inset-4 pointer-events-none">
              <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-primary rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-primary rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-primary rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-primary rounded-br-lg" />
            </div>

            {/* Status Text */}
            <div className="relative z-20 flex flex-col items-center gap-2">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <div className="bg-black/60 px-4 py-2 rounded-full border border-primary/30 backdrop-blur-md">
                <p className="text-primary font-mono text-lg font-bold tracking-widest animate-pulse">
                  ANALYZING PPE...
                </p>
              </div>
            </div>

            <style jsx>{`
              @keyframes scan {
                0% {
                  top: 0%;
                }
                50% {
                  top: 100%;
                }
                100% {
                  top: 0%;
                }
              }
              .animate-scan {
                animation: scan 2s linear infinite;
              }
            `}</style>
          </div>
        )}
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
        <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-950/30 flex gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Tips:</strong> Posisikan diri Anda agar helm dan rompi
            keselamatan terlihat jelas di kamera.
          </p>
        </div>
      )}
    </div>
  );
}
