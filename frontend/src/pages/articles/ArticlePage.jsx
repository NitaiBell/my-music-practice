import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './ArticlePage.css';
import { articlesMap } from './articleContent.jsx';

export default function ArticlePage() {
  const { slug } = useParams();
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
