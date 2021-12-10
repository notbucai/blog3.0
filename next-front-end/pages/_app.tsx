import '../styles/globals.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { WEBSITE_DESC, WEBSITE_KEYWORDS, WEBSITE_TITLE } from '../config/website.config';
import { RecoilRoot } from 'recoil'

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
