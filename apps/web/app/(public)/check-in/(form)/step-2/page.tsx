'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, CircleArrowRight, RotateCcw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { usePPEDetection } from '@/hooks/api/use-ppe-detection';
import { ppeDetectionService } from '@/services/ppe-detection.service';
import { PPECamera } from '../components/ppe-camera';
import { PPEResultOverlay } from '../components/ppe-result-overlay';
import { PPEComplianceStatus } from '../components/ppe-compliance-status';
import { PPEScanInstructions } from '../components/ppe-scan-instructions';

export default function CheckInStep2() {
  const router = useRouter();
  const { step1Data, ppeData, setPPEData, checklistCategories } =
    useChecklistStore();

  const [capturedImage, setCapturedImage] = useState<string | null>(
    ppeData?.capturedImage || null,
  );
  const [complianceResult, setComplianceResult] = useState<{
    isCompliant: boolean;
    hasHardhat: boolean;
    hasSafetyVest: boolean;
    missingItems: string[];
    detections: any[];
  } | null>(
    ppeData
      ? {
          isCompliant: ppeData.isCompliant,
          hasHardhat: ppeData.hasHardhat,
          hasSafetyVest: ppeData.hasSafetyVest,
          missingItems: [],
          detections: ppeData.detections,
        }
      : null,
  );

  const { mutateAsync: detectPPE, isPending: isDetecting } = usePPEDetection();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!step1Data || !checklistCategories) {
      router.replace('/check-in/step-1');
    }
  }, [step1Data, checklistCategories, router]);

  const handleCapture = async (imageBlob: Blob, imageDataUrl: string) => {
    try {
      setCapturedImage(imageDataUrl);

      const response = await detectPPE(imageBlob);

      // Log the response for debugging
      console.log('PPE Detection Response:', response);

      // Validate response structure
      if (!response || !response.detected_objects) {
        console.error('Invalid API response:', response);
        toast.error('Respons API Tidak Valid', {
          description: 'Format respons dari PPE API tidak sesuai.',
        });
        return;
      }

      const result = ppeDetectionService.validatePPECompliance(
        response.detected_objects,
      );

      setComplianceResult(result);

      if (result.isCompliant) {
        toast.success('Scan PPE Berhasil', {
          description: 'Perlengkapan keselamatan Anda sudah lengkap!',
        });
      } else {
        toast.warning('PPE Belum Lengkap', {
          description: 'Beberapa perlengkapan keselamatan belum terdeteksi.',
        });
      }
    } catch (error) {
      console.error('PPE Detection Error:', error);
      toast.error('Gagal Melakukan Scan', {
        description:
          'Terjadi kesalahan saat memindai. Pastikan PPE API sudah berjalan.',
      });
    }
  };

  const handleRetry = () => {
    setCapturedImage(null);
    setComplianceResult(null);
  };

  const handleContinue = () => {
    if (!complianceResult) {
      toast.error('Scan PPE Diperlukan', {
        description: 'Mohon lakukan scan PPE terlebih dahulu.',
      });
      return;
    }

    if (!complianceResult.isCompliant) {
      toast.warning('PPE Belum Lengkap', {
        description:
          'Mohon pastikan Anda sudah memakai helm dan rompi keselamatan.',
      });
      return;
    }

    // Save PPE data to store
    setPPEData({
      scanTime: new Date().toISOString(),
      detections: complianceResult.detections,
      isCompliant: complianceResult.isCompliant,
      hasHardhat: complianceResult.hasHardhat,
      hasSafetyVest: complianceResult.hasSafetyVest,
      capturedImage: capturedImage || undefined,
    });

    router.push('/check-in/step-3');
  };

  return (
    <div>
      <Card className="w-full max-w-4xl">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-2xl">Scan PPE</CardTitle>
          <CardDescription className="vendor-text">
            Pastikan Anda memakai helm dan rompi keselamatan, lalu lakukan scan
            dengan kamera.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PPEScanInstructions hasScanned={!!capturedImage} />

          {!capturedImage ? (
            <PPECamera onCapture={handleCapture} isProcessing={isDetecting} />
          ) : (
            <div className="space-y-4">
              <PPEResultOverlay
                imageDataUrl={capturedImage}
                detections={complianceResult?.detections || []}
              />

              {complianceResult && (
                <PPEComplianceStatus
                  isCompliant={complianceResult.isCompliant}
                  hasHardhat={complianceResult.hasHardhat}
                  hasSafetyVest={complianceResult.hasSafetyVest}
                  missingItems={complianceResult.missingItems}
                />
              )}

              <Button
                type="button"
                variant="outline"
                onClick={handleRetry}
                className="w-full"
                size="lg"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Scan Ulang
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-row justify-between gap-2">
          <Button
            type="button"
            size="xl"
            variant="outline"
            className="w-1/2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-6 w-6" />
            Kembali
          </Button>
          <Button
            type="button"
            size="xl"
            className="w-1/2"
            onClick={handleContinue}
            disabled={!complianceResult?.isCompliant}
          >
            Lanjut
            <CircleArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
