/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ChevronRight } from '@mui/icons-material';
import { Badge, Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

interface HomeCardIInterface {
  icon: React.ReactNode;
  path: string;
  name: string;
  itemCount?: any;
}

export default function HomeCard({ icon, path, name, itemCount }: HomeCardIInterface) {
  const router = useRouter();
  return (
    <Box
      onClick={() => router.push(path)}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {itemCount ? (
        <Badge
          color="success"
          badgeContent={itemCount}
          sx={{
            '& .MuiBadge-badge': { fontSize: 16, minHeight: 40, minWidth: 50, borderRadius: 100 },
          }}
        >
          <Box
            display={'flex'}
            textAlign={'center'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            width={300}
            height={240}
            boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;'}
            borderRadius={5}
          >
            <Box
              width={'auto'}
              component={'section'}
              alignItems={'center'}
              justifyContent={'center'}
              flexDirection={'column'}
              display={'flex'}
              marginBottom={1}
              paddingX={2}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '70px',
                  marginBottom: '16px',
                  color: 'brand.main',
                }}
              >
                {icon}
              </Box>
              <Typography
                variant="h4"
                fontWeight={600}
                sx={{
                  color: 'text.primary',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                }}
              >
                {name}
              </Typography>
            </Box>

            <Box
              width={'auto'}
              component={'section'}
              alignItems={'center'}
              justifyContent={'center'}
              flexDirection={'row'}
              display={'flex'}
              sx={{
                color: 'text.primary',
              }}
            >
              <Typography variant="body1">Selengkapnya</Typography>
              <ChevronRight
                sx={{
                  color: 'text.primary',
                }}
              />
            </Box>
          </Box>
        </Badge>
      ) : (
        <Box
          display={'flex'}
          textAlign={'center'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          width={300}
          height={240}
          boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;'}
          borderRadius={5}
        >
          <Box
            width={'auto'}
            component={'section'}
            alignItems={'center'}
            justifyContent={'center'}
            flexDirection={'column'}
            display={'flex'}
            marginBottom={1}
            paddingX={2}
          >
            <Box
              sx={{
                width: '100%',
                height: '70px',
                marginBottom: '16px',
                color: 'brand.main',
              }}
            >
              {icon}
            </Box>
            <Typography
              variant="h4"
              fontWeight={600}
              sx={{
                color: 'text.primary',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
              }}
            >
              {name}
            </Typography>
          </Box>

          <Box
            width={'auto'}
            component={'section'}
            alignItems={'center'}
            justifyContent={'center'}
            flexDirection={'row'}
            display={'flex'}
            sx={{
              color: 'text.primary',
            }}
          >
            <Typography variant="body1">Selengkapnya</Typography>
            <ChevronRight
              sx={{
                color: 'text.primary',
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
