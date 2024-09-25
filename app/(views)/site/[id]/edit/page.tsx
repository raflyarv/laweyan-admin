'use client';
import { ArrowBack } from '@mui/icons-material';
import { Box, Container, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function EditSite({ params }: { params: { id: string } }) {
  const { push, back } = useRouter();

  return (
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
      <Typography> Edit untuk - {params.id} </Typography>
    </Container>
  );
}
