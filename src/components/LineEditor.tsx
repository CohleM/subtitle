import { Line, SubtitleGroup } from '../../types/subtitles';
import { WordEditor } from './WordEditor';

export const LineEditor: React.FC<{
    groupId: string;
    line: Line;
    transcript: SubtitleGroup[];
    setTranscript: (t: SubtitleGroup[]) => void;
}> = ({ groupId, line, transcript, setTranscript }) => {

    const getFontClass = (type: string) => {
        switch (type) {
            case 'bold': return 'font-bold text-gray-900';
            case 'thin': return 'font-light text-gray-600';
            case 'italic': return 'italic text-gray-700';
            default: return 'font-normal text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            {/* Line Header */}
            <div className="flex items-center justify-between mb-3">
                <span className={`text-xs uppercase tracking-wider ${getFontClass(line.font_type)}`}>
                    {line.font_type || 'normal'}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                    {line.start.toFixed(2)}s
                </span>
            </div>

            {/* Full text preview */}


            {/* Words */}
            <div className="flex flex-wrap gap-2">
                {line.words?.map((word, wordIndex) => (
                    <WordEditor
                        key={word.id || wordIndex}
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