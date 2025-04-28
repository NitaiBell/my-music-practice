import React from 'react';
import './VideoPlayer.css';

export default function VideoPlayer({ src, poster }) {
  return (
    <div className="video-wrapper">
      <video
        src={src}
        poster={poster}
        controls
        autoPlay={false}
        preload="metadata"
      />
    </div>
  );
}