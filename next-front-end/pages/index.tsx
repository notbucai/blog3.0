import type { NextPage } from 'next'
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@material-ui/core'
import { getPosts } from '../http/posts'
import { BasicPost } from '../model/Post'

interface Props {
  list: BasicPost[],
  total: number
}

const Home: NextPage<Props> = ({ list = [], total = 0 }: Props) => {
  return (
    <div>
      <Typography gutterBottom variant="h5" component="div">
        全部文章
      </Typography>
      {
        list.map(post => {
          return (
            <Card sx={{ mb: 2.5 }} key={post._id}>
              {
                post.coverURL ? (<CardMedia
                  component="img"
                  height="140"
                  image={post.coverURL}
                  alt={post.title}
                />) : null
              }
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {post.title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} variant="body2" color="text.secondary">
                  {post.createdAt}
                </Typography>
                <Typography sx={{ wordWrap: 'break-word', wordBreak: 'break-all' }} variant="body1" color="text.secondary">
                  {post.summary}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="large">开始阅读</Button>
              </CardActions>
            </Card>
          );
        })
      }
    </div>
  )
}

export const getStaticProps = async () => {
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
      list: []
    }
  }
}

export default Home
