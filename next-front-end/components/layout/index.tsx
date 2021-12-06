import clsx from 'clsx'
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import { Container } from '@mui/material';
import { useRouter } from 'next/router'

import Footer from "./footer";
import Header from "./header";
import Aside from './aside';
import Swiper from './swiper';

import styles from './style.module.scss';
import { motion } from 'framer-motion';
interface Props {
  children: React.ReactNode;
}

let theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    error:{
      main: "#ff5252"
    }
  },
  typography: {
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          ":hover": {
            // backgroundColor: 'in',
            // opacity: '.9'
          },
        }
      }
    }
  }
});
theme = responsiveFontSizes(theme);

theme.shadows[1] = '0 20px 40px -15px rgb(0 0 0 / 5%)';


export default function Layout ({ children }: Props) {
  const router = useRouter()
  return (
    <ThemeProvider theme={theme}>
      <div className={clsx([styles.layout])}>
        <Header />
        {
          router.pathname === '/'
            ?
            <motion.div initial={{ scale: .8, opacity: .6 }} exit={{ scale: .8, opacity: .6 }} animate={{ scale: 1, opacity: 1 }}>
              <Swiper />
            </motion.div>
            : null
        }
        <Container sx={{ marginTop: '20px' }}>
          <div className={styles.container}>
            <div className={styles.content}>
              {children}
            </div>
            <div className={styles.asideContainer}>
              <Aside />
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    </ThemeProvider>
  );
}