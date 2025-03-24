/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { ChangeEvent, ChangeEventHandler, Dispatch, SetStateAction, useState } from 'react';
import { Avatar, Box, Button, FormHelperText, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Camera, Cloud, CloudUpload, Delete } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getIn } from 'formik';

interface ProfileImgPicker {
  name: string;
  preview: string | null;
  handleImageChange: ChangeEventHandler<HTMLInputElement>;
  handleImageDelete: () => void;
  setPreview: Dispatch<SetStateAction<string | null>>;
  error: any;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ProfileImgPicker({
  name,
  preview,
  handleImageChange,
  handleImageDelete,
  setPreview,
  error,
}: ProfileImgPicker) {
  // Define types for the state

  return (
    <div style={{ textAlign: 'center', marginTop: '20px', position: 'relative', marginBottom: 3 }}>
      <Box sx={{ marginBottom: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar
          alt="Profile Picture"
          src={preview || '/icons/user.png'} // Use a default avatar if no preview
          sx={{ width: 120, height: 120, margin: '0 auto', position: 'relative' }}
        />

        {getIn(error, name) ? (
          <FormHelperText sx={{ marginLeft: 0, color: 'danger.main' }}>
            {' '}
            {getIn(error, name)}{' '}
          </FormHelperText>
        ) : (
          <></>
        )}

        {preview && (
          <IconButton
            color="error"
            aria-label="upload picture"
            onClick={() => {
              handleImageDelete();
              setPreview(null);
            }}
            sx={{
              top: 0,
              position: 'absolute',
              transform: 'translate(90%, -40%)',
              zIndex: 10,
              backgroundColor: 'white',
            }}
          >
            <Delete />
          </IconButton>
        )}
      </Box>
      <Button
        component="label"
        role={undefined}
        size="small"
        variant="contained"
        startIcon={<CloudUpload />}
        sx={{
          backgroundColor: 'brand.main',
          position: 'relative',
        }}
      >
        Unggah Gambar
        <VisuallyHiddenInput
          name={name}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </Button>
    </div>
  );
}
