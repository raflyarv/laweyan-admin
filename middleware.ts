/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import jwt from 'jsonwebtoken';

// Utility function to parse cookies from the request
function parseCookies(req: NextRequest) {
  const cookieString = req.headers.get('cookie');
  if (!cookieString) return {};
  return Object.fromEntries(cookieString.split('; ').map((cookie) => cookie.split('=')));
}

export async function middleware(req: NextRequest) {
  const cookies = parseCookies(req);
  const refreshToken = cookies.refreshToken; // Get the refresh token from cookies
  const role = cookies.role;

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isOwnerRoute = req.nextUrl.pathname.startsWith('/owner');
  const isRoot = req.nextUrl.pathname === '/';
  const isLoginPage = req.nextUrl.pathname === '/login';
  const path = req.nextUrl.pathname;

  // If no refreshToken is found in cookies, redirect to login
  if ((!refreshToken && isAdminRoute) || (!refreshToken && isOwnerRoute)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Get the admin role from environment variables
  const adminRole = process.env.ADMIN_ROLE;
  const ownerRole = process.env.OWNER_ROLE;

  const isProfileRoute = /^\/(admin|owner)\/profile$/.test(path); // Adjust based on your roles

  // Ensure that adminRole and ownerRole are defined
  if (!adminRole || !ownerRole) {
    throw new Error('Required environment variables (ADMIN_ROLE/OWNER_ROLE) are not set');
  }

  if (!refreshToken && isRoot) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isLoginPage && refreshToken) {
    if (role === adminRole) {
      return NextResponse.redirect(new URL('/admin', req.url));
    } else if (role === ownerRole) {
      return NextResponse.redirect(new URL('/owner', req.url));
    }
  }

  if (isRoot && refreshToken) {
    if (role === adminRole) {
      return NextResponse.redirect(new URL('/admin', req.url));
    } else if (role === ownerRole) {
      return NextResponse.redirect(new URL('/owner', req.url));
    }
  }

  try {
    if (refreshToken) {
      const response = await axios.get('http://localhost:5000/api/admin', {
        withCredentials: true,
        headers: {
          Cookie: req.headers.get('cookie') || '',
        },
      });

      const { addressTemp, siteNameTemp } = response.data;
      const isRegistered = addressTemp && siteNameTemp;

      if (isRegistered && path === '/owner/my-sites/create-new') {
        return NextResponse.next();
      }

      if (isRegistered) {
        return NextResponse.redirect(new URL('/owner/my-sites/create-new', req.url));
      }
    }
  } catch (error: any) {
    console.error('Error checking registration status:', error);

    if (error.response?.status === 401) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.redirect(new URL('/error', req.url));
  }

  // Check if the user has access to the admin route
  if (isAdminRoute) {
    if (role === ownerRole) {
      return NextResponse.redirect(new URL('/owner', req.url));
    }

    if (role === adminRole && path === '/admin') {
      return; // No redirect needed
    }
  }

  // Check if the user is trying to access the owner route
  if (isOwnerRoute) {
    if (role === adminRole) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    if (role === ownerRole && path === '/owner') {
      return; // No redirect needed
    }
  }

  return NextResponse.next(); // Allow the request to proceed
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/', '/login', '/admin/:path*', '/owner/:path*'], // Middleware applies to admin and owner routes
};
