import clsx from 'clsx'
import { createTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import Footer from "./footer";
import Header from "./header";
import styles from './style.module.scss';
import Aside from './aside';

let theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
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

interface Props {
  children: React.ReactNode;
}

export default function Layout ({ children }: Props) {
  return (
    <ThemeProvider theme={theme}>
      <div className={clsx([styles.layout])}>
        <Header />
        <Container sx={{ marginTop: '20px' }}>
          <div className={styles.container}>
            <div className={styles.content}>
              {children}
            </div>
            <div className={styles.aside}>
              <Aside />
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    </ThemeProvider>
  );
}