/**
 * Utility function for API calls with consistent error handling
 * Handles database connectivity issues (503) and other errors
 */
export async function apiFetch<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null; status: number }> {
  try {
    const response = await fetch(url, options)
    
    if (response.ok) {
      const data = await response.json()
      return { data, error: null, status: response.status }
    } else if (response.status === 503) {
      // Service unavailable - database connection issue
      const errorData = await response.json().catch(() => ({}))
      return {
        data: null,
        error: errorData.error || 'Database connection unavailable. Please try again later.',
        status: 503
      }
    } else if (response.status === 404) {
      return {
        data: null,
        error: 'Resource not found',
        status: 404
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      return {
        data: null,
        error: errorData.error || `Request failed with status ${response.status}`,
        status: response.status
      }
    }
  } catch (err) {
    console.error('API fetch error:', err)
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Network error occurred',
      status: 0
    }
  }
}

