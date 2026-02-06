'use client';

import { Player } from '@remotion/player';
import { useEffect, useState, useMemo, memo } from 'react';
import { Plus, Trash2, Monitor, Maximize, Wand2 } from 'lucide-react';
import transcriptJson from '../data/transcript_30_min.json';
import { SubtitleGroup } from '../../types/subtitles';
import { Main } from '../remotion/Main';
import { TranscriptEditor } from '../components/TranscriptEditor';
import { StyleSelector } from '../components/StyleSelector';
import { SubtitleStyleConfig } from '../../types/style';
import { defaultStyleConfigs } from '../config/styleConfigs';
import { StyleEditor } from '../components/StyleEditor';
import { OptimizedTranscriptEditor } from '../components/OptimizedTranscriptEditor';
import { Navbar } from '../components/DashboardNavbar';
const VideoPlayer = memo(function VideoPlayer({
  transcript,
  selectedStyle,
  compositionWidth,
  compositionHeight,
  captionPadding,
  customStyleConfigs
}: {
  transcript: SubtitleGroup[];
  selectedStyle: string;
  compositionWidth: number;
  compositionHeight: number;
  captionPadding: number;
  customStyleConfigs?: Record<string, SubtitleStyleConfig>;
}) {
  const inputProps = useMemo(() => ({
    transcript,
    style: selectedStyle,
    captionPadding,
    customStyleConfigs
  }), [transcript, selectedStyle, captionPadding, customStyleConfigs]);

  return (
    <div className="w-full h-full bg-black overflow-hidden rounded-3xl border border-gray-200">
      <Player
        component={Main}
        inputProps={inputProps}
        durationInFrames={1800 * 30}
        fps={30}
        compositionWidth={compositionWidth}
        compositionHeight={compositionHeight}
        controls
        // ✅ Performance optimizations
        // moveToBeginningWhenUnmounted={false} // Prevent seek on mount
        showVolumeControls={false} // Reduce UI overhead
        // ✅ Double buffering for smoother playback
        renderLoading={() => null}
        // ✅ Acknowledge footage
        acknowledgeRemotionLicense={true}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
});




export default function Page() {
  const [transcript, setTranscript] = useState<SubtitleGroup[]>([]);
  const [activeTab, setActiveTab] = useState<'style' | 'captions'>('captions');
  const [isPortrait, setIsPortrait] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState('basic');
  const [editingStyle, setEditingStyle] = useState<string | null>(null); // New state
  const [customConfigs, setCustomConfigs] = useState<Record<string, SubtitleStyleConfig>>({}); // New state
  console.log('selectedStyle', selectedStyle, 'editingStyle', editingStyle)
  useEffect(() => {
    setTranscript(transcriptJson as SubtitleGroup[]);
  }, []);

  const compositionWidth = isPortrait ? 1080 : 1920;
  const compositionHeight = isPortrait ? 1920 : 1080;

  const [captionPadding, setCaptionPadding] = useState(540); // Add this

  const handleDeleteSegment = (index: number) => {
    const newTranscript = transcript.filter((_, i) => i !== index);
    setTranscript(newTranscript);
  };

  const currentStyleConfig = useMemo(() => {
    return customConfigs[selectedStyle] || defaultStyleConfigs[selectedStyle];
  }, [customConfigs, selectedStyle]);

  const handleStyleUpdate = (config: SubtitleStyleConfig) => {
    setCustomConfigs(prev => ({
      ...prev,
      [config.id]: config
    }));
  };
  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-2">

          {/* Left Side - Video Player */}
          <div className="h-full flex flex-col items-center justify-center bg-gray-50/30 border-r border-gray-200 p-8">
            {/* <div className="mb-6 flex bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setIsPortrait(true)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${isPortrait ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
                  }`}
              >
                <Maximize className="w-3.5 h-3.5" style={{ transform: 'rotate(90deg)' }} />
                9:16
              </button>
              <button
                onClick={() => setIsPortrait(false)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${!isPortrait ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
                  }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                16:9
              </button>
            </div> */}


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
                {/* ✅ Now Player only re-renders when transcript or selectedStyle changes */}
                <VideoPlayer
                  transcript={transcript}
                  selectedStyle={selectedStyle}
                  compositionWidth={compositionWidth}
                  compositionHeight={compositionHeight}
                  captionPadding={captionPadding} // ✅ Pass to player
                  customStyleConfigs={customConfigs} // Pass this
                />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4 w-full max-w-sm bg-white border border-gray-200 rounded-xl px-4 py-3">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500 shrink-0">
                Position
              </span>
              <input
                type="range"
                min="0"
                max={compositionHeight}
                value={captionPadding}
                onChange={(e) => setCaptionPadding(Number(e.target.value))}
                className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-black hover:bg-gray-300 transition-colors"
              />
              <span className="text-[10px] font-mono text-gray-600 w-10 text-right">
                {captionPadding}px
              </span>
            </div>
          </div>


          {/* Right Side - Rest of your UI */}
          {/* Right Side - Rest of your UI */}
          <div className="h-full bg-white flex flex-col overflow-hidden rounded-l-3xl">
            {editingStyle ? (
              <StyleEditor
                config={customConfigs[editingStyle] || defaultStyleConfigs[editingStyle]}
                onChange={handleStyleUpdate}
                onBack={() => setEditingStyle(null)}
              />
            ) : (
              <>
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 shrink-0">
                  <div className="flex items-center gap-2 bg-gray-100/50 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveTab('style')}
                      className={`px-5 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${activeTab === 'style' ? 'bg-white text-black' : 'text-gray-400'
                        }`}
                    >
                      Style
                    </button>
                    <button
                      onClick={() => setActiveTab('captions')}
                      className={`px-5 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${activeTab === 'captions' ? 'bg-white text-black' : 'text-gray-400'
                        }`}
                    >
                      Captions
                    </button>
                  </div>
                </div>

                {activeTab === 'style' ? (
                  <StyleSelector
                    selectedStyle={selectedStyle}
                    onStyleSelect={setSelectedStyle}
                    onEditStyle={setEditingStyle} // Pass this
                  />
                ) : (
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <OptimizedTranscriptEditor transcript={transcript} setTranscript={setTranscript} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}