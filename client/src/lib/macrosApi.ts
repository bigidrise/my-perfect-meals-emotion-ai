// Temporary stub for macrosApi
// This module provides API functions for logging macros

interface MacroEntry {
  date?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  mealType?: string;
}

export async function addBulkMacros(entries: MacroEntry[]): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/macros/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entries }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add bulk macros: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, ...data };
  } catch (error) {
    console.error('Error adding bulk macros:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function logMacrosToBiometrics(macros: MacroEntry): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/biometrics/macros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(macros),
    });

    if (!response.ok) {
      throw new Error(`Failed to log macros to biometrics: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, ...data };
  } catch (error) {
    console.error('Error logging macros to biometrics:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}
