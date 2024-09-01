import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const imageCache = new Map();

const OptimizedImage = ({ src, alt, className}) => {
  const [imageSrc, setImageSrc] = useState('resources/placeholder.jpg');
  const [imageRef, inView] = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (inView) {
      const loadImage = (imageSrc) => {
        return new Promise((resolve, reject) => {
          if (imageCache.has(imageSrc)) {
            resolve(imageCache.get(imageSrc));
          } else {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
              imageCache.set(imageSrc, imageSrc);
              resolve(imageSrc);
            };
            img.onerror = reject;
          }
        });
      };

      const loadImageWithRetry = async (retries = 3) => {
        try {
          const loadedSrc = await loadImage(src) as string;
          setImageSrc(loadedSrc);
          setIsLoaded(true);
        } catch (error) {
          if (retries > 0) {
            console.log(`Failed to load image, retrying... (${retries} attempts left)`);
            setTimeout(() => loadImageWithRetry(retries - 1), 2000);
          } else {
            console.error('Failed to load image after multiple attempts', error);
          }
        }
      };

      loadImageWithRetry();
    }
  }, [inView, src]);

  return (
    <div ref={imageRef} className={`relative overflow-hidden ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};

export default OptimizedImage;