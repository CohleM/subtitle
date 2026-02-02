import { MyVideo } from './MyVideo';
import { SubtitleGroup } from '../../types/subtitles';

type MainProps = {
    transcript: SubtitleGroup[];
    style?: string;
    captionPadding: number;
};

export const Main: React.FC<MainProps> = ({ transcript, style = 'basic', captionPadding = 540 }) => {
    return <MyVideo groups={transcript} style={style} captionPadding={captionPadding} />; // ✅ Pass it
};