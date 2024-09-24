import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import Image from 'next/image';

interface HoverableImagePreviewProps {
  src: string;
  alt: string;
  imageCount: number;
}

export default function ImagePreview({ src, alt, imageCount }: HoverableImagePreviewProps) {
  const [isHovered, setIsHover] = useState(false);

  return (
    <Box
      sx={{
        position: 'relative',
        width: 140,
        height: 140,
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        objectFit="cover"
      />

      {isHovered && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
            color: 'white',
            transition: 'opacity 0.3s ease-in-out', // Smooth transition
          }}
        >
          <Typography variant="body1">{imageCount} </Typography>
          <Typography variant="body2">Gambar </Typography>
        </Box>
      )}
    </Box>
  );
}
