'use client';

import { Player } from '@remotion/player';
import { useEffect, useState } from 'react';
import {
  Plus,
  EyeOff,
  Trash2,
  Monitor,
  Maximize,
  Wand2
} from 'lucide-react';
import transcriptJson from '../data/transcript.initial.json';
import { SubtitleGroup } from '../shared/types/subtitles';
import { Main } from '../remotion/Main';

// Classy Navbar - More rounded
function Navbar() {
  return (
    <nav className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-black rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-xs">S</span>
        </div>
        <span className="font-medium text-gray-900 tracking-wide text-sm uppercase">Submagic</span>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-sm text-gray-500 hover:text-black transition-colors uppercase tracking-wider text-xs font-medium">
          Export
        </button>
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-gray-600">U</span>
        </div>
      </div>
    </nav>
  );
}

export default function Page() {
  const [transcript, setTranscript] = useState<SubtitleGroup[]>([]);
  const [activeTab, setActiveTab] = useState<'style' | 'captions'>('captions');
  const [isPortrait, setIsPortrait] = useState(true);

  useEffect(() => {
    setTranscript(transcriptJson as SubtitleGroup[]);
  }, []);

  const compositionWidth = isPortrait ? 1080 : 1920;
  const compositionHeight = isPortrait ? 1920 : 1080;

  const handleDeleteSegment = (index: number) => {
    const newTranscript = transcript.filter((_, i) => i !== index);
    setTranscript(newTranscript);
  };

  const handleToggleVisibility = (index: number) => {
    const newTranscript = [...transcript];
    newTranscript[index] = {
      ...newTranscript[index],
      hidden: !newTranscript[index].hidden
    };
    setTranscript(newTranscript);
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-2">

          {/* Left Side - Video Player */}
          <div className="h-full flex flex-col items-center justify-center bg-gray-50/30 border-r border-gray-200 p-8">
            {/* Aspect Ratio Toggle - Rounded */}
            <div className="mb-6 flex bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setIsPortrait(true)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${isPortrait
                  ? 'bg-black text-white'
                  : 'text-gray-500 hover:text-black'
                  }`}
              >
                <Maximize className="w-3.5 h-3.5" style={{ transform: 'rotate(90deg)' }} />
                9:16
              </button>
              <button
                onClick={() => setIsPortrait(false)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${!isPortrait
                  ? 'bg-black text-white'
                  : 'text-gray-500 hover:text-black'
                  }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                16:9
              </button>
            </div>

            {/* Player Container */}
            <div className="relative w-full h-full max-h-[calc(100%-4rem)]">
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  margin: 'auto',
                  aspectRatio: `${compositionWidth} / ${compositionHeight}`,
                  maxHeight: '100%',
                  maxWidth: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div className="w-full h-full bg-black overflow-hidden rounded-3xl border border-gray-200">
                  <Player
                    component={Main}
                    inputProps={{ transcript }}
                    durationInFrames={1800}
                    fps={30}
                    compositionWidth={compositionWidth}
                    compositionHeight={compositionHeight}
                    controls
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Transcript Editor */}
          <div className="h-full bg-white flex flex-col overflow-hidden rounded-l-3xl">

            {/* Header - Rounded buttons */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-2 bg-gray-100/50 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('style')}
                  className={`px-5 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${activeTab === 'style'
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  Style
                </button>
                <button
                  onClick={() => setActiveTab('captions')}
                  className={`px-5 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${activeTab === 'captions'
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  Captions
                </button>
              </div>

              <button className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-medium uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-colors">
                <Wand2 className="w-3.5 h-3.5" />
                Generate Title
              </button>
            </div>

            {/* Accuracy - Minimal */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100 shrink-0 bg-gray-50/30">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Accuracy</span>
              <span className="text-xs font-medium text-black">
                98.56%
              </span>
            </div>

            {/* Add Intro - Rounded corners */}
            <div className="px-8 py-4 border-b border-gray-200 shrink-0">
              <button className="w-full py-3 text-center text-xs text-gray-400 uppercase tracking-wider hover:text-black hover:bg-gray-50 transition-all border border-gray-200 border-dashed rounded-xl">
                Add Intro
              </button>
            </div>

            {/* Transcript List - Rounded hover states */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
              {transcript.map((segment, index) => (
                <div
                  key={index}
                  className={`group flex items-start gap-6 px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors ${segment.hidden ? 'opacity-40' : ''}`}
                >
                  <div className="w-16 shrink-0 pt-0.5">
                    <span className="text-[10px] text-gray-400 font-mono tabular-nums tracking-wider">
                      {segment.startTime?.toFixed(2)}–{segment.endTime?.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm text-gray-900 leading-relaxed ${segment.hidden ? 'line-through text-gray-400' : ''}`}>
                      {segment.text}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg hover:text-black text-gray-400 transition-all">
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(index)}
                      className="p-2 hover:bg-white hover:shadow-sm rounded-lg hover:text-black text-gray-400 transition-all"
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSegment(index)}
                      className="p-2 hover:bg-red-50 rounded-lg hover:text-red-600 text-gray-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}