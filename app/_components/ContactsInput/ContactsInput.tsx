/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { FieldArray, getIn } from 'formik';
import {
  Box,
  MenuItem,
  Button,
  Typography,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
} from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import TextInput from '../TextInput';

// Define the props for the component
interface ContactInfoInputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  handleChange?: any;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  touched: any;
  error: any;
  values: any;
}

export default function ContactInfoInput({
  values,
  touched,
  error,
  onChange,
  onBlur,
  handleChange,
}: ContactInfoInputProps) {
  const contacts = ['Instagram', 'Facebook', 'Whatsapp', 'Website'];
  return (
    <Box>
      <FieldArray
        name="contacts"
        render={(arrayHelpers) => (
          <>
            {values.contacts.map((contact: any, i: any) => {
              const contactCounter = i + 1;
              return (
                <React.Fragment key={`contacts${i}`}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      mb: 2,
                      boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;',
                      borderRadius: 3,
                      paddingY: 2,
                      paddingX: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant="button"
                        fontWeight={600}
                        sx={{
                          paddingLeft: 2,
                        }}
                      >
                        Kontak {contactCounter}
                      </Typography>
                      <FormControl sx={{ minWidth: '80%' }}>
                        <InputLabel id="contact-type-input">Jenis Kontak</InputLabel>
                        <Select
                          labelId="contact-type-input"
                          id="contact-type-input"
                          name={`contacts.${i}.type`}
                          value={contact.type}
                          label="Jenis Kontak"
                          onChange={handleChange}
                          error={
                            getIn(touched, `contacts.${i}.type`) &&
                            getIn(error, `contacts.${i}.type`)
                          }
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {contacts.map((contact, index) => {
                            return (
                              <MenuItem
                                key={index}
                                value={contact}
                              >
                                {contact}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {getIn(touched, `contacts.${i}.type`) &&
                        getIn(error, `contacts.${i}.type`) ? (
                          <FormHelperText sx={{ marginLeft: 0, color: 'danger.main' }}>
                            {' '}
                            {getIn(error, `contacts.${i}.type`)}{' '}
                          </FormHelperText>
                        ) : (
                          <></>
                        )}
                      </FormControl>
                    </Box>

                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        columnGap: 2,
                      }}
                    >
                      <TextInput
                        type="text"
                        name={`contacts.${i}.contactName`}
                        label="Nama Kontak"
                        value={contact.contactName}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={error}
                        touched={touched}
                      />

                      <TextInput
                        type="text"
                        name={`contacts.${i}.detail`}
                        label="Detail Kontak"
                        value={contact.detail}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={error}
                        touched={touched}
                      />
                    </Box>
                  </Box>
                </React.Fragment>
              );
            })}
            <Button
              variant="outlined"
              startIcon={<AddCircle />}
              sx={{ mt: 2, width: '100%' }}
              onClick={() => {
                arrayHelpers.push({
                  type: '',
                  contactName: '',
                  detail: '',
                });
              }}
              //   disabled={!getNextDay()} // Disable if all days are added
            >
              Tambah Kontak
            </Button>
          </>
        )}
      />
    </Box>
  );
}
