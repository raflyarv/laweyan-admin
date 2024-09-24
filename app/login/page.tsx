'use client';
// import Image from "next/image";
// import styles from "./page.module.css";
import {
  Box,
  Grid2,
  Typography,
  TextField,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

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
      <Box
        width={900}
        border={5}
        justifyContent={'center'}
        alignItems={'center'}
        marginX={'auto'}
        marginY={'auto'}
      >
        <Grid2
          container
          direction={'row'}
          paddingX={5}
          paddingY={10}
        >
          <Grid2
            container
            width={'50%'}
            direction={'column'}
            alignItems={'center'}
            spacing={3}
          >
            <Typography
              variant="h5"
              fontWeight={500}
            >
              Login
            </Typography>
            <Grid2
              container
              width={'100%'}
              flexDirection={'column'}
              alignItems={'flex-end'}
            >
              <TextField
                id="email"
                label="Email atau Username"
                type="email"
                helperText=""
                sx={{
                  width: '100%',
                }}
              />

              <FormControl
                sx={{ width: '100%' }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    // Digunakan untuk menempatkan sebuah icon pada text field
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>

              <Button
                sx={{
                  width: 100,
                }}
                variant="contained"
                onClick={() => router.push('/')}
              >
                Masuk
              </Button>
            </Grid2>
          </Grid2>

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
      </Box>
    </Grid2>
  );
}
