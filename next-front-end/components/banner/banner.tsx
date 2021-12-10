/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-12-05 17:10:50
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-10 19:53:58
 * @Description: 
 */
import { Button, Card, CardActions, CardContent, Container, Typography } from '@mui/material';
import Image from 'next/image'
import Link from 'next/link'
import { useRecoilValueLoadable } from 'recoil';
import { Autoplay, Lazy, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { bannerState } from '../../store';
import styles from './style.module.scss'

const Banner = () => {
  const resData = useRecoilValueLoadable(bannerState({}))

  return (
    <Container>
      <Swiper
        autoplay={{
          delay: 3500,
        }}
        modules={[Pagination, Autoplay, Lazy]}
        pagination={{ clickable: true }}
        className={styles.swiper}
      >
        {
          resData.state === 'hasValue'
            ?
            resData.getValue().list
              .filter(post => typeof post.coverURL === 'string')
              .map(post => {
                return (
                  <SwiperSlide
                    key={post._id}
                  >
                    <Card className={styles.swiperItem}>
                      <Image
                        className={styles.swiperImage}
                        src={post.coverURL || ''}
                        alt={post.title}
                        layout="fill"
                        loading="lazy"
                        objectFit="cover"
                        unoptimized
                      />
                      <div className={styles.cardMain}>
                        <CardContent>
                          <Typography className={styles.postTitle} gutterBottom variant="h4" component="div">
                            {post.title}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Link href={`/post/${post._id}`} passHref>
                            <Button sx={{ borderRadius: 10 }} size="large" variant="contained" color="error">阅读全文</Button>
                          </Link>
                        </CardActions>
                      </div>
                    </Card>
                  </SwiperSlide>
                )
              }) : null
        }
      </Swiper>
    </Container>
  )
}

export default Banner;