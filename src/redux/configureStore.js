import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

import User from "./modules/user"; //user reducer 추가
import Post from "./modules/post"; //post reducer 추가
import Image from "./modules/image"; //image reducer 추가

//히스토리 객체 만들기
export const history = createBrowserHistory();

//rootReducer 만들고, 히스토리 객체 넣어주기
const rootReducer = combineReducers({
    user: User,
    post: Post,
    image: Image,
    router: connectRouter(history), //만든 히스토리랑 라우터 연결, 스토어에 저장됨 
});

//미들웨어 준비 사용할 미들웨어 넣어주기
const middlewares = [thunk.withExtraArgument({history:history})]; //청크가 단계를 만들어준다

// 지금이 어느 환경인 지 알려줘요. (개발환경, 프로덕션(배포)환경 ...)
const env = process.env.NODE_ENV;

// 개발환경에서는 로거라는 걸 하나만 더 써볼게요.(require 패키지 가지고올때 사용 개발환경에서만 사용하려고 이거 씀)
if (env === "development") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

//redux devTools 설정
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

//미들웨어 묶기
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

//스토어 만들기
let store = (initialStore) => createStore(rootReducer, enhancer);

export default store();
 