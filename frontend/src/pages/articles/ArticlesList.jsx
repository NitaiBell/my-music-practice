import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { articles } from './articlesData';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './ArticlesList.css';

// ✅ Set your backend base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ArticlesList() {
  const { currentUser } = useAuth();
  const [readArticles, setReadArticles] = useState([]);

  // ✅ Fetch read articles from backend
  useEffect(() => {
    if (currentUser?.email) {
      fetch(`${API_BASE_URL}/api/article-reads/read?email=${currentUser.email}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load read articles');
          return res.json();
        })
        .then((data) => setReadArticles(data))
        .catch((err) => console.error('❌ Error fetching read articles:', err));
    }
  }, [currentUser]);

  // ✅ Toggle article read status
  const toggleReadStatus = (e, slug) => {
    e.preventDefault(); // prevent navigation when clicking the checkmark
    if (!currentUser?.email) return;

    const isAlreadyRead = readArticles.includes(slug);
    const endpoint = isAlreadyRead ? 'unmark-read' : 'mark-read';

    fetch(`${API_BASE_URL}/api/article-reads/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: currentUser.email,
        articleSlug: slug,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to ${endpoint} article`);
        setReadArticles((prev) =>
          isAlreadyRead ? prev.filter((s) => s !== slug) : [...prev, slug]
        );
      })
      .catch((err) => console.error(`❌ Error toggling article status:`, err));
  };

  return (
    <div className="articles-wrapper">
      <div className="articles-fixed-navbar">
        <Navbar />
      </div>

      <div className="articles-scroll-container">
        <div style={{ height: '60px' }} />

        <div className="articles-list-container">
          <h2 className="articles-heading">Read Articles</h2>
          <div className="articles-card-grid">
            {articles.map((article) => {
              const isRead = readArticles.includes(article.slug);
              return (
                <div key={article.slug} className="article-card-wrapper">
                  <Link to={`/articles/${article.slug}`} className="article-card">
                    <img
                      src={article.image}
                      alt={`${article.title} cover`}
                      className="article-card-image"
                    />
                    <h3>
                      {article.title}{' '}
                      {currentUser && (
                        <span
                          className="checkmark"
                          onClick={(e) => toggleReadStatus(e, article.slug)}
                          title={isRead ? 'Unmark as Read' : 'Mark as Read'}
                        >
                          {isRead ? '✅' : '⬜️'}
                        </span>
                      )}
                    </h3>
                    <p>{article.summary}</p>
                    <span className="read-more">Read more →</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
