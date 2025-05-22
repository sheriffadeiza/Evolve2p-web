// utils/errorHandler.ts

/**
 * Extract a user-friendly error message from various error formats
 * @param error The error object or string
 * @returns A user-friendly error message
 */
export const extractErrorMessage = (error: unknown): string => {
  // Handle string errors
  if (typeof error === 'string') {
    return getUserFriendlyMessage(error);
  }

  // Handle Error objects
  if (error instanceof Error) {
    return getUserFriendlyMessage(error.message);
  }

  // Handle object errors
  if (typeof error === 'object' && error !== null) {
    const errObj = error as Record<string, any>;

    // Handle common error object formats
    if (typeof errObj.message === 'string') {
      return getUserFriendlyMessage(errObj.message);
    }

    if (typeof errObj.message === 'object') {
      return getUserFriendlyMessage(JSON.stringify(errObj.message));
    }

    if (typeof errObj.error === 'string') {
      return getUserFriendlyMessage(errObj.error);
    }

    if (typeof errObj.detail === 'string') {
      return getUserFriendlyMessage(errObj.detail);
    }

    // Handle Django field errors
    if (errObj.non_field_errors && Array.isArray(errObj.non_field_errors)) {
      return errObj.non_field_errors.join(', ');
    }

    // Try to extract field-specific errors
    const fieldErrors = Object.entries(errObj)
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
      return fieldErrors.join('; ');
    }

    // Last resort: stringify the object
    return getUserFriendlyMessage(JSON.stringify(errObj));
  }

  return 'An unknown error occurred. Please try again later.';
};

/**
 * Convert technical error messages to user-friendly ones
 * @param message The technical error message
 * @returns A user-friendly error message
 */
function getUserFriendlyMessage(message: string): string {
  // Database errors
  if (message.includes('no such table') || message.includes('table') && message.includes('not exist')) {
    return 'The service is temporarily unavailable. Please try again later.';
  }

  // Authentication errors
  if (message.includes('invalid credentials') || message.includes('Invalid credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }

  if (message.includes('token') && (message.includes('invalid') || message.includes('expired'))) {
    return 'Your session has expired. Please log in again.';
  }

  // Validation errors
  if (message.includes('is_valid()') || message.includes('validation error')) {
    return 'There was a problem with your request. Please try again.';
  }

  // Network errors
  if (message.includes('NetworkError') || message.includes('Failed to fetch')) {
    return 'Network error. Please check your internet connection and try again.';
  }

  // Server errors
  if (message.includes('500') || message.includes('Internal Server Error')) {
    return 'The server encountered an error. Please try again later.';
  }

  // Return the original message if no specific handling is needed
  return message;
}
