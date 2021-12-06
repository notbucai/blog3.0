import { Button, ButtonBase, Container } from '@mui/material';
import ActiveLink from '../common/activeLink';
import styles from './style.module.scss';

export default function LayoutHeader () {
  return (
    <header className={styles.header}>
      <Container className={styles.headerContainer}>
        <div className={styles.logo}>
          <ActiveLink href="/" passHref>
            <ButtonBase className={styles.logoTitle}>不才</ButtonBase>
          </ActiveLink>
        </div>
        <nav className={styles.nav}>
          <ActiveLink href="/" activeClassName={styles.activeNavLink} passHref>
            <ButtonBase className={styles.navLink} >首页</ButtonBase>
          </ActiveLink>
          <ActiveLink href="/message" activeClassName={styles.activeNavLink} passHref>
            <ButtonBase className={styles.navLink} >留言</ButtonBase>
          </ActiveLink>
          <ActiveLink href="/contact" activeClassName={styles.activeNavLink} passHref>
            <ButtonBase className={styles.navLink} >有邻</ButtonBase>
          </ActiveLink>
          <ActiveLink href="/friends" activeClassName={styles.activeNavLink} passHref>
            <ButtonBase className={styles.navLink} >圈子</ButtonBase>
          </ActiveLink>
          <ActiveLink href="/timelines" activeClassName={styles.activeNavLink} passHref>
            <ButtonBase className={styles.navLink} >归档</ButtonBase>
          </ActiveLink>
        </nav>
        <div className={styles.headerRight}>
          <Button disableElevation variant="contained" className={styles.navLink} >登录</Button>
        </div>
      </Container>
    </header>
  );
}