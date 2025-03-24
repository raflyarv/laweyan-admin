/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect } from 'react';
import { Box, Grid2, IconButton, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { getIn } from 'formik';

// Define ImageType for existing images
interface ImageType {
  _id: string; // Example property
  title: string; // Example property
  url: string; // Example property
}

interface ImageUploadFormProps {
  existingImages?: ImageType[]; // Existing images as an array of objects
  newImages: File[]; // New images as an array of File instances
  setFieldValue: (field: string, value: any) => void;
  touched?: any;
  errors?: any;
}

export default function ImageUploadForm({
  existingImages = [],
  newImages,
  setFieldValue,
  errors,
  touched,
}: ImageUploadFormProps) {
  // Destructure dropzone functionality
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      const totalImages = existingImages.length + newImages.length + acceptedFiles.length;
      if (totalImages > 5) {
        return; // Prevent exceeding 5 images
      }
      setFieldValue('newImages', [...newImages, ...acceptedFiles]);
    },
  });

  // Delete an image (for both new and existing images)
  const handleDeleteImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      const newExistingImages = [...existingImages];
      newExistingImages.splice(index, 1);
      console.log(newExistingImages);
      setFieldValue('existingImages', newExistingImages);
    } else {
      const newNewImages = [...newImages];
      newNewImages.splice(index, 1);
      setFieldValue('newImages', newNewImages);
    }
  };

  // Get image URL depending on whether it's an existing or new image
  const getImageUrl = (image: File | ImageType): string => {
    if ('url' in image) {
      return `http://localhost:5000/${image.url}`; // Existing image
    } else {
      return URL.createObjectURL(image); // New image
    }
  };

  // Clean up URL object when images change
  useEffect(() => {
    return () => {
      newImages.forEach((image) => {
        if (image instanceof File) {
          URL.revokeObjectURL(getImageUrl(image));
        }
      });
    };
  }, [newImages]);

  return (
    <Box>
      <Grid2
        container
        spacing={2}
        sx={{ mb: 1 }}
      >
        {/* Render existing images */}
        {existingImages.map((image, index) => (
          <Box
            key={`existing-${index}`}
            sx={{ position: 'relative', width: 250, height: 300 }}
          >
            <Image
              src={getImageUrl(image)}
              alt={image.title}
              style={{ objectFit: 'cover', borderRadius: '4px' }}
              fill
              unoptimized
            />
            <IconButton
              aria-label="delete"
              sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'white' }}
              onClick={() => handleDeleteImage(index, true)} // Delete existing image
            >
              <DeleteIcon sx={{ color: 'danger.main' }} />
            </IconButton>
          </Box>
        ))}

        {/* Render new images */}
        {newImages.map((file, index) => (
          <Box
            key={`new-${index}`}
            sx={{ position: 'relative', width: 250, height: 300 }}
          >
            <Image
              src={getImageUrl(file)}
              alt={`new-image-${index}`}
              style={{ objectFit: 'cover', borderRadius: '4px' }}
              fill
              unoptimized
            />
            <IconButton
              aria-label="delete"
              sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'white' }}
              onClick={() => handleDeleteImage(index, false)} // Delete new image
            >
              <DeleteIcon sx={{ color: 'danger.main' }} />
            </IconButton>
          </Box>
        ))}

        {/* Upload more images if the total is less than 5 */}
        {existingImages.length + newImages.length < 5 && (
          <Box>
            <Box
              {...getRootProps()}
              sx={{
                border:
                  getIn(touched, 'images') && getIn(errors, 'images')
                    ? '2px dashed red'
                    : '2px dashed gray',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 250,
                height: 300,
                cursor: 'pointer',
              }}
            >
              <input {...getInputProps()} />
              <Typography
                variant="h4"
                sx={{ color: 'brand.main' }}
              >
                +
              </Typography>
            </Box>
          </Box>
        )}
      </Grid2>

      {/* Error message */}
      {getIn(touched, 'images') && getIn(errors, 'images') ? (
        <Typography
          sx={{ marginLeft: 0, color: 'danger.main' }}
          variant="caption"
        >
          {getIn(errors, 'images')}
        </Typography>
      ) : null}
    </Box>
  );
}
