'use client';

import { SubtitleGroup } from '../../types/subtitles';
import { GroupEditor } from './GroupEditor';

export const TranscriptEditor: React.FC<{
    transcript: SubtitleGroup[];
    setTranscript: (t: SubtitleGroup[]) => void;
    onDelete: (index: number) => void;
}> = ({ transcript, setTranscript, onDelete }) => {
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
                    onDelete={() => onDelete(index)}
                />
            ))}
        </div>
    );
};