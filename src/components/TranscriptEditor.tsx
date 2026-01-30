'use client';

import { SubtitleGroup } from '../shared/types/subtitles';
import { GroupEditor } from './GroupEditor';

export const TranscriptEditor: React.FC<{
    transcript: SubtitleGroup[];
    setTranscript: (t: SubtitleGroup[]) => void;
}> = ({ transcript, setTranscript }) => {
    if (transcript.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm uppercase tracking-wider">
                No transcript loaded
            </div>
        );
    }

    return (
        <div className="space-y-4 p-4">
            {transcript.map((group, index) => (
                <GroupEditor
                    key={group.id || index}
                    group={group}
                    transcript={transcript}
                    setTranscript={setTranscript}
                    index={index}
                />
            ))}
        </div>
    );
};