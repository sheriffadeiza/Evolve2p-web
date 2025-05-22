/**
 * API Configuration
 *
 * This file contains the configuration for the API endpoints.
 * It provides a centralized way to manage API URLs across environments.
 */

// Environment variables
const PRODUCTION_API_URL = 'https://evolve2p-backend.vercel.app';
const DEVELOPMENT_API_URL = 'http://127.0.0.1:8000';

// Determine which API URL to use based on environment variables
// NEXT_PUBLIC_USE_LOCAL_API=true will use the development URL
// Otherwise, it will use the production URL or the URL specified in NEXT_PUBLIC_API_URL
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_USE_LOCAL_API === 'true'
    ? DEVELOPMENT_API_URL
    : (process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL);

// Helper function to construct API endpoints
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: getApiUrl('api/auth/login/'),
  REGISTER: getApiUrl('api/users/register/'),
  SEND_OTP: getApiUrl('api/auth/send-otp/'),
  VERIFY_EMAIL: getApiUrl('api/auth/verify-email/'),
  FORGOT_PASSWORD: getApiUrl('api/auth/forgot-password/'),
  SET_PIN: getApiUrl('api/users/set-pin/'),
  SET_REGISTRATION_PIN: getApiUrl('api/users/set-registration-pin/'),
  CHECK_PIN: getApiUrl('api/users/check-pin/'),

  // Add more endpoints as needed
};

// Export environment information for debugging
export const API_ENV = {
  isLocal: process.env.NEXT_PUBLIC_USE_LOCAL_API === 'true',
  apiUrl: API_BASE_URL,
};
