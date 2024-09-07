import React, { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const resetSearch = () => {
    setSearchTerm('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, results, setResults, hasSearched, setHasSearched, resetSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);