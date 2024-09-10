import React, { createContext, useState, useContext, useCallback } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const resetSearch = useCallback(() => {
    setSearchTerm('');
    setResults([]);
    setHasSearched(false);
  }, []);

  const value = {
    searchTerm,
    setSearchTerm,
    results,
    setResults,
    hasSearched,
    setHasSearched,
    resetSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);