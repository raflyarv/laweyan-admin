/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Container, Typography, Box, TextField, Button, MenuItem, IconButton } from '@mui/material';
import useFetchLogUsers from '@/app/_hooks/api/users/useFetchLogUsers';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { jsPDF } from 'jspdf'; // Import jsPDF
import { ArrowBack, FileDownload } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/app/_hooks/provider/AdminProvider';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AppReport() {
  const { admin, refetch } = useAdmin(); // Get admin data from context

  const [startDate, setStartDate] = useState<string>('2024-10-01'); // Default to a manual date
  const [endDate, setEndDate] = useState<string>('2024-10-31'); // Default to a manual date
  const [activityName, setActivityName] = useState<string>('register');
  const { userLogs } = useFetchLogUsers(startDate, endDate, activityName);

  const [chartData, setChartData] = useState<any>(null);
  const [dynamicLabel, setDynamicLabel] = useState<string>('Activity'); // Store dynamicLabel here

  const { back } = useRouter();

  useEffect(() => {
    const processLogsForChart = () => {
      // Reset counts and data on every change
      const counts: Record<string, number> = {};

      // Loop through user logs to count activity occurrences
      userLogs.forEach((log) => {
        const date = log._id; // Use the date directly from the _id field
        counts[date] = log.count || 0; // Use the count field directly
      });

      const labels = Object.keys(counts).sort(); // Sort labels by date
      const data = labels.map((date) => counts[date]); // Map data to the counts

      // Check if there is no data to display
      if (labels.length === 0 || data.length === 0) {
        setChartData(null); // Set chartData to null to show the fallback message
        return;
      }

      // Mapping the selected activity to a human-readable label
      const activityLabels: Record<string, string> = {
        register: 'Pengguna Baru',
        login: 'Pengguna Login',
        logout: 'Pengguna Logout',
        'verify-email': 'Verifikasi Email',
        'reset-password-request': 'Permintaan Reset Password',
        'update-profile': 'Memperbarui Profil',
        'bookmark-tourism_site': 'Menyimpan Toko/Tempat Wisata',
        'review-tourism-site': 'Memberikan Ulasan pada Toko/Tempat Wisata',
      };

      const dynamicLabel = activityLabels[activityName] || 'Activity';
      setDynamicLabel(dynamicLabel);

      // Set chart data if available
      setChartData({
        labels,
        datasets: [
          {
            label: dynamicLabel, // Dynamic label based on selected activity
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    };

    // Process the data when userLogs changes
    if (userLogs.length > 0) {
      processLogsForChart();
    } else {
      // If there are no logs, reset chartData
      setChartData(null);
    }
  }, [activityName, userLogs]); // Trigger effect when activityName or userLogs change

  const downloadAsPDF = () => {
    if (!chartData) return; // Don't download if no data

    // Select the canvas element that Chart.js renders
    const canvas = document.getElementById('userLogChart') as HTMLCanvasElement;
    if (!canvas) return;

    // Convert the canvas to an image
    const canvasImage = canvas.toDataURL('image/png');

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Set the font for the title and text
    doc.setFontSize(16);
    doc.text('Laporan Statistik Aplikasi', 20, 20);

    // Set the font for the metadata (start date, end date, activity)
    doc.setFontSize(12);
    doc.text(`Dari: ${startDate}`, 20, 30);
    doc.text(`Sampai: ${endDate}`, 100, 30);
    doc.text(`Nama Aktivitas: ${dynamicLabel}`, 20, 40);

    // Add a line break
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45); // Draw a line under the metadata

    // Add the chart image (resize to fit within page dimensions)
    doc.addImage(canvasImage, 'PNG', 20, 50, 170, 100); // Adjust the size to fit the page

    const userName = admin?.fullName || 'Admin';
    const downloadDate = new Date().toLocaleString(); // Get current date and time

    doc.setFontSize(10);
    doc.text(`Digenenerate oleh: ${userName}`, 20, 160); // Position text
    doc.text(`Diunduh pada: ${downloadDate}`, 20, 170); // Position text

    // Save the generated PDF
    doc.save(`Laporan Statistik Aplikasi - ${dynamicLabel}.pdf`);
  };

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
        marginBottom={3}
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

        <Typography
          variant="h5"
          fontWeight={600}
        >
          {' '}
          Laporan Statistik Aplikasi{' '}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Filters Section */}
        <Box sx={{ display: 'flex', gap: 2, marginBottom: '16px', flexWrap: 'wrap' }}>
          <TextField
            label="Dari"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            label="Sampai"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <TextField
            label="Activity"
            select
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
          >
            <MenuItem value="register">Register</MenuItem>
            <MenuItem value="login">Login</MenuItem>
            <MenuItem value="logout">Logout</MenuItem>
            <MenuItem value="verify-email">Verifikasi Email</MenuItem>
            <MenuItem value="reset-password-request">Permintaan Reset Password</MenuItem>
            <MenuItem value="update-profile">Perbarui Profil</MenuItem>
            <MenuItem value="review-tourism-site">Membuat Ulasan pada Tempat Wisata</MenuItem>
            {/* Add more options as needed */}
          </TextField>
        </Box>

        <Box>
          <Button
            onClick={downloadAsPDF}
            sx={{
              backgroundColor: 'brand.main',
              color: 'white',
              paddingX: 2,
              paddingY: 1,
            }}
          >
            <FileDownload
              sx={{
                width: '18px',
                height: '18px',
                marginRight: 1,
                color: 'white',
              }}
            />
            Unduh PDF
          </Button>
        </Box>
      </Box>

      {/* Chart Section */}
      {chartData ? (
        <Bar
          id="userLogChart"
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true, position: 'top' },
              title: { display: true, text: 'Grafik Aktivitas Pengguna' },
            },
          }}
        />
      ) : (
        <Typography>Belum Ada Data Tersedia</Typography>
      )}
    </Container>
  );
}
