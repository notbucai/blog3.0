import '../styles/globals.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { motion } from 'framer-motion'
import { WEBSITE_DESC, WEBSITE_KEYWORDS, WEBSITE_TITLE } from '../config/website.config';
import { RecoilRoot } from 'recoil'

const options = {
  variants: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  spring: {
    type: "spring",
    damping: 20,
    stiffness: 100,
    when: "afterChildren"
  }
}

const PageTransition = ({ children, pathname }: { children: React.ReactNode; pathname: string; }) => {
  return (
    <motion.main
      key={pathname}
      variants={options.variants}
      animate="animate"
      exit="exit"
      initial="initial"
      transition={options.spring}
    >
      {children}
    </motion.main>
  )
}

function MyApp ({ Component, pageProps }: AppProps) {


  return (
    <RecoilRoot>
      <Head>
        <title>{WEBSITE_TITLE}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={WEBSITE_DESC} />
        <meta name="keywords" content={WEBSITE_KEYWORDS} />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>

  )
}

export default MyApp
