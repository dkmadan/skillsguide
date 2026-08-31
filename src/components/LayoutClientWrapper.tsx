'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import GlobalSearchModal from './GlobalSearchModal';
import BookmarksDrawer from './BookmarksDrawer';
import CareerCompassQuizModal from './CareerCompassQuizModal';

interface LayoutClientWrapperProps {
  children: React.ReactNode;
}

export default function LayoutClientWrapper({ children }: LayoutClientWrapperProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);

  // Load saved bookmarks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('skillsguide_bookmarks');
      if (stored) {
        setSavedSlugs(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleRemoveBookmark = (slug: string) => {
    const updated = savedSlugs.filter(s => s !== slug);
    setSavedSlugs(updated);
    try {
      localStorage.setItem('skillsguide_bookmarks', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleBookmark = (slug: string) => {
    let updated: string[];
    if (savedSlugs.includes(slug)) {
      updated = savedSlugs.filter(s => s !== slug);
    } else {
      updated = [...savedSlugs, slug];
    }
    setSavedSlugs(updated);
    try {
      localStorage.setItem('skillsguide_bookmarks', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Listen for global custom bookmark toggle events if needed
  useEffect(() => {
    const handleBookmarkEvent = (e: any) => {
      if (e.detail?.slug) {
        handleToggleBookmark(e.detail.slug);
      }
    };
    window.addEventListener('toggle-bookmark' as any, handleBookmarkEvent);
    return () => window.removeEventListener('toggle-bookmark' as any, handleBookmarkEvent);
  }, [savedSlugs]);

  return (
    <>
      <Navbar 
        onOpenSearch={() => setSearchOpen(true)}
        onOpenBookmarks={() => setBookmarksOpen(true)}
        onOpenQuiz={() => setQuizOpen(true)}
        bookmarkCount={savedSlugs.length}
      />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />

      {/* Global Modals */}
      <GlobalSearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />

      <BookmarksDrawer 
        isOpen={bookmarksOpen} 
        onClose={() => setBookmarksOpen(false)} 
        savedSlugs={savedSlugs}
        onRemoveBookmark={handleRemoveBookmark}
      />

      <CareerCompassQuizModal 
        isOpen={quizOpen} 
        onClose={() => setQuizOpen(false)} 
      />
    </>
  );
}
