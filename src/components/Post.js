import React from "react";
import { Grid, Image, Text, Button } from "../elements";
import { history } from "../redux/configureStore";
import { actionCreators as postActions } from "../redux/modules/post";
import { useDispatch } from "react-redux";

const Post = (props) => {
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex padding="16px">
          <Grid is_flex width="auto">
            <Image shape="circle" src={props.src} />
            <Text bold>{props.user_info.user_name}</Text>
          </Grid>
          <Grid is_flex width="auto">
            {props.is_me && (
              <Button
                width="auto"
                padding="4px"
                margin="4px"
                _onClick={() => {
                  history.push(`/write/${props.id}`);
                }}
              >
                수정
              </Button>
            )}
            {props.is_me && (
              <Button
                width="auto"
                padding="4px"
                margin="4px"
                _onClick={() => {
                  dispatch(postActions.deletePostFB(props.id));
                }}
              >
                삭제
              </Button>
            )}
            <Text>{props.insert_dt}</Text>
          </Grid>
        </Grid>
        <Grid>
          <Grid padding="16px">
            <Text>{props.contents}</Text>
          </Grid>
          <Grid>
            <Image shape="rectangle" src={props.image_url} />
          </Grid>
        </Grid>
        <Grid padding="16px">
          <Text bold>댓글 {props.comment_cnt}개</Text>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Post.defaultProps = {
  user_info: {
    user_name: "seoyeun",
    user_profile:
      "https://img2.daumcdn.net/thumb/R658x0.q70/?fname=https://t1.daumcdn.net/news/202112/09/joongang/20211209071323424vhum.jpg",
  },
  image_url:
    "hhttps://img2.daumcdn.net/thumb/R658x0.q70/?fname=https://t1.daumcdn.net/news/202112/09/joongang/20211209071323424vhum.jpg",
  contents: "오늘도 이겼다!",
  comment_cnt: 10,
  insert_dt: "2021-02-27 10:00:00",
  is_me: false,
};

export default Post;
