/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { AddCircle, ArrowBack, RemoveCircle } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { SiteDetailsProps } from '@/app/_models/site.model';

import { formSchema } from '@/app/_validators/siteSchema';
import { createSiteFormType } from '@/app/_validators/siteSchema';
import axios from 'axios';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import React from 'react';
import { useAdmin } from '@/app/_hooks/provider/AdminProvider';
import dynamic from 'next/dynamic';

const PopupModal = dynamic(() => import('@/app/_components/PopupModal'), { ssr: false });
const ConfirmationModal = dynamic(() => import('@/app/_components/ConfirmationModal'), {
  ssr: false,
});
const ContactInfoInput = dynamic(() => import('@/app/_components/ContactsInput'), { ssr: false });
const CoordinateSelector = dynamic(() => import('@/app/_components/CoordinateSelector'), {
  ssr: false,
});
const ImageUploadForm = dynamic(() => import('@/app/_components/ImageUploadForm'), { ssr: false });
const OperationalHourInput = dynamic(() => import('@/app/_components/OperationalHourInput'), {
  ssr: false,
});
const TextInput = dynamic(() => import('@/app/_components/TextInput'), { ssr: false });

interface CustomImage {
  _id: string; // Example property
  title: string; // Example property
  url: string; // Example property
}

const staticInitialValues: createSiteFormType = {
  siteName: '',
  address: '',
  newImages: [],
  existingImages: [
    {
      _id: '',
      title: '',
      url: '',
    },
  ],
  latitude: 0,
  longitude: 0,
  description: '',
  uniqueFacts: [
    {
      fact: '',
    },
  ],

  operationalHours: [
    { day: 'Senin', openHour: '', closeHour: '' },
    { day: 'Selasa', openHour: '', closeHour: '' },
    { day: 'Rabu', openHour: '', closeHour: '' },
    { day: 'Kamis', openHour: '', closeHour: '' },
    { day: 'Jumat', openHour: '', closeHour: '' },
    { day: 'Sabtu', openHour: '', closeHour: '' },
    { day: 'Minggu', openHour: '', closeHour: '' },
  ],

  contacts: [
    {
      type: '',
      contactName: '',
      detail: '',
    },
  ],

  adminId: '',
};

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

