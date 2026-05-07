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
import { useSystemConfigByKey } from '@/hooks/api/use-system-config';

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

  // Check if AI APD detection is enabled via system config
  const { data: apdConfig, isLoading: isLoadingConfig } = useSystemConfigByKey(
    'AI_APD_DETECTION_ENABLED',
  );
  const isApdEnabled = !isLoadingConfig && apdConfig?.config_value !== 'false';

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!step1Data || !checklistCategories) {
      router.replace('/check-in/step-1');
      return;
    }

    // If config is still loading, wait before deciding to bypass
    if (isLoadingConfig) return;

    // Bypass Step 2 when AI APD detection is disabled
    if (!isApdEnabled) {
      setPPEData({
        scanTime: new Date().toISOString(),
        detections: [],
        isCompliant: true,
        hasHardhat: true,
        hasSafetyVest: true,
        capturedImage: undefined,
      });
      router.replace('/check-in/step-3');
    }
  }, [
    step1Data,
    checklistCategories,
    isApdEnabled,
    isLoadingConfig,
    router,
    setPPEData,
  ]);

  const handleCapture = async (imageBlob: Blob, imageDataUrl: string) => {
    try {
      setCapturedImage(imageDataUrl);

      const response = await detectPPE(imageBlob);

      // Validate response structure
      if (!response || !response.detected_objects) {
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
        toast.success('Scan APD Berhasil', {
          description: 'Perlengkapan keselamatan Anda sudah lengkap!',
        });
      } else {
        toast.warning('APD Belum Lengkap', {
          description: 'Beberapa perlengkapan keselamatan belum terdeteksi.',
        });
      }
    } catch (error) {
      setCapturedImage(null);
      toast.error('Gagal Melakukan Scan', {
        description:
          'Terjadi kesalahan saat memindai. Pastikan APD API sudah berjalan.',
      });
    }
  };

  const handleRetry = () => {
    setCapturedImage(null);
    setComplianceResult(null);
  };

  const handleContinue = () => {
    if (!complianceResult) {
      toast.error('Scan APD Diperlukan', {
        description: 'Mohon lakukan scan APD terlebih dahulu.',
      });
      return;
    }

    if (!complianceResult.isCompliant) {
      toast.warning('APD Belum Lengkap', {
        description: 'Data akan tetap dikirim untuk keperluan evaluasi vendor.',
      });
    }

    // Save APD data to store
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
        <CardHeader className="items-center text-center pb-4 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl">Pemeriksaan APD</CardTitle>
          <CardDescription className="vendor-text text-xs sm:text-sm">
            Pastikan Anda memakai helm dan rompi keselamatan, lalu lakukan
            peninjauan dengan kamera.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PPEScanInstructions hasScanned={!!capturedImage} />

          {!complianceResult ? (
            <PPECamera
              onCapture={handleCapture}
              isProcessing={isDetecting}
              autoCapture={true}
            />
          ) : (
            <div className="space-y-4">
              <PPEResultOverlay
                imageDataUrl={capturedImage || ''}
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

        <CardFooter className="flex flex-row justify-between gap-2 px-4 sm:px-6">
          <Button
            type="button"
            variant="outline"
            className="w-1/2 h-12 sm:h-14 text-sm sm:text-base"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-5 w-5 sm:h-6 sm:w-6" />
            Kembali
          </Button>
          <Button
            type="button"
            className="w-1/2 h-12 sm:h-14 text-sm sm:text-base"
            onClick={handleContinue}
            disabled={!complianceResult || isDetecting}
          >
            Lanjut
            <CircleArrowRight className="ml-1 sm:ml-2 h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
