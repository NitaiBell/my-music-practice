import React from 'react';
import { Link } from 'react-router-dom';
import { articles } from './articlesData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './ArticlesList.css';

export default function ArticlesList() {
  return (
    <div className="articles-wrapper">
      {/* 🔒 Fixed Navbar */}
      <div className="articles-fixed-navbar">
        <Navbar />
      </div>

      {/* 🔄 Scrollable content */}
      <div className="articles-scroll-container">
        {/* Spacer for navbar height */}
        <div style={{ height: '60px' }} />

        <div className="articles-list-container">
          <h2 className="articles-heading">Read Articles</h2>
          <div className="articles-card-grid">
            {articles.map((article) => (
              <Link key={article.slug} to={`/articles/${article.slug}`} className="article-card">
                <img
                  src="/article_images/pianoplaying.png"
                  alt={`${article.title} cover`}
                  className="article-card-image"
                />
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <span className="read-more">Read more →</span>
              </Link>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
