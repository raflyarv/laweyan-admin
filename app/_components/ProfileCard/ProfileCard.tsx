'use client';

import { ListItem, Avatar, ListItemText, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ProfileCardProps {
  id: string;
  imgSrc: string;
  fullName: string;
  email: string;
  status: string;
  role?: string;
}

export default function ProfileCard({
  id,
  imgSrc,
  fullName,
  email,
  status,
  role,
}: ProfileCardProps) {
  const { push } = useRouter();
  return (
    <>
      <ListItem
        sx={{
          width: '250px',
          height: '300px',
          boxShadow:
            role && role === 'admin'
              ? 'rgba(184, 92, 56, 0.8) 0px 2px 8px 0px;'
              : 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;',
          borderRadius: 5,
          cursor: 'pointer',
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 3,
        }}
        onClick={() => push(role ? `admins/${id}` : `users/${id}`)}
      >
        {role && (
          <Typography
            variant="body1"
            sx={{
              top: 0,
              right: 0,
              position: 'absolute',
              paddingX: 2,
              paddingY: 1,
              backgroundColor: 'brand.main',
              color: 'white',
              textTransform: 'uppercase',
              alignSelf: 'flex-end',
              borderRadius: 2,
            }}
          >
            {role}
          </Typography>
        )}
        <Avatar
          sx={{
            width: '100px',
            height: '100px',
            position: 'relative',
            marginTop: role ? 4 : 0,
          }}
          sizes="large"
          alt={fullName}
          src={`http://localhost:5000/${imgSrc}`}
        />
        <ListItemText
          sx={{
            height: 'min-content',
            display: 'flex', // Enable flexbox on ListItemText
            flexDirection: 'column', // Column layout
            justifyContent: 'center', // Center the content vertically
            alignItems: 'center', // Center the content horizontally
          }}
          primary={
            <React.Fragment>
              <Typography
                component="span"
                variant="h5"
                sx={{
                  marginBottom: 1,
                  color: 'text.primary',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  textAlign: 'center',
                  textTransform: 'capitalize',
                }}
              >
                {fullName}
              </Typography>
            </React.Fragment>
          }
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body1"
                sx={{
                  marginBottom: 2,
                  color: 'text.primary',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2, // Specifies the number of lines
                  textAlign: 'center',
                  wordBreak: 'break-word', // Handles long words
                }}
              >
                {email}
              </Typography>

              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: 'text.primary',
                  display: 'inline-block',
                  width: '100%',
                  textAlign: 'center',
                  textTransform: 'capitalize',
                }}
              >
                Status : {status}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
    </>
  );
}
