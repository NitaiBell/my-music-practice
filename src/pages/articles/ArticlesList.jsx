// src/pages/articles/ArticlesList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { articles } from './articlesData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer'; // ✅ Add Footer
import './ArticlesList.css';

export default function ArticlesList() {
  return (
    <div className="articles-wrapper">
      <Navbar />
      <div className="articles-scroll-container">
        <div className="articles-list-container">
          <h2 className="articles-heading">Read Articles</h2>
          <div className="articles-card-grid">
            {articles.map((article) => (
              <Link key={article.slug} to={`/articles/${article.slug}`} className="article-card">
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <span className="read-more">Read more →</span>
              </Link>
            ))}
          </div>
        </div>
        <Footer /> {/* ✅ Footer appears below the article list */}
      </div>
    </div>
  );
}
