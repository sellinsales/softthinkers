import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import Constants from 'expo-constants';
import { VisionLabel, ScanResult } from '../../types';
import { findWordByLabel } from '../../constants/vocabulary';

const API_KEY = Constants.expoConfig?.extra?.googleVisionApiKey ?? '';
const VISION_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

// Max image size to send to Vision API (reduces cost + latency)
const MAX_IMAGE_SIZE = 800;

// ─── Image preparation ────────────────────────────────────────────────────────

async function prepareImageBase64(uri: string): Promise<string> {
  // Resize to max 800px and convert to JPEG for smaller payload
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: MAX_IMAGE_SIZE } }],
    { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG, base64: true },
  );
  if (!result.base64) {
    throw new Error('Failed to convert image to base64');
  }
  return result.base64;
}

// ─── Vision API call ──────────────────────────────────────────────────────────

interface VisionApiResponse {
  responses: Array<{
    labelAnnotations?: Array<{
      description: string;
      score: number;
      topicality: number;
    }>;
    localizedObjectAnnotations?: Array<{
      name: string;
      score: number;
    }>;
    error?: { code: number; message: string };
  }>;
}

async function callVisionApi(base64Image: string): Promise<VisionApiResponse> {
  const body = {
    requests: [
      {
        image: { content: base64Image },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 15 },
          { type: 'OBJECT_LOCALIZATION', maxResults: 8 },
        ],
      },
    ],
  };

  const response = await fetch(VISION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Vision API error ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<VisionApiResponse>;
}

// ─── Main scan function ───────────────────────────────────────────────────────

export async function scanImage(imageUri: string): Promise<ScanResult> {
  try {
    const base64 = await prepareImageBase64(imageUri);
    const apiResponse = await callVisionApi(base64);

    const firstResponse = apiResponse.responses[0];

    if (firstResponse?.error) {
      throw new Error(`Vision API: ${firstResponse.error.message}`);
    }

    // Collect all labels (label detection + object localization)
    const labelLabels = (firstResponse?.labelAnnotations ?? []).map((l) => ({
      text: l.description,
      score: l.score,
    }));
    const objectLabels = (firstResponse?.localizedObjectAnnotations ?? []).map((o) => ({
      text: o.name,
      score: o.score,
    }));

    // Merge and deduplicate, sorted by score descending
    const allLabels = [...labelLabels, ...objectLabels]
      .sort((a, b) => b.score - a.score)
      .reduce<Array<{ text: string; score: number }>>((acc, item) => {
        const exists = acc.some(
          (a) => a.text.toLowerCase() === item.text.toLowerCase(),
        );
        if (!exists) acc.push(item);
        return acc;
      }, []);

    const labelStrings = allLabels.map((l) => l.text);
    const topScore = allLabels[0]?.score ?? 0;

    // Match labels to vocabulary
    const matchedWord = findWordByLabel(labelStrings);

    return {
      matchedWord,
      labels: labelStrings,
      confidence: topScore,
      imageUri,
    };
  } catch (error) {
    console.error('[Vision] Scan failed:', error);
    return {
      matchedWord: null,
      labels: [],
      confidence: 0,
      imageUri,
    };
  }
}

// ─── Mock scan (for development without API key) ──────────────────────────────

export async function mockScan(imageUri: string): Promise<ScanResult> {
  await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate latency
  const VOCABULARY = await import('../../constants/vocabulary');
  const words = VOCABULARY.VOCABULARY;
  const randomWord = words[Math.floor(Math.random() * words.length)];
  return {
    matchedWord: randomWord,
    labels: randomWord.imageLabels.slice(0, 5),
    confidence: 0.85 + Math.random() * 0.14,
    imageUri,
  };
}
