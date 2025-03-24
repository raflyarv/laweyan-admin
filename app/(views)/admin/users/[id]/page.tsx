/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ArrowBack } from '@mui/icons-material';
import {
  Typography,
  Box,
  Container,
  Avatar,
  IconButton,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const PopupModal = dynamic(() => import('@/app/_components/PopupModal'), { ssr: false });

export default function UserDetails({ params }: { params: { id: string } }) {
  const [userData, setUserData] = useState<any>();
  const [status, setStatus] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { back, push } = useRouter();

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from your backend API
        const response = await axios.get(`http://localhost:5000/api/user/${params.id}`, {
          withCredentials: true,
        });
        setUserData(response.data);
        setStatus(response.data.status); // Initialize status state
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchUserData();
  }, [params.id]);

  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatus(event.target.value as string);
  };

  const saveStatus = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/user/edit/${params.id}`,
        { status },
        { withCredentials: true },
      );
      setUserData((prev: any) => ({ ...prev, status })); // Update local state
      setIsEditing(false); // Exit editing mode
    } catch (error: any) {
      console.log('Error updating status:', error);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
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
          aria-label="back"
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

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{
            width: '150px',
            height: '150px',
            marginBottom: 5,
          }}
          alt={userData?.fullName}
          src={`http://localhost:5000/${userData?.profileImage}`}
        />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}
        >
          <Box
            sx={{
              width: 'auto',
              height: 'auto',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                backgroundColor: 'brand.main',
                color: 'white',
                paddingX: 2,
                paddingY: 1,
                marginBottom: 1,
              }}
            >
              Nama lengkap:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                backgroundColor: 'brand.main',
                color: 'white',
                paddingX: 2,
                paddingY: 1,
                marginBottom: 1,
              }}
            >
              Username:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                backgroundColor: 'brand.main',
                color: 'white',
                paddingX: 2,
                paddingY: 1,
                marginBottom: 1,
              }}
            >
              Email:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                backgroundColor: 'brand.main',
                color: 'white',
                paddingX: 2,
                paddingY: 1,
                marginBottom: 1,
              }}
            >
              Email Terverifikasi:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                backgroundColor: 'brand.main',
                color: 'white',
                paddingX: 2,
                paddingY: 1,
              }}
            >
              Status Akun:
            </Typography>
          </Box>

          <Box
            sx={{
              width: 'auto',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                paddingY: 1,
                marginBottom: 1,
              }}
            >
              {userData?.fullName}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                paddingY: 1,
                marginBottom: 1,
              }}
            >
              {userData?.username}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                paddingY: 1,
                marginBottom: 1,
              }}
            >
              {userData?.email}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                paddingY: 1,
                marginBottom: 1,
                textTransform: 'capitalize',
              }}
            >
              {`${userData?.isVerified}`}
            </Typography>
            {isEditing ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  gap: 2,
                }}
              >
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="small"
                  sx={{
                    paddingX: 2,
                    paddingY: 1,
                    marginBottom: 1,
                    backgroundColor: 'white',
                  }}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
                <Button
                  variant="contained"
                  sx={{
                    paddingX: 2,
                    paddingY: 1,
                    backgroundColor: 'brand.main',
                    color: 'white',
                  }}
                  onClick={saveStatus}
                >
                  Simpan
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    paddingX: 2,
                    paddingY: 1,
                  }}
                  onClick={() => setIsEditing(false)}
                >
                  Batal
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    paddingY: 1,
                    textTransform: 'capitalize',
                  }}
                >
                  {status}
                </Typography>
                <Button
                  variant="text"
                  sx={{
                    color: 'white',
                    backgroundColor: 'brand.main',
                  }}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <PopupModal
        open={isOpen}
        onClose={handleClose}
        redirectPath={`/admin/users/${params.id}`}
        title="Berhasil Membuat Perubahan"
        description="Silahkan informasikan kepada pengguna bahwa Anda telah mengubah informasi akun miliknya."
      />
    </Container>
  );
}
