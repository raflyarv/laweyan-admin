'use client';

import { Box, Typography } from '@mui/material';
import React from 'react';

interface DaySchedule {
  day: string;
  openHour: string;
  closeHour: string;
}

export default function ScheduleDisplay({ schedule }: { schedule: string | undefined }) {
  // Initialize an array with all days of the week
  const allDaysOfWeek: DaySchedule[] = [
    { day: 'Senin', openHour: 'Tutup', closeHour: 'Tutup' },
    { day: 'Selasa', openHour: 'Tutup', closeHour: 'Tutup' },
    { day: 'Rabu', openHour: 'Tutup', closeHour: 'Tutup' },
    { day: 'Kamis', openHour: 'Tutup', closeHour: 'Tutup' },
    { day: 'Jumat', openHour: 'Tutup', closeHour: 'Tutup' },
    { day: 'Sabtu', openHour: 'Tutup', closeHour: 'Tutup' },
    { day: 'Minggu', openHour: 'Tutup', closeHour: 'Tutup' },
  ];

  if (schedule) {
    // Split by comma to separate different days
    const days = schedule.split(', ');

    // Process each day's schedule
    days.forEach((daySchedule) => {
      const parts = daySchedule.split(' ');

      if (parts.length >= 3) {
        const day = parts[0];
        const openHour = parts[1];
        const closeHour = parts.slice(3).join(' '); // Join the rest for close hour

        // Update the respective day's hours in the allDaysOfWeek array
        const dayObject = allDaysOfWeek.find((d) => d.day === day);
        if (dayObject) {
          dayObject.openHour = openHour;
          dayObject.closeHour = closeHour;
        }
      }
    });
  } else {
    console.log('Schedule is undefined or empty');
  }

  return (
    <>
      {allDaysOfWeek.map(({ day, openHour, closeHour }) => (
        <Box
          key={day}
          sx={{
            width: '100%',
            display: 'flex',
          }}
        >
          <Typography
            sx={{
              width: '50%',
            }}
            variant="body1"
          >
            {day}
          </Typography>
          <Typography
            sx={{
              width: '50%',
            }}
            variant="body1"
          >
            {openHour} - {closeHour}
          </Typography>
        </Box>
      ))}
    </>
  );
}
