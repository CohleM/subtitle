// src/app/shared/types/style.ts
export type SubtitleStyle = {
    id: string;
    name: string;
    category: 'All' | 'Trend' | 'New' | 'Premium' | 'Emoji' | 'Speakers';
    preview?: string; // optional for now, can be image path
    isNew?: boolean;
    isPremium?: boolean;
};