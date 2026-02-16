// src/remotion/Subtitles/ThreeLines.tsx
import React, { useMemo, useState, useEffect } from 'react';
import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
    Sequence,
    delayRender,
    continueRender,
    spring
} from 'remotion';
import { memo } from 'react';
import { SubtitleGroup, Line } from '../../../types/subtitles';
import { SubtitleStyleConfig, FontStyleDefinition } from '../../../types/style';

// Pre-load common fonts to avoid delayRender issues
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadBebas } from '@remotion/google-fonts/BebasNeue';
import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';

// Initialize fonts
loadInter();
loadBebas();
loadPoppins();
loadMontserrat();
loadOswald();

// ============================================
// CONFIGURABLE ANIMATION VARIABLES
// ============================================
const LINE_SPACING = 0;
const FADE_OUT_DURATION_FRAMES = 15; // How long the fade out animation takes
const MAX_WORD_DISPLAY_SECONDS = 2; // Maximum time a word stays on screen
const LINE_OVERLAP_FRAMES = 15; // How many frames previous line stays after next line appears
// ============================================

// Get font styles from config safely
const getFontStyle = (config: SubtitleStyleConfig, fontType: string): FontStyleDefinition => {
    const defaultStyle: FontStyleDefinition = {
        fontSize: 60,
        fontWeight: 400,
        fontFamily: 'Arial',
        color: '#ffffff'
    };

    return config.fonts[fontType as keyof typeof config.fonts] || defaultStyle;
};

// Hook to wait for Google Fonts to load based on config
const useFontsLoaded = (config: SubtitleStyleConfig) => {
    const [loaded, setLoaded] = useState(false);
    const [handle] = useState(() => delayRender('Loading Google Fonts'));

    useEffect(() => {
        const loadAllFonts = async () => {
            const fontStyles = Object.values(config.fonts);

            try {
                await Promise.all(
                    fontStyles.map(style =>
                        document.fonts.load(
                            `${style.fontStyle || 'normal'} ${style.fontWeight} ${style.fontSize}px "${style.fontFamily}"`
                        )
                    )
                );
                setLoaded(true);
                continueRender(handle);
            } catch (err) {
                console.warn('Font loading failed:', err);
                setLoaded(true);
                continueRender(handle);
            }
        };

        loadAllFonts();
    }, [config, handle]);

    return loaded;
};

// Measure actual rendered height of text content
const measureActualTextHeight = (
    text: string,
    style: FontStyleDefinition,
    containerWidth: number
): number => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.fontSize = `${style.fontSize}px`;
    tempDiv.style.fontFamily = `"${style.fontFamily}", sans-serif`;
    tempDiv.style.fontWeight = String(style.fontWeight);
    tempDiv.style.fontStyle = style.fontStyle || 'normal';
    tempDiv.style.lineHeight = '1.0';
    tempDiv.style.width = `${containerWidth}px`;
    tempDiv.style.display = 'flex';
    tempDiv.style.flexWrap = 'wrap';
    tempDiv.style.justifyContent = 'center';
    tempDiv.style.alignItems = 'baseline';
    tempDiv.style.textTransform = style.uppercase ? 'uppercase' : 'none';

    const words = text.split(' ');
    words.forEach((word) => {
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.marginRight = '0.3em';
        span.textContent = word;
        tempDiv.appendChild(span);
    });

    document.body.appendChild(tempDiv);
    const height = tempDiv.offsetHeight;
    document.body.removeChild(tempDiv);

    return height;
};

const calculateLinePositions = (
    lines: Line[],
    config: SubtitleStyleConfig,
    containerWidth: number
): number[] => {
    if (lines.length === 0) return [];

    const lineHeights = lines.map((line) => {
        const style = getFontStyle(config, line.font_type);
        const text = line.words.map(w => w.word).join(' ');
        return measureActualTextHeight(text, style, containerWidth);
    });

    const offsets: number[] = [0];

    for (let i = 1; i < lines.length; i++) {
        const previousHeight = lineHeights[i - 1];
        const previousOffset = offsets[i - 1];
        offsets.push(previousOffset + previousHeight + LINE_SPACING);
    }
    return offsets;
};

// Build text shadow based on shadow settings
const buildTextShadow = (style: FontStyleDefinition): string => {
    const shadows: string[] = ['2px 2px 4px rgba(0,0,0,0.3)']; // Default shadow

    if (style.shadow && style.shadow !== 'none') {
        const blur = style.shadow === 'small' ? 10 : style.shadow === 'medium' ? 20 : 30;
        const color = style.shadowColor || style.color || '#ffffff';
        shadows.push(`0 0 ${blur}px ${color}`);
    }

    if (style.strokeWeight && style.strokeWeight !== 'none') {
        const width = style.strokeWeight === 'small' ? 1 : style.strokeWeight === 'medium' ? 2 : 3;
        const color = style.strokeColor || '#000000';
        // Create outline effect using multiple shadows
        for (let x = -width; x <= width; x++) {
            for (let y = -width; y <= width; y++) {
                if (x !== 0 || y !== 0) {
                    shadows.push(`${x}px ${y}px 0 ${color}`);
                }
            }
        }
    }

    return shadows.join(', ');
};

