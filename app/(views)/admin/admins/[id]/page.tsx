/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ArrowBack, Save } from '@mui/icons-material';
import {
  Typography,
  Box,
  Container,
  Avatar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const PopupModal = dynamic(() => import('@/app/_components/PopupModal'), { ssr: false });

export default function AdminDetails({ params }: { params: { id: string } }) {
  const [adminData, setAdminData] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [status, setStatus] = useState<string>('');
  const [role, setRole] = useState<string>('');

  const handleClose = () => {
    setIsOpen(false);
  };

  const { back } = useRouter();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/${params.id}`, {
          withCredentials: true,
        });
        setAdminData(response.data);
        setStatus(response.data?.status || '');
        setRole(response.data?.role || '');
      } catch (error: any) {
        console.error(error);
      }
    };

    fetchAdminData();
  }, [params.id]);

  // const handleSave = async () => {
  //   setIsLoading(true);

  //   try {
  //     await axios.put(
  //       `http://localhost:5000/api/admin/${params.id}`,
  //       { status, role },
  //       { withCredentials: true },
  //     );
  //     alert('Data updated successfully!');
  //   } catch (error: any) {
  //     console.error(error);
  //     alert('Failed to update data');
  //   } finally {
  //     setIsLoading(false);
  //     setIsOpen(true);
  //   }
  // };

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
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
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
            aria-label="back"
            size="large"
            onClick={() => back()}
          >
            <ArrowBack
              fontSize="inherit"
              sx={{ color: 'text.primary' }}
            />
          </IconButton>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{ width: '150px', height: '150px', marginBottom: 5 }}
            alt={adminData?.fullName}
            src={`http://localhost:5000/${adminData?.profileImage}`}
          />

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}
          >
            <Box sx={{ width: 'auto', height: 'auto', flexDirection: 'column' }}>
              <Typography
                variant="h6"
                sx={{ paddingX: 2, paddingY: 1 }}
              >
                Nama Lengkap:
              </Typography>
              <Typography
                variant="h6"
                sx={{ paddingX: 2, paddingY: 1 }}
              >
                Username:
              </Typography>
              <Typography
                variant="h6"
                sx={{ paddingX: 2, paddingY: 2 }}
              >
                Role:
              </Typography>
              <Typography
                variant="h6"
                sx={{ paddingX: 2, paddingY: 2 }}
              >
                Status Akun:
              </Typography>
            </Box>

            <Box sx={{ width: 'auto', flexDirection: 'column' }}>
              <Typography
                variant="h6"
                sx={{ paddingY: 1 }}
              >
                {adminData?.fullName}
              </Typography>
              <Typography
                variant="h6"
                sx={{ paddingY: 1 }}
              >
                {adminData?.username}
              </Typography>

              <Box>
                <FormControl sx={{ minWidth: 120, marginBottom: 1 }}>
                  <Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="owner">Owner</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <FormControl sx={{ minWidth: 120, marginBottom: 1 }}>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<Save />}
            sx={{ marginTop: 4, backgroundColor: 'brand.main', color: 'white' }}
            onClick={() => setIsOpen(true)}
          >
            Buat Perubahan
          </Button>

          <PopupModal
            open={isOpen}
            onClose={handleClose}
            redirectPath={`/admin/admins/${params.id}`}
            title="Berhasil Membuat Perubahan"
            description="Silahkan informasikan kepada pengguna bahwa Anda telah mengubah informasi akun miliknya."
          />
        </Box>
      </Container>
    </>
  );
}
