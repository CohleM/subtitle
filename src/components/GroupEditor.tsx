import { SubtitleGroup } from '../shared/types/subtitles';
import { LineEditor } from './LineEditor';

export const GroupEditor: React.FC<{
    group: SubtitleGroup;
    transcript: SubtitleGroup[];
    setTranscript: (t: SubtitleGroup[]) => void;
    index: number;
}> = ({ group, transcript, setTranscript, index }) => {

    // Helper to format time (0.00s)
    const formatTime = (time: number) => {
        return `${time.toFixed(2)}s`;
    };

    return (
        <div className={`bg-gray-50 rounded-2xl border border-gray-200 p-5 transition-all ${group.hidden ? 'opacity-40' : ''}`}>
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
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {group.lines?.length || 0} lines
                    </span>
                </div>
            </div>

            {/* Group Summary Text (from JSON) */}
            {group.group_text && (
                <div className="mb-4 text-sm text-gray-700 font-medium leading-relaxed">
                    {group.group_text}
                </div>
            )}

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