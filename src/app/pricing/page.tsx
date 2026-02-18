// src/app/pricing/page.tsx
import { Pricing } from '@/components/Pricing';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            <Pricing isLandingPage={false} />
        </div>
    );
}