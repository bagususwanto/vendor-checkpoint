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
// Semua request PPE Detection diproxy melalui NestJS API utama,
// agar tidak langsung hit FastAPI (menghindari masalah CORS & keamanan)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const ppeDetectionService = {
  /**
   * Detect PPE in an image (via NestJS proxy → FastAPI)
   * @param imageBlob - Image blob from camera capture
   * @returns Promise with detection response
   */
  detectPPE: async (imageBlob: Blob): Promise<DetectionResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', imageBlob, 'capture.jpg');

      const response = await axios.post<any>(
        `${API_BASE_URL}/check-in/detect-ppe`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      // Robust unwrapping: handle both direct and nested response structures
      const data = response.data;
      if (data?.data?.detected_objects) return data.data;
      if (data?.detected_objects) return data;
      
      return data;
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
    detections: DetectedObject[] | undefined | null,
  ): PPEComplianceResult => {
    // Defensive check: ensure detections is an array
    const validDetections = Array.isArray(detections) ? detections : [];

    const hasHardhat = validDetections.some(
      (d) => d.class_name === 'Hardhat' && d.confidence > 0.5,
    );
    const hasSafetyVest = validDetections.some(
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
      detections: validDetections,
    };
  },
};
