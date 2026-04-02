'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  lang?: string;
}

export function YouTubeEmbed({ videoId, title, lang = 'pt' }: YouTubeEmbedProps) {
  const [activated, setActivated] = useState(false);

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className="apple-card overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-red-600" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              {lang === 'pt' ? 'Assista e aprenda' : 'Watch & Learn'}
            </p>
            <p className="text-sm font-bold text-[var(--color-text-primary)] line-clamp-1">{title}</p>
          </div>
        </div>
      </div>

      {/* Player */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {!activated ? (
          /* Lazy thumbnail — no cookies, no tracking until user clicks */
          <button
            onClick={() => setActivated(true)}
            className="absolute inset-0 w-full h-full group focus:outline-none"
            aria-label={lang === 'pt' ? `Reproduzir: ${title}` : `Play: ${title}`}
          >
            {/* Thumbnail */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/95 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="w-7 h-7 md:w-9 md:h-9 text-[#FF0000] fill-[#FF0000] translate-x-0.5" />
              </div>
            </div>

            {/* Privacy notice */}
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/70 text-xs px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm whitespace-nowrap">
              {lang === 'pt' ? '▶ Clique para carregar o vídeo (YouTube)' : '▶ Click to load video (YouTube)'}
            </span>
          </button>
        ) : (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}
