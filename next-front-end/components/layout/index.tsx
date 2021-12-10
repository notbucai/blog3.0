import clsx from 'clsx'
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import { useRouter } from 'next/router'

import Footer from "./footer";
import Header from "./header";

import styles from './style.module.scss';
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
        {children}
        <Footer />
      </div>
    </ThemeProvider>
  );
}