/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Add, ArrowBack, Explore, FilterAltOutlined, Search, Sort } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
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
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import useFetchSites from '@/app/_hooks/api/sites/useFetchSites';
import dynamic from 'next/dynamic';

const SiteListCard = dynamic(() => import('@/app/_components/SiteListCard'), { ssr: false });

export default function SiteList() {
  const { back, push } = useRouter();
  const { siteLists } = useFetchSites();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('date'); // Default sorting by date
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const [sortAnchorEl, setSortAnchorEl] = useState<HTMLElement | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);

  const sortOpen = Boolean(sortAnchorEl);
  const filterOpen = Boolean(filterAnchorEl);

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setSortAnchorEl(event.currentTarget);
  const handleSortClose = () => setSortAnchorEl(null);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setFilterAnchorEl(event.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);

  // Sort and filter logic
  const filteredAndSortedSites = (siteLists || [])
    ?.filter((site) => {
      // Filter by search
      const matchesSearch =
        site.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.createdBy?.fullName.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by role
      const matchesRole = roleFilter ? site.createdBy?.role === roleFilter : true;

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      // Sort logic based on selected option
      if (sortOption === 'name') {
        return a.siteName.localeCompare(b.siteName);
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
          <Explore
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
              Toko/Tempat Wisata Batik{' '}
            </Typography>
            <Typography> {siteLists?.length} Data Ditemukan </Typography>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            endAdornment={
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
              onClick={() => push('sites/create-new')}
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
            {/* Sort Button */}
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
                Urutkan
              </Typography>
            </Button>

            {/* Sort Menu */}
            <Menu
              id="sort-menu"
              anchorEl={sortAnchorEl}
              open={sortOpen}
              onClose={handleSortClose}
            >
              <MenuItem onClick={() => setSortOption('name')}>Sort by Name</MenuItem>
              <MenuItem onClick={() => setSortOption('date')}>Sort by Date</MenuItem>
            </Menu>

            {/* Filter Button */}
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
                Filter
              </Typography>
            </Button>

            {/* Filter Menu */}
            <Menu
              id="filter-menu"
              anchorEl={filterAnchorEl}
              open={filterOpen}
              onClose={handleFilterClose}
            >
              <MenuItem onClick={() => setRoleFilter(null)}>Filter by All Roles</MenuItem>
              <MenuItem onClick={() => setRoleFilter('admin')}>Filter by Admin</MenuItem>
              <MenuItem onClick={() => setRoleFilter('owner')}>Filter by Owner</MenuItem>
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
        {/* List of Sites */}
        <List sx={{ width: '100%' }}>
          {filteredAndSortedSites.map((site, index) => (
            <SiteListCard
              key={index}
              thumbnail={site.images}
              id={`${site.id}`}
              name={site.siteName}
              address={site.address}
              createdBy={site.createdBy?.fullName || ''}
              latestUpdate={site.updatedAt}
            />
          ))}
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
