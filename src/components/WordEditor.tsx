import { Word, SubtitleGroup } from '../shared/types/subtitles';
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
            className="border px-2 py-1 rounded text-sm w-auto"
            value={word.word}
            onChange={e =>
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
        />
    );
};
