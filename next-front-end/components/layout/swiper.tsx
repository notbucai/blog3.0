/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-12-05 17:10:50
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-06 21:46:00
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
import swiperStyles from './swiper.module.scss'

const LayoutSwiper = () => {
  const resData = useRecoilValueLoadable(bannerState({}))

  return (
    <Container>
      <Swiper
        autoplay={{
          delay: 3500,
        }}
        modules={[Pagination, Autoplay, Lazy]}
        pagination={{ clickable: true }}
        className={swiperStyles.swiper}
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
                    <Card className={swiperStyles.swiperItem}>
                      <Image
                        className={swiperStyles.swiperImage}
                        src={post.coverURL || ''}
                        alt={post.title}
                        layout="fill"
                        loading="lazy"
                        objectFit="cover"
                        unoptimized
                      />
                      <div className={swiperStyles.cardMain}>
                        <CardContent>
                          <Typography className={swiperStyles.postTitle} gutterBottom variant="h4" component="div">
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

export default LayoutSwiper;