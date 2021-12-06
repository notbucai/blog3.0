/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-12-05 10:05:28
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-06 13:11:10
 * @Description: 
 */
import { useEffect, useRef } from 'react'
import { useInViewport } from 'ahooks'
import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { BasicPost } from '../../model/post'
import ActiveLink from './activeLink'
import postStyles from './styles/post.module.scss'

interface Props {
  post: BasicPost
}

const PostCard = ({ post }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView] = useInViewport(ref);
  const animationControl = useAnimation();
  useEffect(() => {
    if (inView) {
      animationControl.start({
        x: 0,
        scale: 1,
      })
    }
  }, [inView, animationControl])

  return (
    <motion.div
      ref={ref}
      key={post._id}
      initial={{ scale: 0.5 }}
      animate={animationControl}

    >
      <Card
        sx={{ mb: 2.5 }}
        className={postStyles.post}
      >
        {
          post.coverURL ? (<CardMedia
            component="img"
            height="280"
            image={post.coverURL}
            alt={post.title}
          />) : null
        }
        <CardContent>
          <ActiveLink activeClassName={postStyles.postTitleActive} href={`/post/${post._id}`}>
            <Typography className={postStyles.postTitle} gutterBottom variant="h5" component="div">
              {post.title}
            </Typography>
          </ActiveLink>
          <Typography sx={{ mb: 1.5 }} variant="body2" color="text.secondary">
            {post.createdAt}
          </Typography>
          <Typography sx={{ wordWrap: 'break-word', wordBreak: 'break-all' }} variant="body1" color="text.secondary">
            {post.summary}
          </Typography>
        </CardContent>
        <CardActions>
          <Link href={`/post/${post._id}`} passHref>
            <Button size="large">开始阅读</Button>
          </Link>
        </CardActions>
      </Card>
    </motion.div>
  );
}

export default PostCard