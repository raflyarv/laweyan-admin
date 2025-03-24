/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Badge, Box, Button, Container, Grid2, Typography } from '@mui/material';
import { Explore, ChevronRight, Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/app/_hooks/provider/AdminProvider';
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

export default function Home() {
  const { admin, sitesByOwner } = useAdmin();
  const router = useRouter();

  console.log(sitesByOwner?.length);

  return (
    <Container
      maxWidth="lg"
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
          paddingY: { xs: 5, md: 0 },
          marginY: 'auto',
          marginX: 'auto',
        }}
        rowGap={5}
        columnGap={5}
      >
        <Box
          width={'auto'}
          display={'flex'}
          flexDirection={'column'}
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
          name="Toko Batik Saya"
          path="/owner/my-sites"
          itemCount={sitesByOwner?.length || 0}
        />

        <HomeCard
          icon={<Add sx={{ width: '100%', height: '100%' }} />}
          name="Tambah Toko"
          path="/owner/my-sites/create-new"
        />
      </Grid2>
    </Container>
  );
}
