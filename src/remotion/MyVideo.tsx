import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { SubtitleGroup } from '../shared/types/subtitles';
import { ThreeLines } from './Subtitles/ThreeLines';

export const MyVideo: React.FC<{ groups: SubtitleGroup[] }> = ({ groups }) => {
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill style={{ background: 'black' }}>
            {groups.map((group, index) => {
                const from = Math.round(group.start * fps);
                const to = Math.round(group.end * fps);

                return (
                    <Sequence
                        key={group.id}
                        from={from}
                        durationInFrames={to - from}
                    >
                        <ThreeLines group={group} />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
