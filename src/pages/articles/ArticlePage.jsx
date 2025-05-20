import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './ArticlePage.css';

export default function ArticlePage() {
  const { slug } = useParams();

  const articlesMap = {
    'how-to-hear-a-key': {
      title: 'How to Hear a Key',
      content: (
        <>
          <p>Training your ear to hear the key of a piece is essential for improvisation and analysis.</p>
          <h3>Step 1: Recognize the tonic</h3>
          <p>Listen for the note that feels most like "home"—the note everything resolves to.</p>
          <h3>Step 2: Sing the scale</h3>
          <p>Try to sing the scale from memory starting from the tonic. This strengthens inner hearing.</p>
        </>
      ),
    },
    'what-makes-a-good-melody': {
      title: 'What Makes a Good Melody?',
      content: (
        <>
          <p>Great melodies combine repetition, contrast, and contour. Think Beethoven or The Beatles.</p>
          <h3>Hook & Shape</h3>
          <p>Memorable melodies often have a clear arc, stepwise motion, and a rhythmic signature.</p>
        </>
      ),
    },
    // Add more articles here
  };

  const article = articlesMap[slug];

  if (!article) {
    return (
      <div className="light-page">
        <Navbar />
        <div className="article-page">
          <h2>Article not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="light-page">
      <Navbar />
      <div className="article-layout">
        <div className="ad-left">Ad</div>

        <div className="article-page">
          <h1>{article.title}</h1>
          <div className="article-content">{article.content}</div>
        </div>

        <div className="ad-right">Ad</div>
      </div>
    </div>
  );
}
