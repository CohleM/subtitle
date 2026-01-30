import { MyVideo } from './MyVideo';
import { SubtitleGroup } from '../../types/subtitles';

type MainProps = {
    transcript: SubtitleGroup[];
    style?: string;
};

export const Main: React.FC<MainProps> = ({ transcript, style = 'basic' }) => {
    return <MyVideo groups={transcript} />;
};