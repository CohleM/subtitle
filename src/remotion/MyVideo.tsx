import { AbsoluteFill, Sequence, useVideoConfig, Html5Audio, staticFile, Html5Video } from 'remotion';
import { SubtitleGroup } from '../../types/subtitles';
import { ThreeLines } from './Subtitles/ThreeLines';
import { StyleRenderer } from './StyleRenderer';

type MainProps = {
    groups: SubtitleGroup[];
    style?: string;
};


export const MyVideo: React.FC<MainProps> = ({ groups, style = 'basic' }) => {
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill style={{ background: 'black' }}>
            {groups.map((group, index) => {
                const from = Math.max(0, Math.round(group.start * fps));

                // take NEXT group's start, fallback to current group's end
                const nextStart = groups[index + 1]?.start;
                const toSeconds = nextStart ?? group.end;

                const to = Math.max(from + 1, Math.round(toSeconds * fps));
                const durationInFrames = to - from;

                return (
                    <Sequence
                        key={group.id}
                        from={from}
                        durationInFrames={durationInFrames}
                    >
                        <StyleRenderer group={group} style={style} />
                    </Sequence>
                );
            })}
            {/* <Html5Audio src={staticFile('audio.mp3')} /> */}
            <Html5Video src={staticFile('input1.mp4')} />
        </AbsoluteFill>
    );
};
