/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { SiteListCard } from '@/app/_components';
import {
  ArrowBack,
  Delete,
  Edit,
  Explore,
  Filter,
  FilterAlt,
  FilterAltOutlined,
  Search,
  Sort,
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
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
  Pagination,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function SiteList() {
  // State for Sort Menu
  const [sortAnchorEl, setSortAnchorEl] = React.useState<null | HTMLElement>(null);
  const sortOpen = Boolean(sortAnchorEl);

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
              Tempat Wisata{' '}
            </Typography>
            <Typography> 101 Data Ditemukan </Typography>
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
            marginX: 'auto',
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
        marginX={'auto'}
      >
        <List sx={{ width: '100%' }}>
          <SiteListCard
            id="1"
            name="Rumah Batik Laweyan"
            address="Jl. Sidoluhur No.21, Laweyan, Kec. Laweyan, Kota Surakarta, Jawa Tengah 5714"
            createdBy="Muhammad Tohir Rafly"
            latestUpdate={'12 September 2024 19.00'}
          />

          <SiteListCard
            id="2"
            name="Rumah Batik Laweyan"
            address="Jl. Sidoluhur No.21, Laweyan, Kec. Laweyan, Kota Surakarta, Jawa Tengah 5714"
            createdBy="Muhammad Tohir Rafly"
            latestUpdate={'12 September 2024 19.00'}
          />

          <SiteListCard
            id="3"
            name="Rumah Batik Laweyan"
            address="Jl. Sidoluhur No.21, Laweyan, Kec. Laweyan, Kota Surakarta, Jawa Tengah 5714"
            createdBy="Muhammad Tohir Rafly"
            latestUpdate={'12 September 2024 19.00'}
          />

          <SiteListCard
            id="4"
            name="Rumah Batik Laweyan"
            address="Jl. Sidoluhur No.21, Laweyan, Kec. Laweyan, Kota Surakarta, Jawa Tengah 5714"
            createdBy="Muhammad Tohir Rafly"
            latestUpdate={'12 September 2024 19.00'}
          />
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
