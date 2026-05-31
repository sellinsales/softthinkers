import { useState, useRef, useCallback } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { scanImage, mockScan } from '../lib/vision/googleVision';
import { ScanResult } from '../types';
import { hapticSuccess, hapticError, hapticMedium } from '../lib/audio/speech';
import Constants from 'expo-constants';

const USE_MOCK = !Constants.expoConfig?.extra?.googleVisionApiKey;

export type ScanStatus = 'idle' | 'scanning' | 'success' | 'no_match' | 'error';

export interface UseCameraReturn {
  cameraRef: React.RefObject<CameraView>;
  permission: ReturnType<typeof useCameraPermissions>[0];
  requestPermission: ReturnType<typeof useCameraPermissions>[1];
  facing: CameraType;
  scanStatus: ScanStatus;
  lastResult: ScanResult | null;
  isFlashOn: boolean;
  toggleFlash: () => void;
  takePicture: () => Promise<ScanResult | null>;
  resetScan: () => void;
}

export function useCamera(): UseCameraReturn {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [facing] = useState<CameraType>('back');
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);

  const toggleFlash = useCallback(() => {
    setIsFlashOn((prev) => !prev);
  }, []);

  const takePicture = useCallback(async (): Promise<ScanResult | null> => {
    if (!cameraRef.current || scanStatus === 'scanning') return null;

    setScanStatus('scanning');
    await hapticMedium();

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      if (!photo?.uri) {
        setScanStatus('error');
        return null;
      }

      const result = USE_MOCK
        ? await mockScan(photo.uri)
        : await scanImage(photo.uri);

      setLastResult(result);

      if (result.matchedWord) {
        setScanStatus('success');
        await hapticSuccess();
      } else {
        setScanStatus('no_match');
        await hapticError();
      }

      return result;
    } catch (error) {
      console.error('[useCamera] takePicture error:', error);
      setScanStatus('error');
      await hapticError();
      return null;
    }
  }, [scanStatus]);

  const resetScan = useCallback(() => {
    setScanStatus('idle');
    setLastResult(null);
  }, []);

  return {
    cameraRef,
    permission,
    requestPermission,
    facing,
    scanStatus,
    lastResult,
    isFlashOn,
    toggleFlash,
    takePicture,
    resetScan,
  };
}
