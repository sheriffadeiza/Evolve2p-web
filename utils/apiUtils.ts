/**
 * API Utilities
 *
 * This file contains utility functions for making API calls.
 */

import { API_BASE_URL } from '@/config/api';

/**
 * Enhanced fetch function with better error handling and logging
 *
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns Promise with the response
 */
export const enhancedFetch = async (url: string, options: RequestInit = {}) => {
  // Log the request details in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🚀 API Request: ${options.method || 'GET'} ${url}`);
    if (options.body) {
      try {
        console.log('Request payload:', JSON.parse(options.body as string));
      } catch (e) {
        console.log('Request payload:', options.body);
      }
    }
  }

  try {
    const response = await fetch(url, options);

    // Log the response status
    if (process.env.NODE_ENV === 'development') {
      console.log(`📥 API Response: ${response.status} ${response.statusText} for ${url}`);
    }

    // Handle different response types
    let data;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Log the response data in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Response data:', data);
    }

    // If the response is not ok, format a user-friendly error message
    if (!response.ok) {
      let errorMessage = '';

      // Handle different error formats
      if (typeof data === 'object') {
        if (data.message) {
          errorMessage = data.message;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.non_field_errors) {
          errorMessage = Array.isArray(data.non_field_errors)
            ? data.non_field_errors.join(', ')
            : data.non_field_errors;
        } else {
          // Try to extract field-specific errors
          const fieldErrors = Object.entries(data)
            .filter(([key]) => !['status', 'statusText', 'url'].includes(key))
            .map(([field, errors]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(', ')}`;
              } else if (typeof errors === 'string') {
                return `${field}: ${errors}`;
              }
              return null;
            })
            .filter(Boolean);

          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('; ');
          } else {
            errorMessage = 'An error occurred. Please try again.';
          }
        }
      } else if (typeof data === 'string' && data.trim()) {
        errorMessage = data;
      } else {
        // Default error messages based on status code and URL
        // Check if this is a PIN verification endpoint
        if (url.includes('/check-pin')) {
          errorMessage = 'Incorrect PIN. Please try again.';
        } else {
          switch (response.status) {
            case 400:
              errorMessage = 'Invalid request. Please check your input.';
              break;
            case 401:
              errorMessage = 'Authentication required. Please log in again.';
              break;
            case 403:
              errorMessage = 'You do not have permission to perform this action.';
              break;
            case 404:
              errorMessage = 'The requested resource was not found.';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            default:
              errorMessage = `Error (${response.status}): ${response.statusText || 'Unknown error'}`;
          }
        }
      }

      const error = new Error(errorMessage);

      // Attach the response and data to the error for debugging
      (error as any).response = response;
      (error as any).data = data;
      (error as any).status = response.status;

      throw error;
    }

    return { data, response };
  } catch (error) {
    // Log the error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error);
    }
    throw error;
  }
};

/**
 * Get the current API environment information
 *
 * @returns Object with API environment information
 */
export const getApiEnvironment = () => {
  return {
    baseUrl: API_BASE_URL,
    isLocal: API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1'),
    isDevelopment: process.env.NODE_ENV === 'development',
  };
};
