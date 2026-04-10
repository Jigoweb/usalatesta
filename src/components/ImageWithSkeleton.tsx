import React, { useState } from 'react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
}

export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({ 
  className, 
  skeletonClassName = "bg-slate-200 animate-pulse w-full h-full", 
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {!isLoaded && (
        <div className={`absolute inset-0 z-10 ${skeletonClassName}`} />
      )}
      <img
        {...props}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};