export default function EditSite({ params }: { params: { id: string } }) {
  const { push, back } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [resPopUpOpen, setResPopUpOpen] = useState<boolean>(false);
  const [resTitle, setResTitle] = useState<string>('');
  const [resDescription, setResDescription] = useState<string>('');

  // If succeed, please use this state to redirect
  const [resRedirect, setResRedirect] = useState<string | undefined>(undefined);
  const { admin, refetch } = useAdmin();

  const [siteData, setSiteData] = useState<SiteDetailsProps>();

  const handleClose = () => {
    setResPopUpOpen(false);
  };

  const onSubmit = (values: createSiteFormType) => {
    const formattedHours = values.operationalHours?.length
      ? values.operationalHours
          .filter((item) => item.openHour && item.closeHour)
          .map((item) => `${item.day} ${item.openHour} - ${item.closeHour}`)
          .join(', ')
      : ''; // If operationalHours is undefined or empty, return an empty string

    // Create a new object with the formatted operationalHours
    const newValues = {
      ...values, // spread the existing values
      operationalHours: formattedHours, // replace operationalHours with formatted string
    };

    // Open the modal and set the formatted data
    setIsModalOpen(true);
    setFormData(newValues);
  };

  const handleAPIEdit = async (data: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (
          key !== 'newImages' &&
          key !== 'contacts' &&
          key !== 'uniqueFacts' &&
          key !== 'existingImages'
        ) {
          formData.append(key, data[key]);
        }
      });

      // Append image files if they exist (newly added images)
      if (data.newImages && data.newImages.length > 0) {
        data.newImages.forEach((image: File) => {
          formData.append('images', image); // 'images' should match your backend field
        });
      }

      // Serialize contacts and uniqueFacts as JSON
      if (data.contacts) {
        formData.append('contacts', JSON.stringify(data.contacts));
      }
      if (data.uniqueFacts) {
        formData.append('uniqueFacts', JSON.stringify(data.uniqueFacts));
      }

      // Append keepImages (existing images to retain)
      if (data.existingImages && data.existingImages.length > 0) {
        const keepImages = data.existingImages.map((img: { _id: any }) => img._id); // Assuming img has an id field
        formData.append('keepImages', JSON.stringify(keepImages)); // Send as JSON
      }

      const entries = formData.entries();
      let result = entries.next();
      while (!result.done) {
        const key = result.value[0];
        const value = result.value[1];
        console.log(`${key}:`, value);
        result = entries.next();
      }

      const response = await axios.put(`http://localhost:5000/api/site/${params.id}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        // Redirect to the main site page
        setResPopUpOpen(true);
        setResTitle('Data Wisata Berhasil Diubah');
        setResDescription('');
        back();
        refetch();
      }
    } catch (err) {
      console.log(err);
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: staticInitialValues,
    validationSchema: toFormikValidationSchema(formSchema),
    onSubmit,
  });

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
    values,
    setValues,
  } = formik;

  const handleLocationSelect = (location: any) => {
    const { lat, lng } = location;
    setFieldValue('latitude', lat);
    setFieldValue('longitude', lng);
  };

  useEffect(() => {
    const fetchSitesByOwner = async () => {
      try {
        // Fetch admin data from your backend API
        const response = await axios.get(`http://localhost:5000/api/site/${params.id}`, {
          withCredentials: true,
        });
        setSiteData(response.data);
        setValues({
          ...staticInitialValues,
          existingImages: response.data.images, // Set fetched images to form values
          siteName: response.data.siteName,
          address: response.data.address,
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          description: response.data.description,
          uniqueFacts: response.data.uniqueFacts || [{ fact: '' }],
          operationalHours: response.data.operationalHours || [],
          contacts: response.data.contacts || [],
        });
      } catch (error: any) {
        console.log(error);
      } finally {
        // setLoading(false);
      }
    };

    fetchSitesByOwner();
  }, [params.id, setValues]);

  useEffect(() => {
    // Check if operationalHours is a string and parse it if necessary
    const operationalHours =
      typeof values.operationalHours === 'string'
        ? parseOperationalHours(values.operationalHours)
        : values.operationalHours;

    // Set the operationalHours in Formik if it’s an array of objects
    if (Array.isArray(operationalHours)) {
      setFieldValue('operationalHours', operationalHours);
    }
  }, [values.operationalHours, setFieldValue]);

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

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              columnGap: 1,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: 'gray',
              }}
            >
              {' '}
              Edit /{' '}
            </Typography>
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{
                color: 'brand.main',
              }}
            >
              {' '}
              {values.siteName}{' '}
            </Typography>
          </Box>
        </Box>
        <FormikProvider value={formik}>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <ImageUploadForm
                existingImages={values.existingImages}
                newImages={values.newImages || []}
                setFieldValue={setFieldValue}
                errors={errors}
                touched={touched}
              />

              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  columnGap: 5,
                  marginBottom: 2,
                }}
              >
                <Box
                  sx={{
                    width: '45%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <TextInput
                    type="text"
                    name="siteName"
                    label="Nama Toko/Tempat Wisata"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors}
                    touched={touched}
                    value={values.siteName}
                  />

                  <TextInput
                    type="multiline"
                    name="address"
                    label="Alamat Toko/Tempat Wisata"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors}
                    touched={touched}
                    value={values.address}
                    rowCount={4}
                  />
                </Box>

                <Box
                  sx={{
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: 2,
                  }}
                >
                  <CoordinateSelector
                    handleLocationSelect={handleLocationSelect}
                    latitude={values.latitude}
                    longitude={values.longitude}
                  />

                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography
                      variant="button"
                      fontStyle={'oblique'}
                    >
                      {' '}
                      Koordinat Toko/Tempat Wisata Anda:{' '}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        columnGap: 4,
                      }}
                    >
                      <TextInput
                        type="text"
                        label="Latitude"
                        name="latitude"
                        value={values.latitude}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors}
                        touched={touched}
                      />

                      <TextInput
                        type="text"
                        label="Longitude"
                        name="longitude"
                        value={values.longitude}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors}
                        touched={touched}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'start',
                  marginBottom: 2,
                  columnGap: 10,
                }}
              >
                <Box
                  sx={{
                    width: '45%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        width: '80%',
                        color: 'GrayText',
                        marginBottom: 2,
                      }}
                      fontStyle={'oblique'}
                    >
                      Seputar Toko/Tempat Wisata
                    </Typography>
                  </Box>
                  <TextInput
                    name="description"
                    label="Deskripsi Singkat"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors}
                    type="multiline"
                    touched={touched}
                    rowCount={6}
                  />
                </Box>

                <Box
                  sx={{
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        width: '80%',
                        color: 'GrayText',
                        marginBottom: 2,
                      }}
                      fontStyle={'oblique'}
                    >
                      Fakta Unik
                    </Typography>
                  </Box>

                  <FieldArray
                    name="uniqueFacts"
                    render={(arrayHelpers) =>
                      values.uniqueFacts.map((field: any, i: number) => {
                        const factCounter = i + 1;
                        return (
                          <React.Fragment key={`uniqueFacts${i}`}>
                            <Box
                              sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                              }}
                            >
                              <Box
                                sx={{
                                  width: '100%',
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <Typography
                                  variant="button"
                                  fontWeight={600}
                                  sx={{
                                    paddingLeft: 2,
                                    width: '100px',
                                  }}
                                >
                                  Fakta {factCounter}
                                </Typography>
                                <TextInput
                                  type="multiline"
                                  name={`uniqueFacts.${i}.fact`}
                                  value={field.fact}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={errors}
                                  touched={touched}
                                  label={''}
                                  rowCount={2}
                                />
                              </Box>

                              <Box alignSelf="center">
                                {values.uniqueFacts.length > 1 && (
                                  <IconButton onClick={() => arrayHelpers.remove(i)}>
                                    <RemoveCircle sx={{ color: 'error.dark' }} />
                                  </IconButton>
                                )}
                              </Box>
                            </Box>

                            <Box>
                              <Box>
                                {values.uniqueFacts.length - 1 === i && (
                                  <Button
                                    variant="outlined"
                                    startIcon={<AddCircle />}
                                    sx={{ mt: 2, width: '100%' }}
                                    onClick={() =>
                                      arrayHelpers.push({
                                        fact: '',
                                      })
                                    }
                                  >
                                    Tambah Data
                                  </Button>
                                )}
                              </Box>
                            </Box>
                          </React.Fragment>
                        );
                      })
                    }
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                }}
              >
                <Box
                  sx={{
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      width: '80%',
                      color: 'GrayText',
                      marginBottom: 2,
                    }}
                    fontStyle={'oblique'}
                  >
                    Atur Jam Operasional
                  </Typography>
                  <OperationalHourInput
                    error={errors}
                    touched={touched}
                  />
                </Box>

                <Box
                  sx={{
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      width: '80%',
                      color: 'GrayText',
                      marginBottom: 2,
                    }}
                    fontStyle={'oblique'}
                  >
                    Kontak Toko/Tempat Wisata
                  </Typography>

                  <ContactInfoInput
                    values={values}
                    onChange={handleChange}
                    handleChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched}
                    error={errors}
                  />
                </Box>
              </Box>

              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: 'brand.main',
                  alignSelf: 'flex-end',
                }}
                size="large"
              >
                Ubah Data
              </Button>
            </Box>
          </form>
        </FormikProvider>

        <ConfirmationModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirm Submission"
          description="Are you sure you want to update this form?"
          onConfirm={() => handleAPIEdit(formData)} // Action to be performed when the user confirms
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
