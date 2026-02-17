// import { getStyleConfig } from '../config/styleConfigs';
import { SubtitleStyleConfig } from '../../types/style';
import { SubtitleGroup } from '../../types/subtitles';
import { EqualWidth } from './Subtitles/EqualWidth';
import { GradientBase } from './Subtitles/GradientBase';
import { Glow } from './Subtitles/Glow';
import { WithItalic } from './Subtitles/WithItalic';
import { FadeAndBlur } from './Subtitles/FadeAndBlur';
import { CombinedAnimation } from './Subtitles/CombinedAnimation';
import { NormalAndItalic } from './Subtitles/NormalAndItalic';
import { NormalAndBold } from "./Subtitles/NormalAndBold"

type StyleRendererProps = {
    group: SubtitleGroup;
    style?: string;
    captionPadding?: number;
    customConfigs: SubtitleStyleConfig // Add this
};

export const StyleRenderer: React.FC<StyleRendererProps> = ({
    group,
    style = 'basic',
    captionPadding,
    customConfigs
}) => {
    // const config = getStyleConfig(style, customConfigs);
    const config = customConfigs
    switch (style) {
        case 'matt':
        case 'jess':
        case 'jack':
        case 'GB':
            return <GradientBase
                group={group}
                config={config}
                captionPadding={captionPadding}
            />;

        case 'Glow':
        case 'GlowI': //normal and italic
            return <Glow
                group={group}
                config={config}
                captionPadding={captionPadding}
            />;
        case 'Combo': //normal and italic
            return <CombinedAnimation
                group={group}
                config={config}
                captionPadding={captionPadding}
            />;
        case 'NaI': //normal and italic
            return <NormalAndItalic
                group={group}
                config={config}
                captionPadding={captionPadding}
            />;
        case 'NaB': //normal and italic
            return <NormalAndBold
                group={group}
                config={config}
                captionPadding={captionPadding}
            />;

        default:
            // return <EqualWidth
            //     group={group}
            //     config={config}
            //     captionPadding={captionPadding}
            // />;
            return <EqualWidth
                group={group}
                config={config}
                captionPadding={captionPadding}
            />;
    }
};