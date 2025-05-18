// utils/errorHandler.ts
export const extractErrorMessage = (error: unknown): string => {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
  
    if (typeof error === 'object' && error !== null) {
      const errObj = error as Record<string, any>;
      if (typeof errObj.message === 'string') return errObj.message;
      if (typeof errObj.message === 'object') return JSON.stringify(errObj.message);
      if (typeof errObj.error === 'string') return errObj.error;
      return JSON.stringify(errObj);
    }
  
    return 'An unknown error occurred';
  };
  