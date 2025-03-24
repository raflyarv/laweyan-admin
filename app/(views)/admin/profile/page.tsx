/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import { ChangeEvent, useState, useEffect } from 'react';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useAdmin } from '@/app/_hooks/provider/AdminProvider';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ConfirmationModal = dynamic(() => import('@/app/_components/ConfirmationModal'), {
  ssr: false,
});
const PopupModal = dynamic(() => import('@/app/_components/PopupModal'), { ssr: false });
const ProfileImgPicker = dynamic(() => import('@/app/_components/ProfileImgPicker'), {
  ssr: false,
});
const TextInput = dynamic(() => import('@/app/_components/TextInput'), { ssr: false });

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png'];

const formSchema = z
  .object({
    username: z.string({ required_error: 'Username Harus Diisi' }),
    fullName: z.string({ required_error: 'Nama Lengkap Harus Diisi' }),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
    newProfileImage: z
      .instanceof(File)
      .nullable()
      .refine((file) => file === null || SUPPORTED_FORMATS.includes(file?.type), {
        message: 'Tipe file tidak didukung.',
      })
      .refine((file) => file === null || file.size <= 5 * 1024 * 1024, {
        message: 'Ukuran gambar terlalu besar (max. 5MB)',
      }),
    existingProfileImage: z.string().nullable(),
  })
  .superRefine((values, ctx) => {
    const { oldPassword, newPassword, confirmNewPassword } = values;

    // Check if at least one password field is filled
    const isAnyPasswordFilled = [oldPassword, newPassword, confirmNewPassword].some(
      (pwd) => pwd !== undefined && pwd !== '',
    );

    if (isAnyPasswordFilled) {
      // All password fields must be filled
      if (!oldPassword || !newPassword || !confirmNewPassword) {
        ctx.addIssue({
          path: ['oldPassword'], // you can change this to another field if needed
          message: 'Semua kata sandi harus diisi jika salah satu diisi',
          code: 'custom',
        });
      }

      // Check if password and confirmPassword match
      if (newPassword !== confirmNewPassword) {
        ctx.addIssue({
          path: ['confirmNewPassword'],
          message: 'Kata sandi harus sama',
          code: 'custom',
        });
      }
    }
  });

type registerFormType = z.infer<typeof formSchema>;

const initialValues: registerFormType = {
  username: '',
  fullName: '',
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
  newProfileImage: null as File | null,
  existingProfileImage: '',
};

export default function OwnerProfile() {
  const router = useRouter();
  const { admin, refetch } = useAdmin(); // Get admin data from context

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState<string | null>(null);

  const [resPopUpOpen, setResPopUpOpen] = useState<boolean>(false);
  const [resTitle, setResTitle] = useState<string>('');
  const [resDescription, setResDescription] = useState<string>('');

  // If succeed, please use this state to redirect
  const [resRedirect, setResRedirect] = useState<string | undefined>(undefined);

  const handleClose = () => {
    setResPopUpOpen(false);
  };
  const onSubmit = async (values: registerFormType) => {
    setFormData(values);
    setIsModalOpen(true);
  };

  const handleAPIEdit = async (data: any) => {
    // Send the request
    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append('username', data.username);
      formData.append('fullName', data.fullName);
      formData.append('existingProfileImage', data.existingProfileImage);
      formData.append('profileImage', data.newProfileImage);
      formData.append('oldPassword', data.oldPassword);
      formData.append('newPassword', data.confirmNewPassword);

      const response = await axios.put('http://localhost:5000/api/admin/edit', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data', // Important: Set the correct content type
        },
      });

      if (response.status === 200) {
        setResPopUpOpen(true);
        setResTitle('Perubahan berhasil dibuat.');
        setResDescription('');
        refetch();
      }
    } catch (error: any) {
      console.error('Error updating admin:', error.status);
      if (error.status === 400) {
        setResPopUpOpen(true);
        setResTitle('Username sudah terdaftar. Silahkan coba lagi.');
        setResDescription('');
      } else if (error.status === 401) {
        setResPopUpOpen(true);
        setResTitle('Kata sandi lama salah. Silahkan coba lagi.');
        setResDescription('');
      } else {
        setResPopUpOpen(true);
        setResTitle('Terjadi kesalahan. Silahkan coba lagi.');
        setResDescription('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const { handleChange, handleBlur, handleSubmit, errors, touched, values, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema: toFormikValidationSchema(formSchema),
      onSubmit,
    });

  useEffect(() => {
    if (admin) {
      setFieldValue('username', admin.username);
      setFieldValue('fullName', admin.fullName);

      if (admin.profileImage) {
        setFieldValue('existingProfileImage', admin.profileImage); // Set existing image
        setPreview(`http://localhost:5000/${admin.profileImage}`); // Display existing image preview
      } else {
        setFieldValue('existingProfileImage', null); // No existing image
        setPreview(null); // No preview
      }
    }
  }, [admin, setFieldValue]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      setFieldValue('newProfileImage', file); // Set new image
      setFieldValue('existingProfileImage', null); // Clear existing image when a new one is uploaded

      // Set preview for new image
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      // If no file selected, clear the fields
      setFieldValue('newProfileImage', null);
      setPreview(null); // Reset preview
    }
  };

  const handleDeleteImage = () => {
    setFieldValue('newProfileImage', null); // Clear new image field
    setFieldValue('existingProfileImage', null); // Clear existing image field
    setPreview(null); // Reset preview
  };

  return (
    <>
      <Backdrop
        open={isLoading}
        sx={{ zIndex: 100 }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Backdrop>
      <Container maxWidth="lg">
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
            marginBottom={2}
          >
            <IconButton
              aria-label="delete"
              size="large"
              onClick={() => router.back()}
            >
              <ArrowBack
                fontSize="inherit"
                sx={{
                  color: 'text.primary',
                }}
              />
            </IconButton>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                columnGap: 1,
              }}
            >
              <Typography variant="h5">Profil Saya</Typography>
            </Box>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginBottom: 2 }}>
              <ProfileImgPicker
                name="profileImage"
                error={errors}
                setPreview={setPreview}
                preview={preview}
                handleImageChange={handleImageChange}
                handleImageDelete={handleDeleteImage}
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
            </Box>

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                marginBottom: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  columnGap: 1,
                }}
              >
                <Typography variant="h6">Ubah Kata Sandi</Typography>
              </Box>

              <TextInput
                type="password"
                name="oldPassword"
                label="Kata Sandi Lama"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors}
                touched={touched}
                value={values.oldPassword}
              />

              <TextInput
                type="password"
                name="newPassword"
                label="Kata Sandi Baru"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors}
                touched={touched}
                value={values.newPassword}
              />

              <TextInput
                type="password"
                name="confirmNewPassword"
                label="Konfirmasi Kata Sandi Baru"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors}
                touched={touched}
                value={values.confirmNewPassword}
              />
            </Box>

            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <Button
                sx={{ width: 'auto', alignSelf: 'end', backgroundColor: 'brand.main' }}
                variant="contained"
                type="submit"
              >
                Simpan Perubahan
              </Button>
            </Box>

            <ConfirmationModal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={() => handleAPIEdit(formData)}
              title="Ingin Melakukan Perubahan Data?"
              description=""
            />

            <PopupModal
              open={resPopUpOpen}
              onClose={handleClose}
              title={resTitle}
              description={resDescription}
              redirectPath={resRedirect}
            />
          </form>
        </Box>
      </Container>
    </>
  );
}
