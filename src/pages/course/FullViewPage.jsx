import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './FullViewPage.css';

export default function FullViewPage() {
  const { courseId } = useParams();
  
  const [description, setDescription] = useState('');

  const episodeMeta = {
    'snow.mp4': {
      display: 'Snow',
      description: `Snow is magical! ❄️`,
    },
    'rain.mp4': { display: 'Rain', description: 'Rain makes everything fresh and green! 🌧️' },
    'lego.mp4': { display: 'Lego', description: 'Colorful Lego creations. 🧱' },
    'girl is playing.mp4': { display: 'Girl Playing', description: 'A girl playing happily with toys! 🎠' },
    'penguin.mp4': { display: 'Penguin', description: 'A cute penguin sliding on ice. 🐧' },
    'dog.mp4': { display: 'Dog', description: 'A loyal dog running in the snow. 🐕' },
  };

  const defaultFile = 'snow.mp4';

  const [title, setTitle] = useState('');

  useEffect(() => {
    const decodedName = courseId ? decodeURIComponent(courseId) : defaultFile.replace('.mp4', '');
    const fileName = `${decodedName}.mp4`;

    setTitle(episodeMeta[fileName]?.display || 'Course');
    setDescription(episodeMeta[fileName]?.description || 'No description available.');
  }, [courseId]);

  return (
    <div className="fullview-page">
      <nav className="fullview-navbar">
        <h1>{title}</h1>
      </nav>

      <div className="fullview-content">
        <div className="fullview-description">
          <h2>Description</h2>
          <p style={{ whiteSpace: 'pre-line' }}>{description}</p>
        </div>
      </div>
    </div>
  );
}
