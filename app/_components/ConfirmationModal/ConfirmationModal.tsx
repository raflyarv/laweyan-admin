'use client';

import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void; // The action that will be executed when the "Confirm" button is clicked
}

export default function ConfirmationModal({
  open,
  onClose,
  title,
  description,
  onConfirm,
}: ConfirmationModalProps) {
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
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
        >
          {title}
        </Typography>
        <Typography sx={{ mt: 2 }}>{description}</Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ mr: 2 }}
          >
            Batalkan
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onConfirm(); // Executes the confirm action
              onClose(); // Closes the modal
            }}
          >
            Lanjutkan
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
