import { SubtitleStyleConfig } from "../../types/style";
import { SubtitleGroup } from "../../types/subtitles";
import { MyVideo } from "./MyVideo";

type MainProps = {
    transcript: SubtitleGroup[];
    style?: string;
    captionPadding: number;
    customStyleConfigs?: Record<string, SubtitleStyleConfig>; // Add this
    videoUrl: string
};

export const Main: React.FC<MainProps> = ({
    transcript,
    style = 'basic',
    captionPadding,
    customStyleConfigs,
    videoUrl
}) => {
    return <MyVideo
        groups={transcript}
        style={style}
        captionPadding={captionPadding}
        customStyleConfigs={customStyleConfigs} // Pass through
        videoUrl={videoUrl}
    />;
};