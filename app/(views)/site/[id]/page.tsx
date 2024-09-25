'use client';
import { SiteReviewCard } from '@/app/_components';
import {
  ArrowBack,
  DeleteOutline,
  EditOutlined,
  LocationOn,
  MyLocation,
} from '@mui/icons-material';
import { Box, Button, Container, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
// import { useSearchParams } from 'next/navigation';

export default function SiteDetails({ params }: { params: { id: string } }) {
  // const searchParams = useSearchParams();
  // const id = searchParams.get('id')

  const { push, back } = useRouter();
  const handleToReviewList = () => push(`/site/${params.id}/reviews`);
  const handleToEditSite = () => push(`/site/${params.id}/edit`);

  return (
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
          <Typography variant="h4">
            {' '}
            Nama Tempat Wisata yang sangat panjang bjir anjir awaehwieh{' '}
          </Typography>
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
            // aria-controls={sortOpen ? 'sort-menu' : undefined}
            // aria-haspopup="true"
            // onClick={handleSortClick}
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
            // aria-controls={sortOpen ? 'sort-menu' : undefined}
            // aria-haspopup="true"
            // onClick={handleSortClick}
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
          <Box
            sx={{
              width: '300px',
              height: '360px',
              backgroundColor: 'gray',
            }}
          ></Box>

          <Box
            sx={{
              width: '300px',
              height: '360px',
              backgroundColor: 'gray',
            }}
          ></Box>

          <Box
            sx={{
              width: '300px',
              height: '360px',
              backgroundColor: 'gray',
            }}
          ></Box>

          <Box
            sx={{
              width: '300px',
              height: '360px',
              backgroundColor: 'gray',
            }}
          ></Box>

          <Box
            sx={{
              width: '300px',
              height: '360px',
              backgroundColor: 'gray',
            }}
          ></Box>
        </Box>
      </Box>

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
          <Typography variant="h6">
            Alamat yang super duper panjang awokwokok ciciici okeokeo yas sir slayyyy Alamat yang
            super duper panjang awokwokok ciciici okeokeo yas sir slayyyy
          </Typography>
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
          <Typography variant="h6"> 101.0977, -7.78980 </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
        }}
        gap={15}
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
          <Typography variant="h6">
            Okidi doa lorem ipsum dimulai senorita awesome i want some pumpkin latte floptropicana
            cupcakke slay yass girl omg im so in love with IVE DIVE INTO IVE AHAYYYYYYYY
          </Typography>
        </Box>

        <Box
          sx={{
            width: '30%',
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
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
              }}
            >
              <Typography
                sx={{
                  width: '50%',
                }}
                variant="h6"
              >
                Senin
              </Typography>
              <Typography
                sx={{
                  width: '50%',
                }}
                variant="h6"
              >
                00.00 - 00.00
              </Typography>
            </Box>

            <Box
              sx={{
                width: '100%',
                display: 'flex',
              }}
            >
              <Typography
                sx={{
                  width: '50%',
                }}
                variant="h6"
              >
                Minggu
              </Typography>
              <Typography
                sx={{
                  width: '40%',
                }}
                variant="h6"
              >
                00.00 - 00.00
              </Typography>
            </Box>
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
              Ulasan (5){' '}
            </Typography>
          </Box>

          <Box
            onClick={handleToReviewList}
            sx={{
              cursor: 'pointer',
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
            >
              Lihat Semua
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              gap: 2,
              padding: 1,
            }}
          >
            <SiteReviewCard
              id="1"
              userName="Muhammad Tohir Rafly"
              reviewCount="10"
              rating={4}
              datetime="1 tahun yang lalu"
              reviewTitle="Oke good naiseu"
              reviewDescription="Oke lorem ipsum mulai berdoa yuk hayuk anjayani gurinjay awokwwkokw xixixixii siap bong huhuhuhuhu"
              visitDate="12 September 2024"
              imagePath="https://xixixi.com"
            />

            <SiteReviewCard
              id="2"
              userName="Muhammad Tohir Rafly"
              reviewCount="11"
              rating={4}
              datetime="1 tahun yang lalu"
              reviewTitle="Oke good naiseu"
              reviewDescription="Lorem ipsum dolor sit amet consectetur. Sapien id nec magna lacus turpis ultricies eu nunc. Dictumst lorem fames nunc vitae ut faucibus sodales.  Lorem ipsum dolor sit amet consectetur. Sapien id nec magna lacus turpis ultricies eu nunc. Dictumst lorem fames nunc vitae ut faucibus sodales. Lorem ipsum dolor sit amet consectetur. Sapien id nec magna lacus turpis ultricies eu nunc. Dictumst lorem fames nunc vitae ut faucibus sodales. "
              visitDate="12 September 2024"
              imagePath="https://xixixi.com"
            />

            <SiteReviewCard
              id="2"
              userName="Muhammad Tohir Rafly"
              reviewCount="11"
              rating={4}
              datetime="1 tahun yang lalu"
              reviewTitle="Oke good naiseu"
              reviewDescription="Lorem ipsum dolor sit amet consectetur. Sapien id nec magna lacus turpis ultricies eu nunc. Dictumst lorem fames nunc vitae ut faucibus sodales.  Lorem ipsum dolor sit amet consectetur. Sapien id nec magna lacus turpis ultricies eu nunc. Dictumst lorem fames nunc vitae ut faucibus sodales. Lorem ipsum dolor sit amet consectetur. Sapien id nec magna lacus turpis ultricies eu nunc. Dictumst lorem fames nunc vitae ut faucibus sodales. "
              visitDate="12 September 2024"
              imagePath="https://xixixi.com"
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
