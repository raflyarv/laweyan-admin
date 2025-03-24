import 'next-auth';

declare module 'next-auth' {
  interface Session {
    admin?: {
      role?: string; // Adjust properties as needed
    };
  }
}
