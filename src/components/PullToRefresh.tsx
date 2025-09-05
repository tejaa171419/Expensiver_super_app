import { useState, useRef, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  threshold?: number;
}

const PullToRefresh = ({ onRefresh, children, threshold = 80 }: PullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (startY && window.scrollY === 0) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startY);
      setPullDistance(distance);
      
      if (distance > threshold) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
    setStartY(0);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startY, pullDistance, threshold, isRefreshing, onRefresh]);

  const pullProgress = Math.min(pullDistance / threshold, 1);
  const showRefreshIndicator = pullDistance > 20;

  return (
    <div ref={containerRef} className="relative">
      {/* Pull to Refresh Indicator */}
      {showRefreshIndicator && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-primary/10 backdrop-blur-sm border-b border-primary/20 z-10 transition-all duration-200"
          style={{ 
            transform: `translateY(-100%) translateY(${Math.min(pullDistance, threshold + 20)}px)`,
            opacity: pullProgress
          }}
        >
          <RefreshCw 
            className={`w-5 h-5 text-primary transition-transform duration-200 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{ 
              transform: `rotate(${pullProgress * 180}deg)`
            }}
          />
          <span className="ml-2 text-sm text-primary font-medium">
            {isRefreshing ? 'Refreshing...' : pullDistance > threshold ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      )}

      {/* Content */}
      <div 
        className="transition-transform duration-200"
        style={{ 
          transform: `translateY(${Math.min(pullDistance * 0.5, threshold * 0.5)}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;