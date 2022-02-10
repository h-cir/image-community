import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { actionCreators as imageActions } from "./image";
import moment from "moment";

//필요한 액션 만들어주고
const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const DELETE_POST = "DELETE_POST";

const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));
const deletePost = createAction(DELETE_POST, (post_id) => ({ post_id }));

const initialState = {
  list: [],
};

// 게시글 하나에는 어떤 정보가 있어야 하는지 만들어 두기
const initialPost = {
  // id: 0,
  // user_info: {
  //   user_name: "seoyeun",
  //   user_profile:
  //     "https://img2.daumcdn.net/thumb/R658x0.q70/?fname=https://t1.daumcdn.net/news/202112/09/joongang/20211209071323424vhum.jpg",
  // },
  image_url:
    "hhttps://img2.daumcdn.net/thumb/R658x0.q70/?fname=https://t1.daumcdn.net/news/202112/09/joongang/20211209071323424vhum.jpg",
  contents: "",
  comment_cnt: 0,
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};

//firestore에 추가하는 함수
const getPostFB = () => {
  return function (dispatch, getState, { history }) {
    const postDB = collection(firestore, "post");

    getDocs(postDB).then((docs) => {
      let post_list = [];
      docs.forEach((doc) => {
        // 잘 가져왔나 확인하기! :)
        let _post = doc.data();
        // ['comment_cnt', 'contents', ..]
        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            if (cur.indexOf("user_") !== -1) {
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );
        post_list.push(post);
      });
      console.log(post_list);

      dispatch(setPost(post_list));
    });
  };
};

const addPostFB = (contents = "", layout="") => {
  return function (dispatch, getState, { history }) {
    const postDB = collection(firestore, "post");

    const _user = getState().user.user;

    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };

    const _post = {
      ...initialPost,
      contents: contents,
      layout: layout,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    const _image = getState().image.preview;

    const storageRef = ref(
      storage,
      `images/${user_info.user_id}_${new Date().getTime()}`
    );

    uploadString(storageRef, _image, "data_url").then((snapshot) => {
      getDownloadURL(snapshot.ref)
        .then((url) => {
          // dispatch(imageActions.uploadImage(url)); // 이 부분 없어도 되는지 확인
          console.log(url);
          return url;
        })
        .then((url) => {
          addDoc(postDB, { ...user_info, ..._post, image_url: url })
            .then((doc) => {
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              dispatch(addPost(post));
              history.replace("/");
              dispatch(imageActions.setPreview(null));
            })
            .catch((err) => {
              window.alert("포스트 작성에 문제가 있어요!");
              console.log("post 작성 실패!", err);
            });
        })
        .catch((err) => {
          window.alert("앗! 이미지 업로드에 문제가 있어요!");
          console.log("앗! 이미지 업로드에 문제가 있어요!", err);
        });
    });
  };
};

const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("게시물 정보가 없어요!");
      return;
    }
    const _image = getState().image.preview;

    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];

    const postRef = doc(firestore, "post", post_id);

    if (_image === _post.image_url) {
      updateDoc(postRef, post).then((doc) => {
        dispatch(editPost(post_id, { ...post }));
        history.replace("/");
      });

      return;
    } else {
      const user_id = getState().user.user.uid;
      const storageRef = ref(
        storage,
        `images/${user_id}_${new Date().getTime()}`
      );

      uploadString(storageRef, _image, "data_url").then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            console.log(url);
            return url;
          })
          .then((url) => {
            updateDoc(postRef, { ...post, image_url: url }).then((doc) => {
              dispatch(editPost(post_id, { ...post, image_url: url }));
              history.replace("/");
            });
          })
          .catch((err) => {
            window.alert("앗! 이미지 업로드에 문제가 있어요!");
            console.log("앗! 이미지 업로드에 문제가 있어요!", err);
          });
      });
    }
  };
};

const deletePostFB = (post_id = null) => {
  return function (dispatch, getState, { history }) {
    deleteDoc(doc(firestore, "post", post_id)).then((doc) => {
      dispatch(deletePost(post_id));
      history.replace("/");
      alert("삭제가 완료되었습니다!");
    });
  };
};

// reducer
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.post_list;
      }),
    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),
    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = draft.list.filter((e) => e.id !== action.payload.post_id);
      }),
  },
  initialState
);

// action creator export
const actionCreators = {
  setPost,
  addPost,
  editPost,
  deletePost,
  getPostFB,
  addPostFB,
  editPostFB,
  deletePostFB,
};

export { actionCreators };
