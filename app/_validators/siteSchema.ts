import { z } from 'zod';

const operationalHourSchema = z
  .object({
    day: z.string({ required_error: 'Hari harus ada pada jam operasional.' }),
    openHour: z.string().optional(), // Allow optional openHour
    closeHour: z.string().optional(), // Allow optional closeHour
  })
  .refine(
    (data) => {
      // If openHour is provided, closeHour must also be provided and vice versa
      return (data.openHour && data.closeHour) || (!data.openHour && !data.closeHour);
    },
    {
      message: 'Both open and close hours must be filled or left empty',
      path: ['openHour', 'closeHour'], // Affects both fields
    },
  );

const formSchema = z.object({
  siteName: z.string().min(1, 'Site Name is required'),
  address: z.string({ required_error: 'Alamat Toko/Tempat Wisata Harus Diisi' }).refine((input) => {
    const validDistrict = ['Laweyan', 'Kelurahan Laweyan'];
    const validPostcodes = ['57148'];

    const hadValidDistrict = validDistrict.some((district) => input.includes(district));
    const hasValidPostcode = validPostcodes.some((postcode) => {
      input.includes(postcode);
    });

    return hadValidDistrict || hasValidPostcode;
  }, 'Alamat yang Anda Masukkan Berada Di Luar Kelurahan Laweyan.'),
  // images: z
  //   .array(z.instanceof(File))
  //   .max(5, 'Maksimal 5 gambar untuk diupload.')
  //   .min(2, 'Setidaknya unggah 2 gambar.'),
  existingImages: z
    .array(
      z.object({
        _id: z.string(),
        title: z.string().min(1),
        url: z.string(),
      }),
    )
    .max(5, 'Maksimal 5 gambar untuk diupload.')
    .optional(),
  newImages: z.array(z.instanceof(File)).max(5, 'Maksimal 5 gambar untuk diupload.').optional(),
  latitude: z
    .number()
    .min(-90)
    .max(90, 'Invalid Latitude')
    .refine((val) => val !== 0, { message: 'Latitude cannot be 0' }),
  longitude: z
    .number()
    .min(-180)
    .max(180, 'Invalid Longitude')
    .refine((val) => val !== 0, { message: 'Longitude cannot be 0' }),
  description: z.string({ required_error: 'Deskripsi singkat harus diisi.' }),
  uniqueFacts: z.array(
    z.object({
      fact: z.string({ required_error: 'Tolong isi' }),
    }),
  ),

  operationalHours: z
    .array(operationalHourSchema)
    .min(1, { message: 'At least one operational hour must be provided' }),

  contacts: z.array(
    z.object({
      type: z.string({ required_error: 'Tolong isi' }),
      contactName: z.string(),
      detail: z.string(),
    }),
  ),

  adminId: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

type createSiteFormType = z.infer<typeof formSchema>;

export { operationalHourSchema, formSchema };
export type { createSiteFormType };
