import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Input } from "../ui/input";
import { SearchButton } from "../ui/Searchbutton";
import TitleBar from "./TitleBar";
import Categorybar from "./Categorybar";
import { useSearch } from './SearchContent';
import { useLocation } from 'react-router-dom';

const SearchBanner = ({ onSearch }) => {
  const location = useLocation();
  const { searchTerm, setSearchTerm, results, setResults, hasSearched, setHasSearched, resetSearch } = useSearch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = useCallback(async () => {
    if (!searchTerm) return;
    
    setLoading(true);
    setError(null);
    onSearch(searchTerm);
  
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurants`, {
        params: {
          name: searchTerm,
          sort: 'minPrice_1'
        }
      });
      if (response.data.success) {
        setResults(response.data.data.data);
        setHasSearched(true);
      } else {
        setError('Failed to fetch results');
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('no results found');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, onSearch, setResults, setHasSearched]);

  useEffect(() => {
    if (location.pathname !== '/') {
      resetSearch();
    }
  }, [location.pathname, resetSearch]);

  useEffect(() => {
    if (location.state?.searchTerm) {
      setSearchTerm(location.state.searchTerm);
      handleSearch();
    }
  }, [location.state, setSearchTerm, handleSearch]);
  

  return (
    <>
      <div className="px-96 flex bg-gray-100 justify-center mb-10">
        <Input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <SearchButton 
          onClick={handleSearch} 
          disabled={loading}
          className="my-4 h-8 border-0 hover:border-white hover:border-b-0"
        >
          {loading ? 'Searching...' : 'Search'}
        </SearchButton>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {location.pathname === '/' && hasSearched && (
        <>
          <TitleBar 
            title="Search Results" 
            description={`Showing results for "${searchTerm}"`} 
          />
          {results.length > 0 ? (
            <Categorybar restaurants={results} />
          ) : (
            <p className="text-center mt-4">No results found.</p>
          )}
        </>
      )}
    </>
  );
};

export default SearchBanner;