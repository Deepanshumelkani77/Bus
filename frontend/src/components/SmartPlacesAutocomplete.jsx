import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapPin, Search, X } from 'lucide-react';

const SmartPlacesAutocomplete = ({ 
  placeholder = "Enter location", 
  onPlaceSelect, 
  value = "", 
  label,
  icon: Icon = MapPin,
  className = ""
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const fetchSuggestions = async (input) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:2000/google/autocomplete`, {
        params: { input }
      });

      if (response.data.status === 'OK') {
        setSuggestions(response.data.predictions || []);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Autocomplete error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim()) {
      fetchSuggestions(value);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setQuery(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);

    // Get place details
    try {
      const response = await axios.get(`http://localhost:2000/google/place-details`, {
        params: { place_id: suggestion.place_id }
      });

      if (response.data.status === 'OK' && response.data.result) {
        const place = response.data.result;
        const location = {
          placeId: suggestion.place_id,
          address: place.formatted_address,
          name: place.name,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        };
        onPlaceSelect(location);
      }
    } catch (error) {
      console.error('Place details error:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onPlaceSelect(null);
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-slate-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-navy-100 focus:border-navy-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-300 shadow-sm hover:shadow-lg hover:border-gray-300 text-lg font-medium"
        />
        
        {query && (
          <button
            onClick={clearInput}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-600 text-slate-400 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-5 py-4 cursor-pointer transition-all duration-200 flex items-center space-x-4 ${
                index === selectedIndex 
                  ? 'bg-navy-50 text-navy-900 border-l-4 border-navy-500' 
                  : 'hover:bg-gray-50 text-gray-900'
              } ${index === 0 ? 'rounded-t-2xl' : ''} ${
                index === suggestions.length - 1 ? 'rounded-b-2xl' : ''
              }`}
            >
              <div className={`p-2 rounded-xl ${
                index === selectedIndex ? 'bg-navy-100' : 'bg-gray-100'
              }`}>
                <MapPin className={`h-4 w-4 flex-shrink-0 ${
                  index === selectedIndex ? 'text-navy-600' : 'text-gray-500'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate text-base">
                  {suggestion.structured_formatting?.main_text || suggestion.description}
                </div>
                {suggestion.structured_formatting?.secondary_text && (
                  <div className="text-sm text-gray-500 truncate mt-1">
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartPlacesAutocomplete;
