import { useMutation } from '@tanstack/react-query';
import { ppeDetectionService } from '@/services/ppe-detection.service';

export function usePPEDetection() {
  return useMutation({
    mutationFn: (imageBlob: Blob) => ppeDetectionService.detectPPE(imageBlob),
  });
}
