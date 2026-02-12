import { SubtitleGroup } from '../../types/subtitles';
import { LineEditor } from './LineEditor';
// import { Plus, Trash2 } from 'lucide-react';

export const GroupEditor: React.FC<{
    group: SubtitleGroup;
    transcript: SubtitleGroup[];
    setTranscript: (t: SubtitleGroup[]) => void;
    index: number;
    onDelete: () => void;
}> = ({ group, transcript, setTranscript, index, onDelete }) => {

    const formatTime = (time: number) => {
        return `${time.toFixed(2)}s`;
    };

    return (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
            {/* Group Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">
                        Group {index + 1}
                    </span>
                    <span className="text-xs font-mono text-gray-500 tabular-nums">
                        {formatTime(group.start)} – {formatTime(group.end)}
                    </span>
                </div>
                {/* <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-black transition-colors">
                        <Plus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div> */}
            </div>

            {/* Group Summary Text */}
            {/* {group.group_text && (
                <div className="mb-4 text-sm text-gray-700 font-medium leading-relaxed">
                    {group.group_text}
                </div>
            )} */}

            {/* Lines */}
            <div className="space-y-3">
                {group.lines?.map((line, lineIndex) => (
                    <LineEditor
                        key={line.id || lineIndex}
                        groupId={group.id}
                        line={line}
                        transcript={transcript}
                        setTranscript={setTranscript}
                    />
                ))}
            </div>
        </div>
    );
};