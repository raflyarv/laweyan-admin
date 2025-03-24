/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Circle, Edit, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Avatar, Typography, IconButton, Rating } from '@mui/material';
import { ConfirmationModal } from '@/app/_components';
import { useState } from 'react';

interface ReviewCardProps {
  id: string;
  locationId: string;
  userName: string;
  imagePath: string;
  reviewCount: number;
  rating: number;
  datetime: string;
  reviewDescription: string;
  visitDate: string;
  isHidden: boolean; // Added to manage visibility
  onToggleVisibility: (id: string, isHidden: boolean) => void; // Function to handle visibility toggle
  onDeleteReview: (id: string) => void; // Added this line to pass delete handler
}

export default function SiteReviewCard({
  id,
  locationId,
  userName,
  imagePath,
  reviewCount,
  rating,
  datetime,
  reviewDescription,
  visitDate,
  isHidden,
  onDeleteReview,
  onToggleVisibility, // Destructure the prop
}: ReviewCardProps) {
  // State for managing the visibility locally (optional, if not using onToggleVisibility directly)

  const [visible, setVisible] = useState(isHidden); // Initialize based on isHidden

  const handleToggleVisibility = () => {
    const newVisibilityStatus = !visible; // Toggle the visibility state
    console.log(`new status: ${newVisibilityStatus}`);

    onToggleVisibility(id, newVisibilityStatus); // Call the function passed from the parent with new status
    setVisible(newVisibilityStatus); // Update local state
  };

  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

  const handleDeleteClick = () => {
    setIsModalVisible(true); // Show modal on delete icon click
  };

  const handleConfirmDelete = () => {
    onDeleteReview(id); // Call delete handler on modal confirmation
    setIsModalVisible(false); // Close modal after confirmation
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Close modal on cancel or close action
  };

  return (
    <>
      <Box
        boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;'}
        borderRadius={5}
        padding={2}
        sx={{
          width: '500px',
          height: 'max-content',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
          gap={2}
        >
          <Avatar
            alt={userName}
            src={imagePath}
            sx={{
              width: '54px',
              height: '54px',
            }}
          />
          <Box
            sx={{
              width: '80%',
              display: 'flex',
              flexDirection: 'column',
            }}
            marginBottom={1}
          >
            <Typography
              variant="body1"
              fontWeight={600}
            >
              {userName}
            </Typography>
            <Typography variant="body2"> {reviewCount} Ulasan </Typography>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              gap={1}
            >
              <Box
                sx={{
                  width: 'auto',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Rating
                  name="read-only"
                  value={rating}
                  readOnly
                />
              </Box>

              <Circle
                sx={{
                  width: '10px',
                  height: '10px',
                  color: 'disable.main',
                }}
              />
              <Box>
                <Typography variant="body1"> {datetime} </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              width: '20%',
              height: 'auto',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <IconButton
              aria-label="edit"
              size="large"
              onClick={handleToggleVisibility}
            >
              {!visible ? (
                <Visibility sx={{ color: 'green' }} />
              ) : (
                <VisibilityOff sx={{ color: 'red' }} />
              )}
            </IconButton>
            <IconButton
              aria-label="delete"
              size="large"
              onClick={handleDeleteClick}
            >
              <Delete
                sx={{
                  color: 'danger.main',
                }}
              />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            whiteSpace: 'wrap',
          }}
          gap={1}
          marginBottom={1}
        >
          <Typography
            variant="body1"
            sx={{
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 4,
            }}
          >
            {visible ? (
              <Typography
                variant="body1"
                color="gray"
              >
                This review is hidden.
              </Typography>
            ) : (
              <Typography
                variant="body1"
                sx={{
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 4,
                }}
              >
                {reviewDescription}
              </Typography>
            )}
          </Typography>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
          }}
          gap={2}
        >
          <Typography
            variant="body1"
            fontWeight={600}
          >
            Tanggal Berkunjung :
          </Typography>
          <Typography variant="body1"> {visitDate} </Typography>
        </Box>
      </Box>
      <ConfirmationModal
        open={isModalVisible}
        onClose={handleModalClose}
        onConfirm={handleConfirmDelete}
        title=""
        description="Apakah Anda yakin ingin menghapus ulasan ini? Tindakan ini tidak dapat dibatalkan."
      />
    </>
  );
}
