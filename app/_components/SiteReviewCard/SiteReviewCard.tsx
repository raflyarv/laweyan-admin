/* eslint-disable @typescript-eslint/no-unused-vars */
import { Circle, Edit, Delete } from '@mui/icons-material';
import { Box, Avatar, Typography, IconButton, Rating } from '@mui/material';

interface ReviewCardProps {
  id: string;
  userName: string;
  imagePath: string;
  reviewCount: string;
  rating: number;
  datetime: string;
  reviewTitle: string;
  reviewDescription: string;
  visitDate: string;
}

export default function SiteReviewCard({
  id,
  userName,
  imagePath,
  reviewCount,
  rating,
  datetime,
  reviewTitle,
  reviewDescription,
  visitDate,
}: ReviewCardProps) {
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
          <Box
            sx={{
              width: '10%',
            }}
          >
            <Avatar
              alt={userName}
              src={imagePath}
              sx={{
                width: '54px',
                height: '54px',
              }}
            />
          </Box>

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
              width: 'auto',
              height: 'auto',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <IconButton
              aria-label="delete"
              size="large"
              onClick={() => alert(`Edit Ulasan: ${id}`)}
            >
              <Edit
                sx={{
                  color: 'primary.main',
                }}
              />
            </IconButton>
            <IconButton
              aria-label="delete"
              size="large"
              onClick={() => alert(`Hapus Ulasan: ${id}`)}
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
            fontWeight={600}
          >
            {reviewTitle}
          </Typography>
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
    </>
  );
}
