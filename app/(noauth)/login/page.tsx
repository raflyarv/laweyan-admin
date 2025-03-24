/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
// import Image from "next/image";
// import styles from "./page.module.css";
import {
  Box,
  Typography,
  Button,
  Container,
  Link,
  Backdrop,
  CircularProgress,
} from '@mui/material';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

// Dynamic import of TextInput component with SSR disabled
const TextInput = dynamic(() => import('@/app/_components/TextInput'), { ssr: false });

const formSchema = z.object({
  username: z.string({ required_error: 'Username Harus Diisi' }),
  password: z.string({ required_error: 'Password Harus Diisi' }),
});

type loginFormType = z.infer<typeof formSchema>;

const initialValues: loginFormType = {
  username: '',
  password: '',
};

interface LoginResponse {
  role: 'admin' | 'owner' | 'user'; // Adjust roles as per your backend structure
  accessToken: string; // If your backend provides access token
  refreshToken: string; // If refresh token is provided
  // Add other fields that you expect from the login response
}

export default function Login() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (values: loginFormType) => {
    setIsLoading(true);
    try {
      const data = await axios.post<LoginResponse>(
        'http://localhost:5000/auth/admin/login',
        values,
        {
          withCredentials: true,
        },
      );

      if (data.data.role === 'admin') {
        router.push('/admin');
      } else if (data.data.role === 'owner') {
        router.push('/owner');
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      console.log(err.status);
    } finally {
      setIsLoading(false);
    }
  };

  const { handleChange, handleBlur, handleSubmit, errors, touched, values } = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(formSchema),
    onSubmit,
  });

  return (
    <>
      <Backdrop
        open={isLoading}
        sx={{
          zIndex: 100,
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Backdrop>
      <Container
        maxWidth={'lg'}
        sx={{
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          width={'70%'}
          height={'auto'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{
            boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;',
            borderRadius: 5,
            marginY: 'auto',
            paddingX: 10,
            paddingY: 10,
          }}
        >
          <Box
            width={'55%'}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={3}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{
                color: 'brand.main',
              }}
            >
              LOGIN
            </Typography>
            <form
              onSubmit={handleSubmit}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}
            >
              <TextInput
                type="text"
                name="username"
                label="Username"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors}
                touched={touched}
                value={values.username}
              />

              <TextInput
                type="password"
                name="password"
                label="Password"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors}
                touched={touched}
                value={values.password}
              />

              <Button
                sx={{
                  width: 100,
                  marginTop: 2,
                  backgroundColor: 'brand.main',
                }}
                variant="contained"
                type="submit"
              >
                Masuk
              </Button>
            </form>

            <Link
              href="/register"
              sx={{
                color: 'brand.main',
                alignSelf: 'end',
              }}
            >
              <Typography
                sx={{
                  textDecoration: 'underline',
                }}
              >
                Registrasi Akun Di sini
              </Typography>
            </Link>
          </Box>
          <Box
            sx={{
              width: '40%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src={'/image/logo-laweyan.jpg'}
              width={200}
              height={200}
              alt="Logo Utama"
              style={{
                objectFit: 'cover',
                borderRadius: '100%',
              }}
            />
            <Typography variant="h3"> Laweyan </Typography>
            <Typography variant="h5"> Web Admin </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
}
