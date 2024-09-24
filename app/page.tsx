/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
// import Image from "next/image";
// import styles from "./page.module.css";
import { Box, Grid2, Typography } from '@mui/material';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  // const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // const handleClickShowPassword = () => setShowPassword((show) => !show);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home'); // Replace '/target-page' with the desired route
    }, 3000); // Redirect after 3 seconds

    // Cleanup the timer if the component is unmounted before the timer ends
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Grid2
      container
      sx={{
        backgroundColor: 'beige',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 0,
      }}
    >
      <Grid2
        container
        width={'50%'}
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Image
          src={'/image/NEFELIBATA_LOGO.png'}
          width={200}
          height={200}
          alt="Logo Utama"
          objectFit="cover"
        />
        <Typography variant="h3"> Laweyan </Typography>
        <Typography variant="h5"> Web Admin </Typography>
      </Grid2>
    </Grid2>
  );
}