const WordText = memo(function WordText({
    word,
    wordIndex,
    lineStart,
    wordStart,
    wordEnd,
    lineEnd,
}: {
    word: string;
    wordIndex: number;
    lineStart: number;
    wordStart: number;
    wordEnd: number;
    lineEnd: number;
}) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const relativeWordStart = wordStart - lineStart;
    const wordStartFrame = Math.round(relativeWordStart * fps);
    const animationFrame = Math.max(0, frame - wordStartFrame);

    // Calculate when this word should start fading out (2 seconds after appearance)
    const maxDisplayFrames = MAX_WORD_DISPLAY_SECONDS * fps;
    const fadeOutStartFrame = wordStartFrame + maxDisplayFrames;

    // Determine fade out end based on either 2-second limit or line end, whichever comes first
    const relativeWordEnd = wordEnd - lineStart;
    const wordEndFrame = Math.round(relativeWordEnd * fps);
    const fadeOutEndFrame = Math.min(fadeOutStartFrame + FADE_OUT_DURATION_FRAMES, wordEndFrame);

    // ✅ Use useMemo for expensive calculations
    const springValue = useMemo(() => spring({
        frame: animationFrame,
        fps,
        config: { damping: 100, stiffness: 100 },
    }), [animationFrame, fps]);

    const { opacity, blurAmount } = useMemo(() => {
        // Entry animation (spring)
        const entryProgress = springValue;
        const entryOpacity = interpolate(entryProgress, [0, 1], [0, 1]);
        const entryBlur = interpolate(entryProgress, [0, 1], [5, 0]);

        // Check if we should start fading out (2 seconds after appearance)
        if (frame < fadeOutStartFrame) {
            return { opacity: entryOpacity, blurAmount: entryBlur };
        }

        // If we're past the word's end time, it's fully invisible
        if (frame >= fadeOutEndFrame) {
            return { opacity: 0, blurAmount: 10 };
        }

        // Calculate fade out progress
        const fadeOutProgress = (frame - fadeOutStartFrame) / (fadeOutEndFrame - fadeOutStartFrame);
        const fadeOutOpacity = interpolate(fadeOutProgress, [0, 1], [entryOpacity, 0]);
        const fadeOutBlur = interpolate(fadeOutProgress, [0, 1], [entryBlur, 10]);

        return { opacity: fadeOutOpacity, blurAmount: fadeOutBlur };
    }, [springValue, frame, fadeOutStartFrame, fadeOutEndFrame]);

    return (
        <span style={{
            display: 'inline-block',
            opacity,
            filter: `blur(${blurAmount}px)`,
            marginRight: '0.3em',
            whiteSpace: 'pre',
        }}>
            {word}
        </span>
    );
});

// Calculate fade out animation values based on next line's start
const useLineFadeOut = (
    frame: number,
    fps: number,
    lineStart: number,
    nextLineStart: number | null,
    groupStart: number
) => {
    return useMemo(() => {
        // If there's no next line, never fade out
        if (nextLineStart === null) {
            return { opacity: 1, blur: 0 };
        }

        const relativeLineStart = (lineStart - groupStart) * fps;
        const relativeNextLineStart = (nextLineStart - groupStart) * fps;

        // Previous line stays visible for LINE_OVERLAP_FRAMES after next line starts
        // Then fades out over FADE_OUT_DURATION_FRAMES
        const fadeOutStart = relativeNextLineStart + LINE_OVERLAP_FRAMES;
        const fadeOutEnd = fadeOutStart + FADE_OUT_DURATION_FRAMES;

        // If we haven't reached fade out yet, stay fully visible
        if (frame < fadeOutStart) {
            return { opacity: 1, blur: 0 };
        }

        // If fade out is complete, stay hidden
        if (frame >= fadeOutEnd) {
            return { opacity: 0, blur: 10 };
        }

        // Calculate fade out progress
        const progress = (frame - fadeOutStart) / FADE_OUT_DURATION_FRAMES;

        return {
            opacity: interpolate(progress, [0, 1], [1, 0]),
            blur: interpolate(progress, [0, 1], [0, 10])
        };
    }, [frame, fps, lineStart, nextLineStart, groupStart]);
};

