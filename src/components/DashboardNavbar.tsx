export function Navbar() {
    return (
        <nav className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-black rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xs">S</span>
                </div>
                <span className="font-medium text-gray-900 tracking-wide text-sm uppercase">Submagic</span>
            </div>

            <div className="flex items-center gap-6">
                <button className="text-sm text-gray-500 hover:text-black transition-colors uppercase tracking-wider text-xs font-medium">
                    Export
                </button>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">U</span>
                </div>
            </div>
        </nav>
    );
}