'use client';

import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface NavBarProps {
  name?: string;
  imageUrl?: string;
  userType: 'admin' | 'owner'; // Prop to determine user type
}

export default function NavBar({ imageUrl, name, userType }: NavBarProps) {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const router = useRouter();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleProfileClick = () => {
    // Redirect to the correct profile page based on userType
    if (userType === 'admin') {
      router.push('/admin/profile');
    } else if (userType === 'owner') {
      router.push('/owner/profile');
    }
    handleCloseUserMenu();
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
    handleCloseUserMenu();
  };

  const handleConfirmLogout = async () => {
    setOpenLogoutDialog(false);
    try {
      await axios.post('http://localhost:5000/auth/admin/logout', {}, { withCredentials: true });
      console.log('Logged out');

      router.push('/login');
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancelLogout = () => {
    setOpenLogoutDialog(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'brand.main',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              justifyContent: 'space-between',
            }}
          >
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href={`/${userType}`}
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LAWEYAN WEB ADMIN
            </Typography>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0 }}
                >
                  <Avatar
                    alt={name}
                    src={`http://localhost:5000/${imageUrl}`}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleProfileClick}>
                  <Typography sx={{ textAlign: 'center' }}>Profil Saya</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogoutClick}>
                  <Typography sx={{ textAlign: 'center' }}>Keluar</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Logout Confirmation Modal */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleCancelLogout}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Konfirmasi Keluar</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Apakah Anda yakin ingin keluar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelLogout}
            color="primary"
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirmLogout}
            color="primary"
            autoFocus
          >
            Keluar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
