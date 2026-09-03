/**
 * Placeholder authentication service for CashTwin.
 * This is currently a frontend-only implementation for UI demonstration.
 * In the future, this will connect to the FastAPI backend.
 */

export const login = async (email: string, password: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  // Return mock successful response without storing state
  return { success: true };
};

export const signup = async (data: any) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!data.email || !data.password) {
    throw new Error('Email and password are required');
  }
  
  // Return mock successful response without storing state
  return { success: true };
};

export const logout = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return { success: true };
};
