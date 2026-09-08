'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { Sparkles } from 'lucide-react';

interface CardImageProps extends Omit<ImageProps, 'onError'> {
  fallbackCategory?: string;
}

export default function CardImage({
  src,
  alt,
  fallbackCategory,
  className = '',
  fill,
  sizes,
  priority,
  ...props
}: CardImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-950/60 via-slate-900 to-indigo-950/80 p-4 text-center select-none border border-slate-800/80">
        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-2">
          <Sparkles className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold text-white line-clamp-1">{alt}</span>
        {fallbackCategory && (
          <span className="text-[10px] text-purple-300/80 font-semibold mt-0.5">
            {fallbackCategory}
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      onError={() => setHasError(true)}
      className={className}
      {...props}
    />
  );
}
