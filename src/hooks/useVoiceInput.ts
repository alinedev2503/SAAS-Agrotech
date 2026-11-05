import { useState, useCallback } from 'react';
import { useOffline } from '../contexts/OfflineContext';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export function useVoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { isOnline, addToSyncQueue } = useOffline();

  const startListening = useCallback(async (context: string = 'general') => {
    setIsListening(true);
    
    // Simulate recording delay
    setTimeout(async () => {
      setIsListening(false);
      setProcessing(true);

      // Mock transcription in US English
      const mockTranscriptions = [
        "Log 20 doses of Foot & Mouth vaccine for Pen 4 calves today",
        "Apply 10-34-0 starter fertilizer to Field 04 tomorrow",
        "Heifer #103 diagnosed with mastitis, initiate Cephapirin withholding protocol",
        "Finished planting Pioneer 1197AM corn in North 80-acre plot"
      ];
      const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      
      if (isOnline) {
        try {
          // Process with Gemini immediately if online
          const model = "gemini-2.5-flash";
          const prompt = `
            Context: ${context}
            Voice Command: "${randomTranscription}"
            
            Extract structured agricultural event data into JSON with keys (action, target, quantity, date, notes).
          `;

          const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: { responseMimeType: "application/json" }
          });
          
          const parsed = JSON.parse(response.text || '{}');
          setResult(JSON.stringify(parsed, null, 2));
        } catch (e) {
          console.error("Gemini Error:", e);
          setResult("Cloud parsing error. Cached locally for subsequent sync.");
          addToSyncQueue({ type: 'voice_command', content: randomTranscription, context });
        }
      } else {
        // Offline mode: Save raw audio/text to queue
        setResult("Offline mode active: Audio command securely cached and queued for headquarters sync.");
        addToSyncQueue({ type: 'voice_command', content: randomTranscription, context });
      }
      
      setProcessing(false);
    }, 1500);
  }, [isOnline, addToSyncQueue]);

  return { isListening, processing, result, startListening };
}
