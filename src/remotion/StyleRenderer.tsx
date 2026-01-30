// src/app/remotion/StyleRenderer.tsx
import { SubtitleGroup } from '../../types/subtitles';
import { ThreeLines } from './Subtitles/ThreeLines';
import { GroupText } from './Subtitles/GroupText';

type StyleRendererProps = {
    group: SubtitleGroup;
    style?: string;
};

export const StyleRenderer: React.FC<StyleRendererProps> = ({ group, style = 'basic' }) => {

    console.log('style', style)
    // Simple switch statement - easy to extend
    switch (style) {
        case 'matt':
            // return <MattStyle group={group} />;
            return <ThreeLines group={group} />; // Fallback until you create MattStyle

        case 'jess':
            // return <JessStyle group={group} />;
            return <ThreeLines group={group} />; // Fallback until you create JessStyle

        case 'jack':
        case 'nick':
            // Other styles...
            return <ThreeLines group={group} />;

        case 'basic':
        case 'three-lines':
        default:
            return <ThreeLines group={group} />;
    }
};