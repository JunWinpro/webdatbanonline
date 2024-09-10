import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Input } from "../ui/input";
import { SearchButton } from "../ui/Searchbutton";
import TitleBar from "./TitleBar";
import Categorybar from "./Categorybar";
import { useSearch } from './SearchContent';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBanner = ({ onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, results, setResults, hasSearched, setHasSearched, resetSearch } = useSearch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = useCallback(async (term) => {
    if (!term) return;
    
    setLoading(true);
    setError(null);
    onSearch(term);
  
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurants`, {
        params: {
          name: term,
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
  }, [onSearch, setResults, setHasSearched]);

  useEffect(() => {
    const handleLocationChange = () => {
      if (location.pathname !== '/') {
        resetSearch();
      } else if (location.state?.searchTerm) {
        const newSearchTerm = location.state.searchTerm;
        setSearchTerm(newSearchTerm);
        performSearch(newSearchTerm);
        navigate(location.pathname, { replace: true, state: {} });
      }
    };

    handleLocationChange();
  }, [location, resetSearch, setSearchTerm, performSearch, navigate]);

  const handleSearch = useCallback(() => {
    performSearch(searchTerm);
  }, [performSearch, searchTerm]);

  const handleInputChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  return (
    <>
      <div className="px-96 flex bg-gray-100 justify-center mb-10">
        <Input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={handleInputChange}
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