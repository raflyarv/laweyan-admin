/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
  ConfirmationModal,
  ContactItems,
  MapLocationDisplay,
  PopupModal,
  ScheduleDisplay,
  SiteReviewCard,
} from '@/app/_components';
import {
  ArrowBack,
  DeleteOutline,
  EditOutlined,
  LocationOn,
  MyLocation,
} from '@mui/icons-material';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SiteDetailsProps } from '@/app/_models/site.model';
import { formattedTimestamp } from '@/app/_utils/formattedTimestamp';
// import { useSearchParams } from 'next/navigation';

import Image from 'next/image';
import { useAdmin } from '@/app/_hooks/provider/AdminProvider';
import { formatDateToIndonesian } from '@/app/_utils/formattedDate';
import { timeAgoIndicator } from '@/app/_utils/tineAgoIndicator';

// Define the structure for the User who submitted the review
interface User {
  _id: string;
  fullName: string;
  profileImage: string | null; // profileImage can be null if not provided
  reviewCount: number;
}

// Define the structure for a Review
interface Review {
  _id: string;
  userId: User; // Reference to the user who submitted the review
  locationId: number; // The location the review is related to
  rating: number; // The rating provided (e.g., 1 to 5)
  comments: string; // The content of the review
  dateVisited: string; // The date when the location was visited
  createdAt: string; // The date when the review was created
  updatedAt: string; // The date when the review was last updated
  isHidden: boolean;
}

