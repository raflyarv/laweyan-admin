'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useFetchAdmins from '@/app/_hooks/api/admins/useFetchAdmins';
import useFetchSites from '@/app/_hooks/api/sites/useFetchSites';
import useFetchUsers from '@/app/_hooks/api/users/useFetchUsers';
import { useAdmin } from '@/app/_hooks/provider/AdminProvider';
import { Explore, AccountCircle, AdminPanelSettings, Assessment } from '@mui/icons-material';
import { Container, Grid2, Box, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

const HomeCard = dynamic(() => import('@/app/_components/HomeCard'), { ssr: false });

interface AdminProps {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
}

interface AdminPageProps {
  admin: AdminProps;
}

export default function AdminHome() {
  const { admin } = useAdmin();
  const { siteLists } = useFetchSites();
  const { adminLists } = useFetchAdmins();
  const { userLists } = useFetchUsers();

  console.log(siteLists);

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '80vh',
      }}
    >
      <Grid2
        container
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: { xs: '100%', md: '60%' },
          paddingY: { xs: 5, md: 0 },
          marginY: 'auto',
        }}
        rowGap={5}
        columnGap={5}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
          >
            {' '}
            Selamat Pagi, {admin?.fullName} !{' '}
          </Typography>
          <Typography variant="h6"> Apa yang Ingin Anda Lakukan Hari Ini? </Typography>
        </Box>

        <HomeCard
          icon={<Explore sx={{ width: '100%', height: '100%' }} />}
          name="Toko/Tempat Wisata Batik"
          path="/admin/sites"
          itemCount={siteLists?.length}
        />

        <HomeCard
          icon={<AdminPanelSettings sx={{ width: '100%', height: '100%' }} />}
          name="Admin & Owner"
          path="/admin/admins"
          itemCount={adminLists.length}
        />

        <HomeCard
          icon={<AccountCircle sx={{ width: '100%', height: '100%' }} />}
          name="Pengguna"
          path="/admin/users"
          itemCount={userLists?.length}
        />

        <HomeCard
          icon={<Assessment sx={{ width: '100%', height: '100%' }} />}
          name="Laporan Aplikasi"
          path="/admin/app-report"
        />
      </Grid2>
    </Container>
  );
}
