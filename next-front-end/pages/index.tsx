import type { NextPage } from 'next'
import Head from 'next/head'
import { LoadingButton } from '@mui/lab';
import { Container, Typography } from '@mui/material'
import { getPosts, usePosts } from '../http/posts'
import { BasicPost } from '../model/post'
import PostCard from '../components/common/post'
import { useEffect, useState } from 'react'
import postStyles from '../styles/post.module.scss'
import { motion } from 'framer-motion';
import pageStyles from '../styles/page.module.scss';
import PartTags from '../components/parts/tags';
import Banner from '../components/banner/index';
import PostList from '../components/common/postList';

interface Props {
  list: BasicPost[],
  total: number
}

const HomePage: NextPage<Props> = ({ list = [], total = 0 }: Props) => {
  const [data, setData] = useState<{ list: BasicPost[], total: number }>({
    list: list,
    total: total
  });
  const [pageIndex, setPageIndex] = useState(1);
  const { data: reqData, run, loading } = usePosts()

  useEffect(() => {
    if (pageIndex === 1) return

    run({
      page_index: pageIndex
    })
  }, [run, pageIndex])


  useEffect(() => {
    setData((data) => {
      return {
        list: [...data.list, ...(reqData?.list || [])],
        total: reqData?.total || data.total
      }
    })
  }, [reqData])


  return (
    <Container sx={{ marginTop: '20px' }}>
      <motion.div initial={{ scale: .8, opacity: .6 }} exit={{ scale: .8, opacity: .6 }} animate={{ scale: 1, opacity: 1 }}>
        <Banner list={data.list || []} />
      </motion.div>
      <div className={pageStyles.container}>
        <div className={pageStyles.content}>
          <Typography gutterBottom variant="h5" component="div">
            全部文章
          </Typography>
          <PostList
            loading={loading}
            list={data.list}
            total={data.total}
            onLoadNext={() => setPageIndex(pageIndex + 1)}
          />
        </div>
        <div className={pageStyles.asideContainer}>
          <PartTags />
        </div>
      </div>
    </Container>
  )
}

export const getServerSideProps = async () => {
  try {
    const data = await getPosts()

    return {
      props: {
        list: data.list,
        total: data.total
      },
    }
  } catch (error) {
    console.log(error);
  }
  return {
    props: {
      total: 0,
      list: []
    }
  }
}

export default HomePage
