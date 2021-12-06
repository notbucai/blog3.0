import type { NextPage } from 'next'
import Head from 'next/head'
import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material'
import { getPosts, usePosts } from '../http/posts'
import { BasicPost } from '../model/post'
import PostCard from '../components/common/post'
import { useEffect, useState } from 'react'
import postStyles from '../styles/post.module.scss'

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
    <div>
      <Typography gutterBottom variant="h5" component="div">
        全部文章
      </Typography>
      {
        data.list.map(post => {
          return (
            <PostCard post={post} key={post._id} />
          );
        })
      }
      {
        data.list.length < data.total
          ?
          <div className={postStyles.loadMore}>
            <LoadingButton loading={loading} size="large" variant="contained" color="error" onClick={() => setPageIndex(pageIndex + 1)}>加载更多</LoadingButton>
          </div>
          :
          null
      }
    </div>
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
