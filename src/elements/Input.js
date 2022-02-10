import React from "react";
import styled from "styled-components";

import { Text, Grid } from "./index";

const Input = (props) => {
  const { label, placeholder, _onChange, type, multiLine, value, radio ,name, _onClick } = props;
  console.log(name)

  if (multiLine) {
    return (
      <Grid>
        {label && <Text margin="0px">{label}</Text>}
        <ElTextarea
          row={10}
          value={value}
          placeholder={placeholder}
          onChange={_onChange}
        ></ElTextarea>
      </Grid>
    );
  }
  if (radio) {
    return (
      <Grid>
        <ElRadio type="radio" name="layout" value={value} onChange={_onClick}>레이아웃</ElRadio>
      </Grid>
    );
  }
  return (
    <React.Fragment>
      <Grid>
        {label && <Text margin="0px">{label}</Text>}
        <ElInput type={type} placeholder={placeholder} onChange={_onChange} />
      </Grid>
    </React.Fragment>
  );
};

Input.defaultProps = {
  multiLine: false,
  label: false,
  radio: false,
  placeholder: "텍스트를 입력해주세요.",
  type: "text",
  value: "",
  name:"name",
  _onChange: () => {},
  _onClick: () => {},
};
const ElTextarea = styled.textarea`
  border: 1px solid #212121;
  width: 100%;
  height: 120px;
  padding: 12px 4px;
  box-sizing: border-box;
`;

const ElRadio = styled.input`
`;

const ElInput = styled.input`
  border: 1px solid #212121;
  width: 100%;
  padding: 12px 4px;
  box-sizing: border-box;
`;

export default Input;
