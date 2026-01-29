import { Line, SubtitleGroup } from '../shared/types/subtitles';
import { WordEditor } from './WordEditor';

export const LineEditor: React.FC<{
    groupId: string;
    line: Line;
    transcript: SubtitleGroup[];
    setTranscript: (t: SubtitleGroup[]) => void;
}> = ({ groupId, line, transcript, setTranscript }) => {
    return (
        <div className="bg-gray-100 p-2 rounded">
            <div className="text-sm mb-1">
                Font: <b>{line.font_type}</b>
            </div>

            <div className="flex flex-wrap gap-2">
                {line.words.map(word => (
                    <WordEditor
                        key={word.id}
                        groupId={groupId}
                        lineId={line.id}
                        word={word}
                        transcript={transcript}
                        setTranscript={setTranscript}
                    />
                ))}
            </div>
        </div>
    );
};
