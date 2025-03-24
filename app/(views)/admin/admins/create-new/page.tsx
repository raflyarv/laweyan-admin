/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ArrowBack } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

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
    siteNameTemp: z.string({ required_error: 'Nama Toko/Tempat Wisata Harus Diisi' }).optional(),
    addressTemp: z
      .string({ required_error: 'Alamat Toko/Tempat Wisata Harus Diisi' })
      .optional()
      .refine((input) => {
        if (!input) return true;
        const validDistrict = ['Laweyan', 'Kelurahan Laweyan'];
        const validPostcodes = ['57148'];

        const hadValidDistrict = validDistrict.some((district) => input.includes(district));
        const hasValidPostcode = validPostcodes.some((postcode) => input.includes(postcode));

        return hadValidDistrict || hasValidPostcode;
      }, 'Alamat yang Anda Masukkan Berada Di Luar Kelurahan Laweyan.'),
    status: z.string(),
    role: z.enum(['admin', 'owner']),
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

export default function CreateAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { back } = useRouter();

  const handleClose = () => {
    setIsOpen(false);
  };

  const onSubmit = async (values: registerFormType) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerValues } = values;
      const sendData = { ...registerValues, password: confirmPassword };

      await axios.post('http://localhost:5000/api/admin', sendData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
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
    const file = event.target.files?.[0] || null;
    if (file) {
      setFieldValue('profileImage', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFieldValue('profileImage', null);
      setPreview(null);
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
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          marginBottom={2}
        >
          <IconButton
            aria-label="delete"
            size="large"
            onClick={() => back()}
          >
            <ArrowBack
              fontSize="inherit"
              sx={{
                color: 'text.primary',
              }}
            />
          </IconButton>
        </Box>

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

            {/* Role Dropdown */}
            <FormControl
              fullWidth
              error={!!errors.role && touched.role}
              margin="normal"
            >
              <InputLabel
                id="role-label"
                sx={{ marginBottom: 1 }}
              >
                Peran
              </InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={values.role}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="owner">Owner</MenuItem>
              </Select>
              {errors.role && touched.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>

            {values.role === 'owner' && (
              <>
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
              </>
            )}

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
            redirectPath="/admins"
            title="Pembuatan Akun Berhasil!"
            description="Silahkan berikan akses kepada pengguna yang Anda telah buatkan akun."
          />
        </form>
      </Container>
    </>
  );
}
