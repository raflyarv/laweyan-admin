/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { getIn } from 'formik';
import React, { useState } from 'react';

interface TextInputProps {
  type: string;
  name: string;
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  value: any;
  error: any;
  touched: any;
  rowCount?: number;
}

export default function TextInput({
  type,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  rowCount,
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
    <>
      {type === 'password' ? (
        <FormControl
          fullWidth
          margin="normal"
          error={getIn(touched, name) && !!getIn(error, name)}
        >
          <InputLabel color="warning"> {label} </InputLabel>
          <OutlinedInput
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              // Digunakan untuk menempatkan sebuah icon pada text field
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            name={name}
            label={label}
            defaultValue={value}
            onChange={onChange}
            onBlur={onBlur}
            sx={{
              width: '100%',
              borderRadius: '10px',

              input: {
                color: getIn(touched, name) && getIn(error, name) ? 'danger.main' : 'text.primary',
              },
            }}
          />
          {getIn(touched, name) && getIn(error, name) ? (
            <FormHelperText sx={{ marginLeft: 0 }}> {getIn(error, name)} </FormHelperText>
          ) : (
            <></>
          )}
        </FormControl>
      ) : type === 'multiline' ? (
        <FormControl
          fullWidth
          error={getIn(touched, name) && !!getIn(error, name)}
          margin="normal"
        >
          <InputLabel color="warning"> {label} </InputLabel>
          <OutlinedInput
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            sx={{
              width: '100%',
              borderRadius: '10px',
            }}
            multiline
            rows={rowCount}
          />
          {getIn(touched, name) && getIn(error, name) ? (
            <FormHelperText sx={{ marginLeft: 0 }}> {getIn(error, name)} </FormHelperText>
          ) : (
            <></>
          )}
        </FormControl>
      ) : (
        <FormControl
          fullWidth
          error={getIn(touched, name) && !!getIn(error, name)}
          margin="normal"
        >
          <InputLabel color="warning"> {label} </InputLabel>
          <OutlinedInput
            name={name}
            label={label}
            value={value}
            type={type}
            onChange={onChange}
            onBlur={onBlur}
            sx={{
              width: '100%',
              borderRadius: '10px',
            }}
          />
          {getIn(touched, name) && getIn(error, name) ? (
            <FormHelperText sx={{ marginLeft: 0 }}> {getIn(error, name)} </FormHelperText>
          ) : (
            <></>
          )}
        </FormControl>
      )}
    </>
  );
}
