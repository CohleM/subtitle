'use client';
import { Player } from '@remotion/player';
import { useEffect, useState } from 'react';
import transcriptJson from '../data/transcript.initial.json';
import { SubtitleGroup } from '../shared/types/subtitles';
import { TranscriptEditor } from '../components/TranscriptEditor';
import { Main } from '../remotion/Main';

export default function Page() {
  const [transcript, setTranscript] = useState<SubtitleGroup[]>([]);

  useEffect(() => {
    setTranscript(transcriptJson as SubtitleGroup[]);
  }, []);

  // Calculate height based on aspect ratio (1080x1920 = 9:16)
  const playerWidth = 260;
  const playerHeight = (playerWidth * 1920) / 1080;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
      <div className="flex gap-6">
        {/* Left side - Player */}
        <div className="flex-shrink-0">
          <Player
            component={Main}
            inputProps={{ transcript }}
            durationInFrames={1800}
            fps={30}
            compositionWidth={1080}
            compositionHeight={1920}
            controls
            // autoPlay
            // loop
            style={{
              width: playerWidth,
              height: playerHeight
            }}
          />
        </div>

        {/* Right side - Transcript Editor */}
        <div className="flex-1 min-w-0">
          <TranscriptEditor
            transcript={transcript}
            setTranscript={setTranscript}
          />
        </div>
      </div>
    </div>
  );
}