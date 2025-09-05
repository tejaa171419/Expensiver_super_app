import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  aspectRatio?: "square" | "video" | "auto";
  priority?: boolean;
}

const ResponsiveImage = ({
  src,
  alt,
  className = "",
  fallbackSrc = "/placeholder.svg",
  aspectRatio = "auto",
  priority = false,
}: ResponsiveImageProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video", 
    auto: "",
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setError(false);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className={`relative overflow-hidden ${aspectRatioClasses[aspectRatio]} ${className}`}>
      {loading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
          Failed to load image
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full object-cover transition-opacity duration-300
            ${loading ? "opacity-0" : "opacity-100"}
            ${aspectRatio === "auto" ? "max-w-full height-auto" : ""}
          `}
        />
      )}
    </div>
  );
};

export default ResponsiveImage;