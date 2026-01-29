import { SubtitleGroup } from '../shared/types/subtitles';
import { LineEditor } from './LineEditor';

export const GroupEditor: React.FC<{
    group: SubtitleGroup;
    transcript: SubtitleGroup[];
    setTranscript: (t: SubtitleGroup[]) => void;
}> = ({ group, transcript, setTranscript }) => {
    return (
        <div className="border rounded p-4">
            <h3 className="font-bold mb-2">
                Group {group.start}s – {group.end}s
            </h3>

            <div className="space-y-3">
                {group.lines.map(line => (
                    <LineEditor
                        key={line.id}
                        groupId={group.id}
                        line={line}
                        transcript={transcript}
                        setTranscript={setTranscript}
                    />
                ))}
            </div>
        </div>
    );
};
