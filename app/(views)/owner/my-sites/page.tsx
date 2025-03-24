/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { ArrowBack, Explore, FilterAltOutlined, Search, Sort } from '@mui/icons-material';
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
import { useRouter } from 'next/navigation';
import React from 'react';
import { useAdmin } from '@/app/_hooks/provider/AdminProvider';
import dynamic from 'next/dynamic';
import { Add } from '@mui/icons-material';

const SiteListCard = dynamic(() => import('@/app/_components/SiteListCard'), { ssr: false });

export default function SiteList() {
  // State for Sort Menu
  const [sortAnchorEl, setSortAnchorEl] = React.useState<null | HTMLElement>(null);
  const sortOpen = Boolean(sortAnchorEl);

  const { push } = useRouter();

  // State for Filter Menu
  const [filterAnchorEl, setFilterAnchorEl] = React.useState<null | HTMLElement>(null);
  const filterOpen = Boolean(filterAnchorEl);

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

  const { back } = useRouter();
  const { sitesByOwner } = useAdmin();

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
            <Typography> {sitesByOwner?.length} Data Ditemukan </Typography>
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
          alignItems: 'space-between',
          justifyContent: 'space-between',
          marginBottom: 2,
        }}
      >
        <Box
          sx={{
            width: 'auto',
            display: 'flex',
          }}
        >
          <Button
            variant="outlined"
            aria-haspopup="true"
            onClick={() => push('my-sites/create-new')}
            sx={{
              color: 'brand.main',
              borderColor: 'brand.main',
              paddingY: 1,
              minWidth: '120px',
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
        {/* Sort Button and Menu */}
        <Box
          sx={{
            width: 'auto',
            display: 'flex',
            justifyContent: 'end',
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
            <MenuItem>Sort by Name</MenuItem>
            <MenuItem>Sort by Date</MenuItem>
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
            <MenuItem>Filter by Name</MenuItem>
            <MenuItem>Filter by Date</MenuItem>
          </Menu>
        </Box>
      </Box>

      <Box
        display={'flex'}
        flexDirection={'column'}
        width={'auto'}
        maxWidth={'100%'}
      >
        <List sx={{ width: '100%' }}>
          {sitesByOwner?.map((site, index) => {
            return (
              <SiteListCard
                key={index}
                thumbnail={site.images}
                id={`${site.id}`}
                name={site.siteName}
                address={site.address}
                createdBy={site.createdBy?.fullName || ''}
                latestUpdate={site.updatedAt}
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
