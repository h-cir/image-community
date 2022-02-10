import React from "react";
import { Grid, Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import image, { actionCreators as imageActions } from "../redux/modules/image";

const PostWrite = (props) => {
  const dispatch = useDispatch();
  const is_login = useSelector((state) => state.user.is_login);
  const preview = useSelector((state) => state.image.preview);
  const post_list = useSelector((state) => state.post.list);

  const post_id = props.match.params.id;
  const is_edit = post_id ? true : false;

  const { history } = props;

  let _post = is_edit ? post_list.find((p) => p.id === post_id) : null;
  const [contents, setContents] = React.useState(_post ? _post.contents : "");
  const [layout, setLayout] = React.useState("");
  React.useEffect(() => {
    if (is_edit && !_post) {
      window.alert("포스트 정보가 없어요!")
      history.goBack();

      return;
    }
    //수정모드일 때 미리보기
    if (is_edit) {
      dispatch(imageActions.setPreview(_post.image_url));
    }
  }, []);

  const changeContents = (e) => {
    setContents(e.target.value);
  };

  const addPost = () => {
    if (contents === ""|| layout === "") {
      window.alert(
        "게시글 작성란이 비어있거나 레이아웃이 선택되지 않았습니다. 확인해주세요!"
      );
      return;
    }
    dispatch(postActions.addPostFB(contents, layout));
  };

  const editPost = () => {
    if (contents === "" || layout === "") {
      window.alert(
        "게시글 작성란이 비어있거나 레이아웃이 선택되지 않았습니다. 확인해주세요!"
      );
      return;
    }

    dispatch(
      postActions.editPostFB(post_id, {contents},layout)
    );
  };

  if (!is_login) {
    return (
      <Grid padding="20px 25%">
        <Text size="32px" bold>
          앗! 잠깐!
        </Text>
        <Text size="16px">로그인 후에만 글을 쓸 수 있어요!</Text>
        <Button
          text="로그인하러 가기"
          _onClick={() => {
            history.replace("/login");
          }}
        >
          로그인 하러가기
        </Button>
      </Grid>
    );
  }
  return (
    <React.Fragment>
      <Grid padding="20px 25%">
        <Text margin="0px" size="36px" bold>
          {is_edit ? "게시글 수정" : "게시글 작성"}
        </Text>
        <Upload />
      </Grid>

      <Grid padding="20px 25%">
        <Grid>
          <Text margin="0px" size="24px" bold>
            미리보기
          </Text>
        </Grid>
        <Grid>
          <Grid>
            <Input
              type="radio"
              radio={true}
              name="layout"
              value="right"
              label="이미지가 오른쪽"
              _onClick={() => {
                setLayout("right");
              }}
            />
          </Grid>
          <Grid is_flex>
            <Text margin="0px" size="20px" bold>{contents ? contents : "텍스트"}</Text>
            <Image
              shape="rectangle"
              src={preview ? preview : "http://via.placeholder.com/400x300"}
            />
          </Grid>
        </Grid>
        <Grid>
          <Input
            type="radio"
            radio={true}
            name="layout"
            value="left"
            label="이미지가 왼쪽"
            _onClick={() => {
              setLayout("left");
            }}
          />
          <Grid is_flex>
            <Image
              shape="rectangle"
              size="30%"
              src={preview ? preview : "http://via.placeholder.com/400x300"}
            ></Image>
            <Text margin="0px" size="20px" bold>
              {contents ? contents : "텍스트"}
            </Text>
          </Grid>
        </Grid>
        <Grid>
          <Input
            type="radio"
            radio={true}
            name="layout"
            value="center"
            label="가운데 정렬"
            _onClick={() => {
              setLayout("center");
            }}
          />
          <Grid>
            <Text margin="0px" size="20px" bold>
              {contents ? contents : "텍스트"}
            </Text>
            <Image
              shape="rectangle"
              size="30%"
              src={preview ? preview : "http://via.placeholder.com/400x300"}
            ></Image>
          </Grid>
        </Grid>
      </Grid>

      <Grid padding="20px 25%">
        <Input
          value={contents}
          _onChange={changeContents}
          label="게시글 내용"
          placeholder="게시글 작성"
          multiLine
        />
      </Grid>

      <Grid padding="20px 25%">
        {is_edit ? (
          <Button text="게시글 수정" _onClick={editPost}></Button>
        ) : (
          <Button text="게시글 작성" _onClick={addPost}></Button>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default PostWrite;
