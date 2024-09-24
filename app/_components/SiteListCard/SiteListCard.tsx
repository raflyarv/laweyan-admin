import { Edit, Delete } from '@mui/icons-material';
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from '@mui/material';
import React from 'react';
import ImagePreview from './ImagePreview';

interface SiteListProps {
  id: string;
  name: string;
  address: string;
  createdBy: string;
  latestUpdate: any;
}

export default function SiteListCard({
  id,
  name,
  address,
  createdBy,
  latestUpdate,
}: SiteListProps) {
  return (
    <>
      <ListItem
        alignItems="flex-start"
        sx={{
          boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;',
          borderRadius: 5,
          marginBottom: 2,
        }}
      >
        <ListItemAvatar
          sx={{
            marginRight: 3,
          }}
        >
          <ImagePreview
            src="/image/sample-image.jpg"
            alt="Sample Image"
            imageCount={5}
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
                Update terakhir : {latestUpdate}
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
