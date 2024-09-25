'use client';
import { NavBar } from '../_components';

export default function ViewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <div
          style={{
            position: 'relative',
            marginTop: 100,
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
