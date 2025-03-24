/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  ArrowBack,
  FilterAltOutlined,
  Search,
  Sort,
  AdminPanelSettings,
  Add,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Fade,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  Menu,
  MenuItem,
  OutlinedInput,
  Pagination,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import useFetchAdmins from '@/app/_hooks/api/admins/useFetchAdmins';
import dynamic from 'next/dynamic';

const ProfileCard = dynamic(() => import('@/app/_components/ProfileCard'), {
  ssr: false,
});

interface Admin {
  role: 'admin' | 'owner' | string; // Adjust as necessary
  fullName: string;
  createdAt: string;
}

export default function AdminList() {
  // State for Sort Menu
  const [sortAnchorEl, setSortAnchorEl] = React.useState<null | HTMLElement>(null);
  const sortOpen = Boolean(sortAnchorEl);

  const [searchQuery, setSearchQuery] = useState('');

  const [sortOption, setSortOption] = useState('date'); // Default sorting by date

  // State for Filter Menu
  const [filterAnchorEl, setFilterAnchorEl] = React.useState<null | HTMLElement>(null);
  const filterOpen = Boolean(filterAnchorEl);

  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Handle opening and closing Sort Menu
  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  // Handle opening and closing Filter Menu
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const { back, push } = useRouter();
  const { adminLists } = useFetchAdmins();

  const filteredAndSortedAdmins = (adminLists || [])
    ?.filter((admin) => {
      const matchesSearch =
        admin.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === 'all' || admin.status === filterStatus;
      const matchesRole = filterRole === 'all' || admin.role === filterRole;

      return matchesSearch && matchesStatus && matchesRole;
    })
    .sort((a: Admin, b: Admin) => {
      const rolePriority: { [key: string]: number } = { admin: 0, owner: 1 };
      const roleA = rolePriority[a.role] ?? Infinity; // Assign Infinity for undefined roles
      const roleB = rolePriority[b.role] ?? Infinity;

      if (roleA !== roleB) {
        return roleA - roleB; // Sort by role priority
      }

      // Secondary sorting: By name
      if (sortOption === 'name') {
        return a.fullName.localeCompare(b.fullName);
      }

      // Secondary sorting: By date
      if (sortOption === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      return 0; // Default return for no specific sort option
    });

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
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: '-webkit-sticky',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'start',
            marginBottom: 2,
          }}
        >
          <AdminPanelSettings
            sx={{
              width: '50px',
              height: '50px',
              marginRight: 2,
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="h4"
              fontWeight={600}
            >
              {' '}
              Admin & Owner{' '}
            </Typography>
            <Typography> {adminLists?.length} Data Ditemukan </Typography>
          </Box>
        </Box>

        <FormControl
          sx={{ width: '100%', marginBottom: 2 }}
          variant="outlined"
        >
          <InputLabel htmlFor="search-site">Pencarian</InputLabel>
          <OutlinedInput
            id="search-site"
            type="text"
            onChange={(e) => setSearchQuery(e.target.value)}
            endAdornment={
              // Digunakan untuk menempatkan sebuah icon pada text field
              <InputAdornment position="end">
                <IconButton edge="end">
                  <Search />
                </IconButton>
              </InputAdornment>
            }
            label="Pencarian"
          />
        </FormControl>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        {/* Sort Button and Menu */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Button
              variant="outlined"
              aria-haspopup="true"
              onClick={() => push('admins/create-new')}
              sx={{
                color: 'brand.main',
                borderColor: 'brand.main',
                paddingY: 1,
                minWidth: '120px',
                marginRight: 2,
              }}
              startIcon={<Add />}
            >
              <Typography
                variant="body1"
                fontWeight={500}
              >
                {' '}
                Tambah Baru{' '}
              </Typography>
            </Button>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <Button
              variant="contained"
              aria-controls={sortOpen ? 'sort-menu' : undefined}
              aria-haspopup="true"
              onClick={handleSortClick}
              sx={{
                color: 'white',
                backgroundColor: 'brand.main',
                paddingY: 1,
                minWidth: '120px',
                marginRight: 2,
              }}
              startIcon={<Sort />}
            >
              <Typography
                variant="body1"
                fontWeight={500}
              >
                {' '}
                Urutkan{' '}
              </Typography>
            </Button>

            <Menu
              id="sort-menu"
              anchorEl={sortAnchorEl}
              open={sortOpen}
              onClose={handleSortClose}
              TransitionComponent={Fade}
            >
              <MenuItem onClick={() => setSortOption('name')}>Sort by Name</MenuItem>
              <MenuItem onClick={() => setSortOption('date')}>Sort by Date</MenuItem>
            </Menu>

            <Button
              aria-controls={filterOpen ? 'filter-menu' : undefined}
              aria-haspopup="true"
              onClick={handleFilterClick}
              sx={{
                color: 'white',
                backgroundColor: 'brand.main',
                paddingY: 1,
                minWidth: '120px',
              }}
              startIcon={<FilterAltOutlined />}
            >
              <Typography
                variant="body1"
                fontWeight={500}
              >
                {' '}
                Filter{' '}
              </Typography>
            </Button>

            <Menu
              id="filter-menu"
              anchorEl={filterAnchorEl}
              open={filterOpen}
              onClose={handleFilterClose}
              TransitionComponent={Fade}
            >
              <MenuItem
                onClick={() => {
                  setFilterRole('all');
                  setFilterStatus('all');
                }}
              >
                Reset Filter
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setFilterRole('admin');
                  setFilterStatus('all');
                }}
              >
                Filter by Role: Admin
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setFilterRole('owner');
                  setFilterStatus('all');
                }}
              >
                Filter by Role: Owner
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setFilterStatus('active');
                  setFilterRole('all');
                }}
              >
                Filter by Status: Active
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setFilterStatus('inactive');
                  setFilterRole('all');
                }}
              >
                Filter by Status: Inactive
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      <Box
        display={'flex'}
        flexDirection={'column'}
        width={'auto'}
        maxWidth={'100%'}
        marginX={'auto'}
      >
        <List
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            rowGap: 5,
            columnGap: 5,
          }}
        >
          {filteredAndSortedAdmins.map((admin, index) => {
            return (
              <ProfileCard
                key={`admin-${index}`}
                id={admin._id}
                fullName={admin.fullName}
                email={admin.email}
                imgSrc={admin.profileImage}
                status={`${admin.status}`}
                role={admin.role}
              />
            );
          })}
        </List>

        <Pagination
          count={10}
          variant="outlined"
          shape="rounded"
          size="large"
          sx={{
            color: 'brand.main',
          }}
        />
      </Box>
    </Container>
  );
}
