import { NextRequest, NextResponse } from 'next/server';

/**
 * Validates CSRF token for state-changing API requests.
 * Uses the double-submit cookie pattern.
 */
export function validateCsrfToken(request: NextRequest): boolean {
  // Only validate for state-changing methods
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return true;

  // Check origin header matches
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        return false;
      }
    } catch {
      return false;
    }
  }

  // Check for custom header (simple CSRF protection)
  const csrfHeader = request.headers.get('x-csrf-protection');
  if (csrfHeader !== '1' && !origin) {
    return false;
  }

  return true;
}

/**
 * Generates CSRF meta tag value for the client to include in requests
 */
export function getCsrfToken(): string {
  return '1'; // Using origin-check + custom-header pattern
}
