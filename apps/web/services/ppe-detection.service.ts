import axios from 'axios';

// Types for PPE Detection
export type DetectedObject = {
  class_name: string;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2]
  confidence: number;
};

export type DetectionResponse = {
  detected_objects: DetectedObject[];
};

export type PPEComplianceResult = {
  isCompliant: boolean;
  hasHardhat: boolean;
  hasSafetyVest: boolean;
  missingItems: string[];
  detections: DetectedObject[];
};

// PPE Detection Service
const PPE_API_URL =
  process.env.NEXT_PUBLIC_PPE_API_URL || 'http://localhost:8000';

export const ppeDetectionService = {
  /**
   * Detect PPE in an image
   * @param imageBlob - Image blob from camera capture
   * @returns Promise with detection response
   */
  detectPPE: async (imageBlob: Blob): Promise<DetectionResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', imageBlob, 'capture.jpg');
      formData.append('return_json', 'true');

      const response = await axios.post<DetectionResponse>(
        `${PPE_API_URL}/api/detect/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('PPE Detection Error:', error);
      throw error;
    }
  },

  /**
   * Validate PPE compliance from detections
   * @param detections - Array of detected objects
   * @returns Compliance result with status and details
   */
  validatePPECompliance: (
    detections: DetectedObject[],
  ): PPEComplianceResult => {
    const hasHardhat = detections.some(
      (d) => d.class_name === 'Hardhat' && d.confidence > 0.5,
    );
    const hasSafetyVest = detections.some(
      (d) => d.class_name === 'Safety Vest' && d.confidence > 0.5,
    );

    const missingItems: string[] = [];
    if (!hasHardhat) missingItems.push('Helm Keselamatan (Hardhat)');
    if (!hasSafetyVest) missingItems.push('Rompi Keselamatan (Safety Vest)');

    return {
      isCompliant: hasHardhat && hasSafetyVest,
      hasHardhat,
      hasSafetyVest,
      missingItems,
      detections,
    };
  },
};
