// import { getStyleConfig } from '../config/styleConfigs';
import { SubtitleStyleConfig } from '../../types/style';
import { SubtitleGroup } from '../../types/subtitles';
import { EqualWidth } from './Subtitles/EqualWidth';
import { GradientBelow } from './Subtitles/GradientBelow';
import { Glow } from './Subtitles/Glow';
import { WithItalic } from './Subtitles/WithItalic';
import { FadeAndBlur } from './Subtitles/FadeAndBlur';

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
        case 'basic':
        default:
            // return <EqualWidth
            //     group={group}
            //     config={config}
            //     captionPadding={captionPadding}
            // />;
            return <FadeAndBlur
                group={group}
                config={config}
                captionPadding={captionPadding}
            />;
    }
};