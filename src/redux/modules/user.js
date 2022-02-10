//import 하기
import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

import { setCookie, getCookie, deleteCookie } from "../../shared/Cookie";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

import { auth } from "../../shared/firebase";

//actions 액션타입부터 만들기
const LOG_IN = "LOG_IN";
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";

//action creators 액션 생성 함수 만들기
// createAction(타입,파라미터 넘겨줌)
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));

//initialState 만들기 
const initialState = {
  user: null,
  is_login: false,
};

//middleware actions
const loginFB = (id, pwd) => {
  return function (dispatch, getState, { history }) {
    setPersistence(auth, browserSessionPersistence).then((res) => {
      signInWithEmailAndPassword(auth, id, pwd)
        .then((user) => {
          console.log(user);
          dispatch(
            setUser({
              user_name: user.user.displayName,
              id: id,
              user_profile: "",
              uid: user.user.uid,
            })
          );
          //로그인하고 메인페이지로 돌아감
          history.push("/");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          window.alert("아이디 혹은 비밀번호가 올바르지 않습니다.")
          console.log(errorCode, errorMessage);
        });
    });
  };
};

const signupFB = (id, pwd, user_name) => {
  return function (dispatch, getState, { history }) {
    createUserWithEmailAndPassword(auth, id, pwd)
      .then((user) => {
        console.log(user);
        updateProfile(auth.currentUser, {
          displayName: user_name,
        })
          .then(() => {
            dispatch(
              setUser({
                user_name: user_name,
                id: id,
                user_profile: "",
                uid: user.user.uid,
              })
            );
            history.push("/");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode, errorMessage);
      });
  };
};

const loginCheckFB = () => {
  return function (dispatch, getState, {history}){
    auth.onAuthStateChanged((user) => {
      if(user){
        dispatch(
          setUser({
            user_name: user.displayName,
            user_profile: "",
            id: user.email,
            uid: user.uid,
          })
        );
      }else{
        dispatch(logOut());
      }
    })
  }
}

const logoutFB = () => {
  return function (dispatch, getState, {history}) {
    auth.signOut().then(() => {
      dispatch(logOut());
      history.replace('/');
    })
  }
}

//리듀서 만들기
export default handleActions(
  {
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        setCookie("is_login", "success");
        draft.user = action.payload.user;
        draft.is_login = true;
      }),
    [LOG_IN]: (state, action) =>
      //원본값을 복사한 것을 넘겨준다
      produce(state, (draft) => {
        //원래 토큰이 들어감
        setCookie("is_login", "success");
        //payload 보낸 데이터가 담긴다
        draft.user = action.payload.user;
        draft.is_login = true;
      }),
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        deleteCookie("is_login");
        draft.user = null;
        draft.is_login = false;
      }),
    [GET_USER]: (state, action) => produce(state, (draft) => {}),
  },
  initialState
);

//action  Creators export
const actionCreators = {
  getUser,
  logOut,
  signupFB,
  loginFB,
  loginCheckFB,
  logoutFB,
};

export { actionCreators };
