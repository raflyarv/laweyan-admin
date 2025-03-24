/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Edit, Delete } from '@mui/icons-material';
import { Typography, ListItem, ListItemAvatar, ListItemText, IconButton } from '@mui/material';
import React from 'react';
import ImagePreview from './ImagePreview';
import { usePathname, useRouter } from 'next/navigation';
import { formattedTimestamp } from '@/app/_utils/formattedTimestamp';

interface SiteListProps {
  id: string;
  name: string;
  address: string;
  createdBy: string;
  latestUpdate: any;
  thumbnail: {
    url: string;
    title: string;
  }[];
}

export default function SiteListCard({
  id,
  name,
  address,
  createdBy,
  latestUpdate,
  thumbnail,
}: SiteListProps) {
  const { push } = useRouter();
  const pathname = usePathname();

  const firstSegment = pathname.split('/')[1]; // Get 'admin' or 'owner'

  const goToSiteDetail = (id: string) => {
    // Conditional navigation based on the first segment
    if (firstSegment === 'admin') {
      push(`site/${id}`); // Push to the admin site detail
    } else if (firstSegment === 'owner') {
      push(`my-site/${id}`); // Push to the owner site detail
    } else {
      console.log('Invalid role in URL');
    }
  };
  return (
    <>
      <ListItem
        alignItems="flex-start"
        sx={{
          boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;',
          borderRadius: 5,
          marginBottom: 2,
          cursor: 'pointer',
        }}
        onClick={() => goToSiteDetail(id)}
      >
        <ListItemAvatar
          sx={{
            marginRight: 3,
          }}
        >
          <ImagePreview
            src={`http://localhost:5000/${thumbnail[0].url}`}
            alt={name}
            imageCount={thumbnail.length}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <React.Fragment>
              <Typography
                component="span"
                variant="h5"
                sx={{
                  width: '100%',
                  maxHeight: '50px',
                  marginBottom: 1,
                  color: 'text.primary',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                }}
              >
                {name}
              </Typography>
            </React.Fragment>
          }
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body1"
                sx={{
                  width: '100%',
                  maxHeight: '55px',
                  marginBottom: 2,
                  color: 'text.primary',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                }}
              >
                {address}
              </Typography>

              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.primary', display: 'inline-block', width: '100%' }}
              >
                Dibuat oleh : {createdBy}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                sx={{ display: 'inline-block', color: 'text.primary', width: '100%' }}
              >
                Update terakhir : {formattedTimestamp(latestUpdate)}
              </Typography>
            </React.Fragment>
          }
          sx={{
            marginRight: 2,
          }}
        />

        <IconButton id={id}>
          <Edit />
        </IconButton>

        <IconButton id={id}>
          <Delete />
        </IconButton>
      </ListItem>
    </>
  );
}
