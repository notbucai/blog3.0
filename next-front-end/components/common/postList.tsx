/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-12-10 21:34:34
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-10 21:38:40
 * @Description: 
 */

import { LoadingButton } from "@mui/lab";
import { BasicPost } from "../../model/post";
import PostCard from "./post";
import styles from './styles/postList.module.scss';


interface Props {
  list: BasicPost[];
  total: number;
  loading: boolean;

  onLoadNext?: () => void
}

const PostList = ({ list, total, loading, onLoadNext }: Props) => {

  return (
    <div>
      {
        list.map(post => {
          return (
            <PostCard post={post} key={post._id} />
          );
        })
      }
      {
        list.length < total
          ?
          <div className={styles.loadMore}>
            <LoadingButton loading={loading} size="large" variant="contained" color="error" onClick={() => onLoadNext && onLoadNext()}>加载更多</LoadingButton>
          </div>
          :
          null
      }
    </div>
  )
}

export default PostList;