import React from "react";
import { Button, Grid, Input, Text } from "../elements";
import { getCookie, setCookie} from "../shared/Cookie";
import {actionCreators as userActions} from "../redux/modules/user";
import { useDispatch } from "react-redux";

const Login = (props) => {
  const dispatch = useDispatch();
  const [id, setId] = React.useState("");
  const [pwd, setPwd] = React.useState("");

  //액션함수 가져옴 
  const login = () => {
    if (id === "" || pwd === ""){
      window.alert("아이디 혹은 비밀번호가 공란입니다! 입력해주세요!");
      return;
    }
    dispatch(userActions.loginFB( id, pwd));
}

  return (
    <React.Fragment>
      <Grid padding="16px">
        <Grid>
          <Text size="32px" bold type="heading">
            로그인
          </Text>
        </Grid>
        <Grid padding="16px 0px">
          <Input
            label="아이디"
            placeholder="아이디를 입력해주세요."
            _onChange={(e) => {
              setId(e.target.value);
            }}
          />
        </Grid>

        <Grid padding="16px 0px">
          <Input
            label="패스워드"
            placeholder="패스워드 입력해주세요."
            type="password"
            _onChange={(e) => {
              setPwd(e.target.value);
            }}
          />
        </Grid>
        <Button
          text="로그인하기"
          _onClick={() => {
              console.log("로그인됐냐 로그인됐냐구")
              login();
          }}
        ></Button>
      </Grid>
    </React.Fragment>
  );
};

export default Login;
