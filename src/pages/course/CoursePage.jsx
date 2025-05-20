// src/pages/course/CoursePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar'; // ✅ Reusable Navbar
import Footer from '../../components/Footer'; // ✅ shared component

import VideoPlayer from './VideoPlayer';
import './CoursePage.css';

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const sections = [
    { id: 1, title: 'Winter', episodes: ['snow.mp4', 'rain.mp4'] },
    { id: 2, title: 'Toys', episodes: ['lego.mp4', 'girl is playing.mp4'] },
    { id: 3, title: 'Animals', episodes: ['penguin.mp4', 'dog.mp4'] },
    ...Array.from({ length: 17 }, (_, index) => ({
      id: index + 4,
      title: `Extra Section ${index + 1}`,
      episodes: [],
    })),
  ];

  const episodeMeta = {
    'snow.mp4': {
      display: 'Snow',
      description: `
Welcome to the Snow lesson.

Snow is magical! ❄️ It transforms the world into a peaceful white landscape.

Snowflakes form when water vapor freezes into intricate crystals.

Snow affects rivers, animals, and even human activities in cold areas.

People build igloos from snow!

Enjoy skiing, snowboarding, and snowball fights!

Let's dive deep into the beauty and science of snow! 🌨️
      `,
    },
    'rain.mp4': { display: 'Rain', description: 'Rain makes everything fresh and green! 🌧️' },
    'lego.mp4': { display: 'Lego', description: 'Colorful Lego creations. 🧱' },
    'girl is playing.mp4': { display: 'Girl Playing', description: 'A girl playing happily with toys! 🎠' },
    'penguin.mp4': { display: 'Penguin', description: 'A cute penguin sliding on ice. 🐧' },
    'dog.mp4': { display: 'Dog', description: 'A loyal dog running in the snow. 🐕' },
  };

  const defaultFile = 'snow.mp4';

  const [currentVideo, setCurrentVideo] = useState('');
  const [description, setDescription] = useState('');
  const [openSections, setOpenSections] = useState({});
  const [checkedEpisodes, setCheckedEpisodes] = useState({});
  const [videoDurations, setVideoDurations] = useState({});

  useEffect(() => {
    const decodedName = courseId ? decodeURIComponent(courseId) : defaultFile.replace('.mp4', '');
    const fileName = `${decodedName}.mp4`;

    setCurrentVideo(`/course_videos/${fileName}`);
    setDescription(episodeMeta[fileName]?.description || 'No description available.');
  }, [courseId]);

  useEffect(() => {
    sections.forEach(section => {
      section.episodes.forEach(file => {
        if (!videoDurations[file]) {
          loadVideoDuration(file);
        }
      });
    });
  }, []);

  const loadVideoDuration = (fileName) => {
    const video = document.createElement('video');
    video.src = `/course_videos/${fileName}`;
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      setVideoDurations(prev => ({
        ...prev,
        [fileName]: video.duration,
      }));
    };
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheckboxChange = (file) => {
    setCheckedEpisodes((prev) => ({
      ...prev,
      [file]: !prev[file],
    }));
  };

  const currentFile = `${decodeURIComponent(courseId || defaultFile.replace('.mp4', ''))}.mp4`;
  const currentTitle = episodeMeta[currentFile]?.display || 'Course';

  return (
    <div className="course-page">
      {/* 🔒 Fixed Navbar */}
      <div className="course-fixed-navbar">
        <Navbar />
      </div>
  
      {/* 🔄 Spacer for fixed navbar height */}
      <div style={{ height: '60px' }} />
  
      {/* Main course layout */}
      <div className="course-main">
        <div className="course-content">
          <div className="video-player">
            {currentVideo && <VideoPlayer src={currentVideo} />}
          </div>
  
          <div className="course-details">
            <h2
              className="description-link"
              onClick={() =>
                window.open(
                  `/fullview/${encodeURIComponent(courseId || defaultFile.replace('.mp4', ''))}`,
                  '_blank'
                )
              }
            >
              Description – {currentTitle}
            </h2>
            <p style={{ whiteSpace: 'pre-line' }}>{description}</p>
          </div>
  
          <aside className="course-sidebar">
            {sections.map((section) => (
              <div key={section.id}>
                <button
                  className="course-section-header"
                  onClick={() => toggleSection(section.id)}
                >
                  {section.title}
                </button>
                {openSections[section.id] && section.episodes.length > 0 && (
                  <ul className="course-episode-list">
                    {section.episodes.map((file) => {
                      const nameWithoutExt = file.replace('.mp4', '');
                      const active =
                        decodeURIComponent(courseId || defaultFile.replace('.mp4', '')) ===
                        nameWithoutExt;
  
                      return (
                        <li key={file} className="course-episode-item-wrapper">
                          <input
                            type="checkbox"
                            className="episode-checkbox"
                            checked={!!checkedEpisodes[file]}
                            onChange={() => handleCheckboxChange(file)}
                          />
                          <button
                            className={`course-episode-item ${active ? 'active' : ''}`}
                            onClick={() => navigate(`/course/${encodeURIComponent(nameWithoutExt)}`)}
                          >
                            {episodeMeta[file]?.display || nameWithoutExt}
                            {videoDurations[file] && (
                              <span className="episode-duration">
                                ({formatDuration(videoDurations[file])})
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </aside>
        </div>
      </div>
  
      <Footer />
    </div>
  );
  
}
