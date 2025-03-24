/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Backdrop, Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import { ChangeEvent, useState } from 'react';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import dynamic from 'next/dynamic';

const TextInput = dynamic(() => import('@/app/_components/TextInput'), { ssr: false });
const PopupModal = dynamic(() => import('@/app/_components/PopupModal'), { ssr: false });
const ProfileImgPicker = dynamic(() => import('@/app/_components/ProfileImgPicker'), {
  ssr: false,
});

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png'];

const formSchema = z
  .object({
    username: z.string({ required_error: 'Username Harus Diisi' }),
    fullName: z.string({ required_error: 'Nama Lengkap Harus Diisi' }),
    siteNameTemp: z.string({ required_error: 'Nama Toko/Tempat Wisata Harus Diisi' }),
    addressTemp: z
      .string({ required_error: 'Alamat Toko/Tempat Wisata Harus Diisi' })
      .refine((input) => {
        const validDistrict = ['Laweyan', 'Kelurahan Laweyan'];
        const validPostcodes = ['57148'];

        const hadValidDistrict = validDistrict.some((district) => input.includes(district));
        const hasValidPostcode = validPostcodes.some((postcode) => {
          input.includes(postcode);
        });

        return hadValidDistrict || hasValidPostcode;
      }, 'Alamat yang Anda Masukkan Berada Di Luar Kelurahan Laweyan.'),
    status: z.string(),
    role: z.string(),
    password: z.string({ required_error: 'Kata sandi harus diisi.' }),
    confirmPassword: z.string({ required_error: 'Konfirmasi kata sandi harus diisi.' }),
    profileImage: z
      .instanceof(File)
      .nullable()
      .refine((file) => file === null || SUPPORTED_FORMATS.includes(file.type), {
        message: 'Tipe file tidak didukung.',
      })
      .refine((file) => file === null || file.size <= 5 * 1024 * 1024, {
        message: 'Ukuran gambar terlalu besar (max. 5MB)',
      }),
  })
  .superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: 'Kata sandi harus sama',
        code: 'custom',
      });
    }
  });

type registerFormType = z.infer<typeof formSchema>;

const initialValues: registerFormType = {
  username: '',
  fullName: '',
  addressTemp: '',
  siteNameTemp: '',

  status: 'active',
  role: 'owner',

  password: '',
  confirmPassword: '',
  profileImage: null as File | null,
};

export default function Register() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const onSubmit = async (values: registerFormType) => {
    setIsLoading(true);
    try {
      // const hashedPassword = await bcrypt.hash(values.confirmPassword, 10);
      const { password, confirmPassword, ...registerValues } = values;
      const sendData = { ...registerValues, password: confirmPassword };

      await axios.post('http://localhost:5000/api/admin', sendData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data', // Important: Set the correct content type
        },
      });
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
      setIsOpen(true);
    }
  };

  const { handleChange, handleBlur, handleSubmit, errors, touched, values, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema: toFormikValidationSchema(formSchema),
      onSubmit,
    });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null; // Handle null case
    if (file) {
      setFieldValue('profileImage', file); // Set the file value in Formik
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); // Set the preview
      };
      reader.readAsDataURL(file);

      console.log(values.profileImage);
    } else {
      setFieldValue('profileImage', null); // Clear the value if no file
      setPreview(null); // Clear the preview
    }
  };

  const handleImageDelete = () => {
    setPreview(null);
  };

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
      <Container maxWidth="lg">
        <Box
          sx={{
            width: '100%',
            marginTop: 3,
          }}
        >
          <Typography variant="h5"> Daftarkan Akunmu! </Typography>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                marginBottom: 2,
              }}
            >
              <ProfileImgPicker
                name="profileImage"
                error={errors}
                setPreview={setPreview}
                preview={preview}
                handleImageChange={handleImageChange}
                handleImageDelete={handleImageDelete}
              />

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
                type="text"
                name="fullName"
                label="Nama Lengkap"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors}
                touched={touched}
                value={values.fullName}
              />

              <TextInput
                type="text"
                name="siteNameTemp"
                label="Nama Toko/Tempat Wisata"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors}
                touched={touched}
                value={values.siteNameTemp}
              />

              <TextInput
                type="text"
                name="addressTemp"
                label="Alamat Toko/Tempat Wisata"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors}
                touched={touched}
                value={values.addressTemp}
              />

              <TextInput
                type="password"
                name="password"
                label="Kata Sandi"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors}
                touched={touched}
                value={values.password}
              />

              <TextInput
                type="password"
                name="confirmPassword"
                label="Konfirmasi Kata Sandi"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors}
                touched={touched}
                value={values.confirmPassword}
              />
            </Box>

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Button
                sx={{
                  width: 150,
                  alignSelf: 'end',
                  backgroundColor: 'brand.main',
                }}
                variant="contained"
                type="submit"
              >
                Buat Akun
              </Button>
            </Box>

            <PopupModal
              open={isOpen}
              onClose={handleClose}
              redirectPath="/login"
              title="Registrasi Akun Berhasil!"
              description="Silahkan login kembali dan lanjutkan pendaftaran toko/tempat wisata."
            />
          </form>
        </Box>
      </Container>
    </>
  );
}
