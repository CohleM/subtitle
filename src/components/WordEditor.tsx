import { Word, SubtitleGroup } from '../../types/subtitles';
import { updateWordText } from '../utils/transcript';

export const WordEditor: React.FC<{
    groupId: string;
    lineId: string;
    word: Word;
    transcript: SubtitleGroup[];
    setTranscript: (t: SubtitleGroup[]) => void;
}> = ({ groupId, lineId, word, transcript, setTranscript }) => {
    return (
        <input
            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-900 
                     hover:border-gray-400 focus:border-black focus:outline-none focus:bg-white
                     transition-all w-auto min-w-[50px] text-center"
            value={word.word}
            onChange={(e) =>
                setTranscript(
                    updateWordText(
                        transcript,
                        groupId,
                        lineId,
                        word.id,
                        e.target.value
                    )
                )
            }
            spellCheck={false}
        />
    );
};