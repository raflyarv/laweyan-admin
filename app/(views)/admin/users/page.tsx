/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  ArrowBack,
  Delete,
  Edit,
  Explore,
  FilterAltOutlined,
  Search,
  Sort,
  AccountCircle,
  Add,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
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
import React, { useEffect, useState } from 'react';

import useFetchUsers from '@/app/_hooks/api/users/useFetchUsers';
import dynamic from 'next/dynamic';

const ProfileCard = dynamic(() => import('@/app/_components/ProfileCard'), {
  ssr: false,
});

export default function UserList() {
  // State for Sort Menu
  const [searchQuery, setSearchQuery] = useState('');

  const [sortAnchorEl, setSortAnchorEl] = React.useState<null | HTMLElement>(null);
  const sortOpen = Boolean(sortAnchorEl);

  const [sortOption, setSortOption] = useState('date'); // Default sorting by date

  // State for Filter Menu
  const [filterAnchorEl, setFilterAnchorEl] = React.useState<null | HTMLElement>(null);
  const filterOpen = Boolean(filterAnchorEl);

  const [filterOption, setFilterOption] = useState('all');

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
  const { userLists } = useFetchUsers();

  const filteredAndSortedUsers = (userLists || [])
    ?.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterOption === 'all' || user.status === filterOption;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOption === 'name') {
        return a.fullName.localeCompare(b.fullName);
      } else if (sortOption === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Descending by date
      }
      return 0;
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
          <AccountCircle
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
              Pengguna{' '}
            </Typography>
            <Typography> {userLists?.length} Data Ditemukan </Typography>
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
                <IconButton
                  onClick={() => alert('Bisa diklik')}
                  edge="end"
                >
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
            justifyContent: 'end',
          }}
        >
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
              <MenuItem onClick={() => setFilterOption('all')}>Reset Filter</MenuItem>
              <MenuItem onClick={() => setFilterOption('active')}>
                Filter by Account Status: Active
              </MenuItem>
              <MenuItem onClick={() => setFilterOption('inactive')}>
                Filter by Account Status: Inactive
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      <Box
        display={'flex'}
        flexDirection={'column'}
        width={'100%'}
      >
        <List
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            rowGap: 3,
          }}
        >
          {filteredAndSortedUsers.map((user, index) => {
            return (
              <ProfileCard
                key={`user-${index}`}
                id={user._id}
                fullName={user.fullName}
                email={user.email}
                imgSrc={user.profileImage}
                status={`${user.status}`}
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
