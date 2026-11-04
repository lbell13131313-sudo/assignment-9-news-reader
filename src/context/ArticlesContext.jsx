import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// ⚠️ SECURITY ISSUE: This context is shared globally with no user authentication
// All users see the same saved articles!
const ArticlesContext = createContext();

export function ArticlesProvider({ children }) {
  const [savedArticles, setSavedArticles] = useState({}); //useState([])

  const { user } = useAuth();

  /* const saveArticle = (article) => {
    setSavedArticles(prev => {
      // Check if article is already saved
      if (prev.find(a => a.url === article.url)) {
        return prev;
      }
      return [...prev, article];
    });
  }; */

  const saveArticle = (article) => {
    // Guard clause if user is not logged in
    if (!user?.username) return; 

    setSavedArticles(prev => {
      // access current user's array, if none exists defaults to empty
      const userArticles = prev[user.username] || [];

      // Check if article is already saved for this specific user
      if (userArticles.some(a => a.url === article.url)) {
        return prev;
      }

      // returns our updated state object
      return {
        ...prev,
        [user.username]: [...userArticles, article],
      };
    });
  };

  /* const removeArticle = (url) => {
    setSavedArticles(prev => prev.filter(a => a.url !== url));
  }; */

  const removeArticle = (url) => {
    // Guard clause if user is not logged in
    if (!user?.username) return; 

    setSavedArticles(prev => {
      // access current user's array, if none exists defaults to empty
      const userArticles = prev[user.username] || [];

      // returns our updated state object
      return {
        ...prev,
        [user.username]: userArticles.filter(a => a.url !== url),
      };
    });
  };

  /* const isArticleSaved = (url) => {
    return savedArticles.some(a => a.url === url);
  }; */

  const isArticleSaved = (url) => {
    // Guard clause or fallback if user is not logged in
    if (!user?.username) return false;

    const userArticles = savedArticles[user.username] || [];
    return userArticles.some(a => a.url === url);
  };

  const getUserSavedArticles = () => {
    // Guard clause if user is not logged in or doesn't have a username
    if (!user?.username) return [];

    // Return the specific user's array, or an empty array fallback
    return savedArticles[user.username] || [];
  };

  return (
    <ArticlesContext.Provider 
      value={{ 
        savedArticles, 
        saveArticle, 
        removeArticle, 
        isArticleSaved,
        getUserSavedArticles
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within ArticlesProvider');
  }
  return context;
};