export default function SiteDetails({ params }: { params: { id: string } }) {
  const [siteData, setSiteData] = useState<SiteDetailsProps>();
  const [siteReview, setSiteReview] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { refetch } = useAdmin();

  const [resPopUpOpen, setResPopUpOpen] = useState<boolean>(false);
  const [resTitle, setResTitle] = useState<string>('');
  const [resDescription, setResDescription] = useState<string>('');
  const [resRedirect, setRedirectPath] = useState<string>('');

  const handleClose = () => {
    setResPopUpOpen(false);
  };

  // Fetch site data and reviews
  const fetchSitesByOwner = async (id: any) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/site/${id}`, {
        withCredentials: true,
      });
      setSiteData(response.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const fetchSiteReviews = async (id: any) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/review/${id}`, {
        withCredentials: true,
      });
      setSiteReview(response.data.reviews);
    } catch (error: any) {
      console.log('Error fetching reviews:', error);
      setSiteReview([]);
    }
  };

  // useEffect to fetch site data and reviews on component mount or params.id change
  useEffect(() => {
    fetchSitesByOwner(params.id);
    fetchSiteReviews(params.id);
  }, [params.id]);

  const { push, back } = useRouter();
  //   const handleToReviewList = () => push(`/site/${params.id}/reviews`);
  const handleToEditSite = () => push(`/admin/site/${params.id}/edit`);

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const handleAPIDeleteSite = async (id: number | undefined) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`http://localhost:5000/api/site/${id}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setResPopUpOpen(true);
        setResTitle('Tempat wisata berhasil dihapus.');
        setResDescription('');
        refetch();

        push('/admin/sites');
      }
    } catch (error: any) {
      if (error.status === 404) {
        setResPopUpOpen(true);
        setResTitle('Tempat wisata tidak ditemukan. Silahkan coba lagi.');
        setResDescription('');
      } else {
        setResPopUpOpen(true);
        setResTitle('Terjadi kesalahan. Silahkan coba lagi.');
        setResDescription('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReviewVisibility = async (id: string, isHidden: boolean) => {
    // Send request to server to toggle visibility
    setIsLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/review/status/edit/${id}`,
        { isHidden },
        { withCredentials: true },
      ); // Replace with your API endpoint
      fetchSiteReviews(params.id);
    } catch (error) {
      console.error('Error toggling visibility:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/review/${id}`);

      fetchSiteReviews(params.id);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Backdrop
        open={isLoading}
        sx={{
          zIndex: 100,
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Backdrop>
      <Container maxWidth="lg">
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
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
          gap={3}
          marginBottom={2}
        >
          <Box
            sx={{
              width: '75%',
            }}
          >
            <Typography variant="h4"> {siteData?.siteName} </Typography>
          </Box>
          <Box
            sx={{
              width: '25%',
              height: 'auto',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
            gap={1}
          >
            <Button
              variant="outlined"
              sx={{
                height: 'min-content',
                color: 'primary',
                paddingY: 1,
                minWidth: '110px',
                marginRight: 2,
              }}
              startIcon={<EditOutlined />}
              onClick={handleToEditSite}
            >
              <Typography
                variant="body1"
                fontWeight={500}
              >
                Edit
              </Typography>
            </Button>

            <Button
              variant="outlined"
              onClick={handleDelete}
              color="error"
              sx={{
                height: 'min-content',
                color: 'danger.main',
                paddingY: 1,
                minWidth: '110px',
                marginRight: 2,
              }}
              startIcon={<DeleteOutline />}
            >
              <Typography
                variant="body1"
                fontWeight={500}
              >
                Hapus
              </Typography>
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
          marginBottom={2}
        >
          <Box
            sx={{
              display: 'inline-flex',
              gap: 2,
            }}
          >
            {siteData?.images.map((image, index) => (
              <div
                key={index}
                style={{ marginBottom: '16px' }}
              >
                <Image
                  src={`http://localhost:5000/${image.url}`} // URL of the image from the siteData
                  alt={image.title || 'Site Image'} // Optional alt text for accessibility
                  width={300} // Set width to 300px
                  height={360} // Set height to 360px
                  style={{
                    objectFit: 'cover', // Ensures the image covers the specified area
                  }}
                  unoptimized
                />
              </div>
            ))}
          </Box>
        </Box>

        <Box
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            columnGap: 5,
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
            gap={1}
            marginBottom={2}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}
              gap={1}
            >
              <LocationOn
                sx={{
                  width: '32px',
                  height: '32px',
                }}
              />
              <Typography variant="body1">{siteData?.address}</Typography>
            </Box>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              gap={1}
            >
              <MyLocation
                sx={{
                  width: '32px',
                  height: '32px',
                }}
              />
              <Typography variant="body1">
                {' '}
                {siteData?.latitude}, {siteData?.longitude}{' '}
              </Typography>
            </Box>
          </Box>
          {siteData?.latitude && siteData.longitude && (
            <MapLocationDisplay
              latitude={siteData?.latitude}
              longitude={siteData?.longitude}
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
          >
            Fakta Unik
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              columnGap: 2,
              overflowX: 'auto',
              padding: 2,
            }}
          >
            {siteData?.uniqueFacts.map((fact, index) => {
              return (
                <Box
                  key={`fact-${index}`}
                  sx={{
                    minWidth: 300,
                    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;',
                    borderRadius: 5,
                    paddingX: 3,
                    paddingY: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'normal',
                    }}
                  >
                    {' '}
                    {fact.fact}{' '}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          marginBottom={2}
        >
          <Box
            sx={{
              width: '60%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ marginBottom: 1 }}
            >
              Deskripsi
            </Typography>
            <Typography variant="body1">{siteData?.description}</Typography>
          </Box>

          <Box
            sx={{
              width: '20%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ marginBottom: 1 }}
            >
              {' '}
              Jam Operasional{' '}
            </Typography>

            <Box
              sx={{
                width: '45 %',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}
            >
              <ScheduleDisplay schedule={siteData?.operationalHours} />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            marginBottom={2}
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
              >
                {' '}
                Ulasan ({siteReview.length || 0}){' '}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              marginBottom: 5,
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                gap: 2,
                padding: 1,
              }}
            >
              {siteReview && siteReview.length > 0 ? (
                siteReview.map((review, index) => {
                  return (
                    <SiteReviewCard
                      key={index}
                      id={review._id}
                      locationId={`${review.locationId}`}
                      userName={review.userId.fullName}
                      reviewCount={review.userId.reviewCount}
                      rating={review.rating}
                      datetime={timeAgoIndicator(review.createdAt)}
                      reviewDescription={review.comments}
                      visitDate={formatDateToIndonesian(review.dateVisited)}
                      imagePath={`http://localhost:5000/${review.userId.profileImage}`}
                      onToggleVisibility={toggleReviewVisibility}
                      onDeleteReview={handleReviewDelete}
                      isHidden={review.isHidden}
                    />
                  );
                })
              ) : (
                <Typography>Tidak ada ulasan untuk ditampilkan.</Typography>
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            marginBottom={2}
          >
            {' '}
            Kontak Tersedia{' '}
          </Typography>
          <Box
            sx={{
              width: 'auto',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              columnGap: 2,
              flexWrap: 'wrap',
            }}
          >
            {siteData?.contacts && siteData?.contacts.length > 0 ? (
              siteData.contacts.map((contact, index) => {
                return (
                  <ContactItems
                    key={`contact-${index}`}
                    type={contact.type as 'Instagram' | 'Whatsapp' | 'Facebook' | 'Website'}
                    name={contact.contactName}
                    detail={contact.detail}
                  />
                );
              })
            ) : (
              <Typography> Tidak ada Kontak Tersedia </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              columnGap: 1,
            }}
          >
            <Typography variant="body2"> Dibuat oleh {siteData?.createdBy?.fullName}</Typography>
            <Typography variant="body2">
              {' '}
              pada {formattedTimestamp(siteData?.createdAt || '')}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              columnGap: 1,
            }}
          >
            <Typography variant="body2">
              {' '}
              Diperbarui oleh {siteData?.updatedBy?.fullName}
            </Typography>
            <Typography variant="body2">
              {' '}
              pada {formattedTimestamp(siteData?.updatedAt || '')}
            </Typography>
          </Box>
        </Box>

        <ConfirmationModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => handleAPIDeleteSite(siteData?.id)}
          title="Anda yakin ingin menghapus Toko/Tempat Wisata?"
          description=""
        />

        <PopupModal
          open={resPopUpOpen}
          onClose={handleClose}
          title={resTitle}
          description={resDescription}
          redirectPath={resRedirect}
        />
      </Container>
    </>
  );
}
