import { MyVideo } from './MyVideo';
import { SubtitleGroup } from '../shared/types/subtitles';

export const Main: React.FC<{
    transcript: SubtitleGroup[];
}> = ({ transcript }) => {
    return <MyVideo groups={transcript} />;
};