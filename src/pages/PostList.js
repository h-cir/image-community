// PostList.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { Grid } from "../elements";
import Post from "../components/Post";

const PostList = (props) => {
  const dispatch = useDispatch();
  const post_list = useSelector((state) => state.post.list);
  const user_info = useSelector((state) => state.user.user);
  console.log(post_list)

  const { history } = props;

  //처음에 파이어베이스에 요청
  React.useEffect(() => {
    console.log("in list");
    // if (post_list.length === 0){   //이 부분을 없애도 되는지 확인할 것
    dispatch(postActions.getPostFB());
    // }
  }, []);

  return (
    <React.Fragment>
      <Grid bg={"#EFF6FF"} padding="20px 25%">
      {post_list.map((p, idx) => {
        if (p.user_info.user_id === user_info?.uid) {
          return (
            <Grid
              bg="#ffffff"
              margin="8px 0px"
              key={p.id}
              _onClick={() => {
                history.push(`/post/${p.id}`);
              }}
            >
              <Post key={p.id} {...p} is_me />
            </Grid>
          );
        } else {
          return (
            <Grid
              key={p.id}
              bg="#ffffff"
              _onClick={() => {
                history.push(`/post/${p.id}`);
              }}
            >
              <Post {...p} />
            </Grid>
          );
        }
      })}
      </Grid>
    </React.Fragment>
  );
};

export default PostList;
