'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
// import Link from 'next/link'; // For client-side navigation

import Image from 'next/image'; // Use next/image for optimized loading

// Define the props for the custom component
interface ContactItemProps {
  type: 'Instagram' | 'Whatsapp' | 'Facebook' | 'Website';
  name: string;
  detail: string;
}

// Map the image paths to their respective types
const iconMap = {
  Instagram: '/contacts/instagram-logo.png',
  Whatsapp: '/contacts/whatsapp-logo.png',
  Facebook: '/contacts/facebook-logo.png',
  Website: '/contacts/website-logo.png',
};

// Map the URLs for different types
const urlMap = {
  Instagram: (detail: string) => `https://instagram.com/${detail.replace('@', '')}`,
  Whatsapp: (detail: string) => `https://api.whatsapp.com/send/?phone=${detail}`,
  Facebook: (detail: string) => `https://facebook.com/${detail}`,
  Website: (detail: string) => `${detail}`,
};

export default function ContactItems({ type, name, detail }: ContactItemProps) {
  const handleContactPress = () => {
    const url = urlMap[type](detail); // Get the appropriate URL based on type
    window.open(url, '_blank'); // Open the URL in a new tab
  };

  return (
    <Button
      onClick={handleContactPress}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        textAlign: 'left',
        padding: '8px',
        marginBottom: '8px',
        textTransform: 'none', // Remove uppercase from button text
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginRight: '12px',
        }}
      >
        {/* Load static images from the public folder */}
        <Image
          src={iconMap[type]} // Dynamically choose the image based on contact type
          alt={`${type} icon`}
          width={32}
          height={32} // Set appropriate width and height for icons
        />
      </Box>
      <Box>
        <Typography
          variant="body1"
          sx={{ fontWeight: 'bold', color: 'text.primary' }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ textDecoration: 'underline', color: 'disable.contrastText' }}
        >
          {detail}
        </Typography>
      </Box>
    </Button>
  );
}
