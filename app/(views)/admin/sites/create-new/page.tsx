/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Typography,
} from '@mui/material';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useEffect, useState } from 'react';
import React from 'react';
import { Add, AddCircle, ArrowBack, RemoveCircle } from '@mui/icons-material';
import { useAdmin } from '@/app/_hooks/provider/AdminProvider';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { formSchema } from '@/app/_validators/siteSchema';
import { createSiteFormType } from '@/app/_validators/siteSchema';
import dynamic from 'next/dynamic';

const ConfirmationModal = dynamic(() => import('@/app/_components/ConfirmationModal'), {
  ssr: false,
});
const ContactInfoInput = dynamic(() => import('@/app/_components/ContactsInput'), { ssr: false });
const CoordinateSelector = dynamic(() => import('@/app/_components/CoordinateSelector'), {
  ssr: false,
});
const TextInput = dynamic(() => import('@/app/_components/TextInput'), { ssr: false });
const OperationalHourInput = dynamic(() => import('@/app/_components/OperationalHourInput'), {
  ssr: false,
});
const ImageUploadForm = dynamic(() => import('@/app/_components/ImageUploadForm'), { ssr: false });

const staticInitialValues: createSiteFormType = {
  siteName: '',
  address: '',
  newImages: [],
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
  createdBy: '',
  updatedBy: '',
};

export default function CreateSite() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const { admin } = useAdmin();
  const { back, push } = useRouter();

  const onSubmit = async (values: createSiteFormType) => {
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
      createdBy: admin?._id,
      updatedBy: admin?._id,
    };

    // Open the modal and set the formatted data
    setIsModalOpen(true);
    setFormData(newValues);
  };

  const handleAPISubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Append non-file fields from the data
      Object.keys(data).forEach((key) => {
        if (key !== 'newImages' && key !== 'contacts' && key !== 'uniqueFacts') {
          formData.append(key, data[key]);
        }
      });

      // Append image files if they exist
      if (data.newImages && data.newImages.length > 0) {
        data.newImages.forEach((image: File) => {
          formData.append('images', image); // Make sure 'images' matches your backend field name
        });
      }

      // Serialize contacts and uniqueFacts as JSON
      if (data.contacts) {
        formData.append('contacts', JSON.stringify(data.contacts));
      }
      if (data.uniqueFacts) {
        formData.append('uniqueFacts', JSON.stringify(data.uniqueFacts));
      }

      // Send the formData using axios
      const response = await axios.post('http://localhost:5000/api/site', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // If site creation is successful, update admin info
      if (admin?.addressTemp && admin.siteNameTemp && response.status === 201) {
        const adminUpdateData = {
          siteNameTemp: null, // Remove siteNameTemp
          addressTemp: null, // Remove addressTemp
        };

        // Call the API to update the admin information
        await axios.put('http://localhost:5000/api/admin/edit', adminUpdateData, {
          withCredentials: true,
        });
      }
      push('/admin/sites');
    } catch (error) {
      console.log(error);
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

  console.log(errors);

  useEffect(() => {
    if (admin) {
      setValues({
        ...staticInitialValues,
        siteName: admin?.siteNameTemp || '',
        address: admin?.addressTemp || '',
      });
    }
  }, [admin, setValues]); // This effect runs when admin changes

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
                        type="number"
                        label="Latitude"
                        name="latitude"
                        value={values.latitude}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors}
                        touched={touched}
                      />

                      <TextInput
                        type="number"
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
              >
                Submit
              </Button>
            </Box>
          </form>
        </FormikProvider>

        <ConfirmationModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirm Submission"
          description="Are you sure you want to submit this form?"
          onConfirm={() => handleAPISubmit(formData)} // Action to be performed when the user confirms
        />
      </Container>
    </>
  );
}
