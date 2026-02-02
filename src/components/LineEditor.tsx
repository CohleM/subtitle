import { Line, SubtitleGroup } from '../../types/subtitles';
import { WordEditor } from './WordEditor';
import { updateLineFontType } from '../utils/transcript';

export const LineEditor: React.FC<{
    groupId: string;
    line: Line;
    transcript: SubtitleGroup[];
    setTranscript: (t: SubtitleGroup[]) => void;
}> = ({ groupId, line, transcript, setTranscript }) => {

    const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // ✅ Cast the string to the specific union type
        const newFontType = e.target.value as Line['font_type'];

        setTranscript(
            updateLineFontType(transcript, groupId, line.id, newFontType)
        );
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            {/* Line Header */}
            <div className="flex items-center justify-between mb-3">
                <select
                    value={line.font_type || 'normal'}
                    onChange={handleFontChange}
                    className="text-xs uppercase tracking-wider bg-gray-50 border border-gray-200 
                             rounded-lg px-2 py-1.5 focus:outline-none focus:border-black 
                             hover:border-gray-400 transition-colors cursor-pointer font-medium"
                >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="thin">Thin</option>
                    <option value="italic">Italic</option>
                </select>

                <span className="text-[10px] text-gray-400 font-mono">
                    {line.start.toFixed(2)}s
                </span>
            </div>

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