// Wrap LineText in memo
const LineText = memo(function LineText({
    line,
    lineIndex,
    translateYOffset,
    style,
    captionPadding,
    nextLineStart,
    groupStart,
}: {
    line: Line;
    lineIndex: number;
    translateYOffset: number;
    style: FontStyleDefinition;
    captionPadding: number;
    nextLineStart: number | null;
    groupStart: number;
}) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Get fade out animation values
    const { opacity: fadeOutOpacity, blur: fadeOutBlur } = useLineFadeOut(
        frame,
        fps,
        line.start,
        nextLineStart,
        groupStart
    );

    // ✅ Memoize expensive style calculations
    const textShadow = useMemo(() => buildTextShadow(style), [style]);

    const textStroke = useMemo(() => {
        if (!style.strokeWeight || style.strokeWeight === 'none') return undefined;
        const width = style.strokeWeight === 'small' ? 1 : style.strokeWeight === 'medium' ? 2 : 3;
        return `${width}px ${style.strokeColor || '#000000'}`;
    }, [style.strokeWeight, style.strokeColor]);

    const containerStyle = useMemo(() => ({
        justifyContent: 'flex-start' as const,
        alignItems: 'center' as const,
        paddingTop: captionPadding,
        opacity: fadeOutOpacity,
        filter: `blur(${fadeOutBlur}px)`,
        transition: 'none', // Remotion handles the animation frame-by-frame
    }), [captionPadding, fadeOutOpacity, fadeOutBlur]);

    const textStyle = useMemo(() => ({
        transform: `translateY(${translateYOffset}px)`,
        fontSize: style.fontSize,
        fontFamily: `"${style.fontFamily}", sans-serif`,
        fontWeight: style.fontWeight,
        fontStyle: style.fontStyle || 'normal',
        color: style.color || '#ffffff',
        textAlign: 'center' as const,
        textShadow: textShadow,
        lineHeight: 1.0,
        display: 'flex',
        flexWrap: 'wrap' as const,
        justifyContent: 'center',
        alignItems: 'baseline',
        textTransform: style.uppercase ? 'uppercase' : 'none' as const,
        WebkitTextStroke: textStroke,
    }), [translateYOffset, style, textShadow, textStroke]);

    // Calculate line end time for word fade out limits
    const lineEndTime = nextLineStart !== null ? nextLineStart : (groupStart + (line.words[line.words.length - 1]?.end || line.end));

    return (
        <AbsoluteFill style={containerStyle}>
            <div style={textStyle}>
                {line.words.map((word, wordIndex) => (
                    <WordText
                        key={`${word.id}-${wordIndex}`} // Stable key using word.id
                        word={word.word}
                        wordIndex={wordIndex}
                        lineStart={line.start}
                        wordStart={word.start}
                        wordEnd={word.end}
                        lineEnd={lineEndTime}
                    />
                ))}
            </div>
        </AbsoluteFill>
    );
});

type ThreeLinesProps = {
    group: SubtitleGroup;
    config: SubtitleStyleConfig;
    captionPadding?: number;
};

export const FadeAndBlur: React.FC<ThreeLinesProps> = ({
    group,
    config,
    captionPadding = 540
}) => {
    const { fps, width } = useVideoConfig();
    const fontsLoaded = useFontsLoaded(config);

    if (!group?.lines?.length) {
        console.error('Invalid group data:', group);
        return null;
    }

    const containerWidth = width * 0.9;

    const lineOffsets = useMemo(() => {
        if (!fontsLoaded) return [];
        return calculateLinePositions(group.lines, config, containerWidth);
    }, [group.lines, config, fontsLoaded, containerWidth]);

    if (!fontsLoaded || lineOffsets.length === 0) {
        return null;
    }

    return (
        <AbsoluteFill>
            {group.lines.map((line, lineIndex) => {
                const relativeStart = line.start - group.start;
                const from = Math.round(relativeStart * fps);
                const fontStyle = getFontStyle(config, line.font_type);

                // Get the start time of the next line for fade out calculation
                const nextLine = group.lines[lineIndex + 1];
                const nextLineStart = nextLine ? nextLine.start : null;

                // Calculate duration: time until next line + overlap + fade out
                const durationInFrames = nextLineStart
                    ? Math.round((nextLineStart - line.start) * fps) + LINE_OVERLAP_FRAMES + FADE_OUT_DURATION_FRAMES
                    : undefined;

                return (
                    <Sequence
                        key={`line-${lineIndex}`}
                        from={from}
                        durationInFrames={durationInFrames}
                    >
                        <LineText
                            line={line}
                            lineIndex={lineIndex}
                            translateYOffset={lineOffsets[lineIndex]}
                            style={fontStyle}
                            captionPadding={captionPadding}
                            nextLineStart={nextLineStart}
                            groupStart={group.start}
                        />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};