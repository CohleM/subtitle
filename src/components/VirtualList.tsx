'use client';

import { memo, useCallback, useRef, useState, useEffect, useMemo } from 'react';

interface VirtualListProps<T> {
    items: T[];
    itemHeight: number;
    renderItem: (item: T, index: number) => React.ReactNode;
    overscan?: number;
    className?: string;
}

export const VirtualList = memo(function VirtualList<T>({
    items,
    itemHeight,
    renderItem,
    overscan = 3,
    className = '',
}: VirtualListProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            setContainerHeight(entries[0].contentRect.height);
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const { virtualItems, totalHeight, startIndex } = useMemo(() => {
        const totalHeight = items.length * itemHeight;
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        const visibleCount = Math.ceil(containerHeight / itemHeight) + 2 * overscan;
        const endIndex = Math.min(items.length, startIndex + visibleCount);

        const virtualItems = items.slice(startIndex, endIndex).map((item, idx) => ({
            item,
            index: startIndex + idx,
            style: {
                position: 'absolute' as const,
                top: (startIndex + idx) * itemHeight,
                height: itemHeight,
                left: 0,
                right: 0,
            },
        }));

        return { virtualItems, totalHeight, startIndex };
    }, [items, itemHeight, scrollTop, containerHeight, overscan]);

    const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    }, []);

    return (
        <div
            ref={containerRef}
            onScroll={onScroll}
            className={`overflow-auto ${className}`}
            style={{ height: '100%' }}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                {virtualItems.map(({ item, index, style }) => (
                    <div key={index} style={style}>
                        {renderItem(item, index)}
                    </div>
                ))}
            </div>
        </div>
    );
});