/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { FieldArray, Field, ErrorMessage, getIn } from 'formik';
import { useFormikContext } from 'formik';
import { Box, TextField, Button, Typography, IconButton } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { createSiteFormType } from '@/app/_validators/siteSchema';

// Define the props for the component
interface OperationalHourInputProps {
  error: any;
  touched: any;
}

const parseOperationalHours = (input: string) => {
  const days = input.split(', '); // Split the input into day schedules

  return days.map((daySchedule) => {
    // Use map to create an array of objects
    const parts = daySchedule.split(' ');

    if (parts.length >= 3) {
      const day = parts[0]; // Get the day
      const openHour = parts[1]; // Get the open hour
      const closeHour = parts.slice(3).join(' '); // Join the rest for close hour

      return { day, openHour, closeHour }; // Return an object with day, openHour, and closeHour
    } else {
      return { day: parts[0], openHour: undefined, closeHour: undefined }; // or whatever fallback you prefer
    }
  });
};

export default function OperationalHourInput({ error, touched }: OperationalHourInputProps) {
  const { values, setFieldValue } = useFormikContext<any>();

  const getNextDay = () => {
    const usedDays = Array.isArray(values.operationalHours)
      ? values.operationalHours.map((item: any) => item.day)
      : [];
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    return days.find((day) => !usedDays.includes(day));
  };

  return (
    <>
      <Box
        sx={{
          mb: 2,
          width: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            width: '20%',
          }}
        ></Box>
        <Box
          sx={{
            width: '50%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{ color: 'brand.main' }}
          >
            Jam Buka
          </Typography>
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{ color: 'brand.main' }}
          >
            Jam Tutup
          </Typography>
        </Box>

        <Box
          sx={{
            width: '20%',
          }}
        ></Box>
      </Box>

      <FieldArray
        name="operationalHours"
        render={(arrayHelpers) => (
          <Box
            sx={{
              width: '90%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {Array.isArray(values.operationalHours) &&
              values.operationalHours.map((operationalHour: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    width: '90%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;',
                    borderRadius: 3,
                    paddingY: 2,
                    paddingX: 2,
                  }}
                >
                  <Box sx={{ width: '10%' }}>
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{
                        color: 'brand.main',
                      }}
                    >
                      {values.operationalHours[index]?.day}
                    </Typography>
                  </Box>
                  <Box>
                    <Field
                      name={`operationalHours.${index}.openHour`}
                      as={TextField}
                      label=""
                      type="time"
                      value={operationalHour.openHour || ''}
                      onChange={(event: any) => {
                        const newOpenHour = event.target.value;
                        setFieldValue(`operationalHours.${index}.openHour`, newOpenHour);
                      }}
                      sx={{ mr: 2 }}
                    />
                    <Field
                      name={`operationalHours.${index}.closeHour`}
                      as={TextField}
                      label=""
                      type="time"
                      value={operationalHour.closeHour || ''}
                      onChange={(event: any) => {
                        const newCloseHour = event.target.value;
                        setFieldValue(`operationalHours.${index}.closeHour`, newCloseHour);
                      }}
                    />

                    {getIn(touched, `operationalHours.${index}.openHour`) ||
                      (getIn(error, `operationalHours.${index}.closeHour`) && (
                        <Typography
                          color="error"
                          sx={{ marginLeft: 2 }}
                        >
                          {getIn(error, `operationalHours.${index}.openHour`)}
                        </Typography>
                      ))}
                  </Box>
                  <IconButton
                    onClick={() => {
                      arrayHelpers.remove(index); // Remove the day and its hours
                    }}
                  >
                    <RemoveCircle sx={{ color: 'error.dark' }} />
                  </IconButton>
                </Box>
              ))}

            {/* Add Button */}
            <Button
              variant="outlined"
              startIcon={<AddCircle />}
              sx={{ mt: 2, width: '100%' }}
              onClick={() => {
                const nextDay = getNextDay();
                if (nextDay) {
                  arrayHelpers.push({
                    day: nextDay,
                    openHour: '',
                    closeHour: '',
                  });
                }
              }}
              disabled={!getNextDay()} // Disable if all days are added
            >
              Tambah Jam Operasional
            </Button>
          </Box>
        )}
      />
    </>
  );
}
