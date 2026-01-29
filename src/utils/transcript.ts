import { SubtitleGroup } from '../shared/types/subtitles';

export const updateWordText = (
    transcript: SubtitleGroup[],
    groupId: string,
    lineId: string,
    wordId: string,
    newText: string
): SubtitleGroup[] => {
    return transcript.map(group =>
        group.id !== groupId
            ? group
            : {
                ...group,
                lines: group.lines.map(line =>
                    line.id !== lineId
                        ? line
                        : {
                            ...line,
                            words: line.words.map(word =>
                                word.id !== wordId
                                    ? word
                                    : { ...word, word: newText }
                            )
                        }
                )
            }
    );
};
