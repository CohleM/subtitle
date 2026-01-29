'use client';

import { SubtitleGroup } from '../shared/types/subtitles';
import { GroupEditor } from './GroupEditor';

export const TranscriptEditor: React.FC<{
    transcript: SubtitleGroup[];
    setTranscript: (t: SubtitleGroup[]) => void;
}> = ({ transcript, setTranscript }) => {
    return (
        <div className="space-y-6">
            {transcript.map(group => (
                <GroupEditor
                    key={group.id}
                    group={group}
                    transcript={transcript}
                    setTranscript={setTranscript}
                />
            ))}
        </div>
    );
};
