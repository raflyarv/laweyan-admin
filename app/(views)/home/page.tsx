/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Badge, Box, Container, Grid2, Typography } from '@mui/material';
import { Explore, ChevronRight } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { HomeCard } from '@/app/_components';

export default function Home() {
  const router = useRouter();

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '90vh',
      }}
    >
      <Grid2
        container
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: { xs: 'auto', md: '800px' },
          paddingY: { xs: 5, md: 0 },
          marginY: 'auto',
        }}
        rowGap={5}
      >
        <Box
          width={'100%'}
          display={'flex'}
          flexDirection={'column'}
        >
          <Typography
            variant="h5"
            fontWeight={600}
          >
            {' '}
            Selamat Pagi, Muhammad Tohir Rafly !{' '}
          </Typography>
          <Typography variant="h6"> Apa yang Ingin Anda Lakukan Hari Ini? </Typography>
        </Box>

        <HomeCard
          icon={<Explore sx={{ width: '100%', height: '100%' }} />}
          name="Tempat Wisata"
          path="/site-list"
          itemCount={10}
        />
      </Grid2>
    </Container>
  );
}
