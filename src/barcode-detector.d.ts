type CornerPoint = { x: number; y: number };

type DetectedBarcode = {
  boundingBox: DOMRectReadOnly;
  cornerPoints: CornerPoint[];
  format: string;
  rawValue: string;
};

type BarcodeDetectorInstance = {
  detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;
};

type BarcodeDetectorConstructor = {
  new (options?: { formats: string[] }): BarcodeDetectorInstance;
};

declare const BarcodeDetector: BarcodeDetectorConstructor | undefined;
