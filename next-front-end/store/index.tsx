import { atomFamily } from "recoil";
import { getHotPosts } from "../http/posts";

export const bannerState = atomFamily({
  key: 'banner',
  default: () => {
    return getHotPosts()
  }
});
