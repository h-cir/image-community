import React from "react";
import { Button } from "../elements";
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";

import { actionCreators as imageActions } from "../redux/modules/image";

const Upload = (props) => {
  const dispatch = useDispatch();
  const is_uploading = useSelector((state) => state.image.uploading);
  const fileInput = React.useRef();
  const selectFile = (e) => {
    // e.target은 input이죠!
    // input이 가진 files 객체를 살펴봅시다.
    console.log(e.target.files);
    // 선택한 파일이 어떻게 저장되어 있나 봅시다.
    console.log(e.target.files[0]);
    // ref로도 확인해봅시다. :)
    console.log(fileInput.current.files[0]);
    
    const reader = new FileReader();
    const file = fileInput.current.files[0]; 

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      console.log(reader.result);
      dispatch(imageActions.setPreview(reader.result));
    }
  };

  const uploadFB = () => {
    if (!fileInput.current || fileInput.current.files.length === 0) {
      window.alert("파일을 선택해주세요!");
      return;
    }
    let image = fileInput.current?.files[0];

    const storageRef = ref(storage, `images/${image.name}`);
    const _upload = uploadBytes(storageRef, image);

    //   업로드!
    _upload.then((snapshot) => {
      console.log(snapshot);

      // 업로드한 파일의 다운로드 경로를 가져오자!
      getDownloadURL(snapshot.ref).then((url) => {
        console.log(url);
      });
    });
    dispatch(imageActions.uploadImageFB(fileInput.current.files[0]));
  };
  
  return (
    <React.Fragment>
      <input type="file" ref={fileInput} onChange={selectFile} disabled={is_uploading}/>
      {/* <Button _onClick={uploadFB} text="업로드하기"></Button> */}
    </React.Fragment>
  );
};

export default Upload;
