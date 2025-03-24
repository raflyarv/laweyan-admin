'use client';

import React from 'react';
import { Modal, Box, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon?: React.ReactNode; // Optional icon
  redirectPath?: string; // Optional path to redirect after closing
}

export default function PopupModal({
  open,
  onClose,
  title,
  description,
  icon,
  redirectPath,
}: ModalProps) {
  const router = useRouter(); // Initialize the router

  const handleClose = () => {
    if (redirectPath) {
      router.push(redirectPath); // Redirect to the specified path
    }
    onClose(); // Call the onClose function
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
            <Typography
              variant="h6"
              fontWeight={600}
            >
              {title}
            </Typography>
          </div>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Typography
          variant="body1"
          sx={{ mb: 3 }}
        >
          {description}
        </Typography>
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            width: 120,
            alignSelf: 'flex-end',
            backgroundColor: 'brand.main',
          }}
        >
          Lanjutkan
        </Button>
      </Box>
    </Modal>
  );
}
