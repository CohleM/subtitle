import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
type NavbarProps = {
    showLogo?: boolean;   // optional
};

export function Navbar({ showLogo = false }: NavbarProps) {
    const router = useRouter();

    return (
        <nav className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-3 ">
                {showLogo && (
                    <Link
                        href="/dashboard"
                        className="text-xl font-bold tracking-tight text-[var(--color-text)] block"
                    >
                        <Image
                            src="/logo.png"
                            alt="SubtitleAI Logo"
                            width={120}
                            height={40}
                            priority
                        />
                    </Link>
                )}
            </div>

            <div className="flex items-center gap-6">
                <button
                    className="flex items-center gap-3 py-2 px-3 bg-[var(--color-primary)] text-sm font-medium text-white rounded-xl hover:bg-[var(--color-text-light)] transition-colors border border-gray-200 hover:border-gray-300"
                    onClick={() => router.push("/pricing")}
                >
                    Upgrade
                </button>
            </div>
        </nav>
    );
}