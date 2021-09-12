import Axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min'
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};
function urltoFile(url, filename, mimeType) {
  mimeType = mimeType || (url.match(/^data:([^;]+);/) || "")[1];
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
}
const Facerecognition = () => {
    const isAuthenticated  = useSelector(state => state.auth.isAuthenticated)
    const webcamRef = React.useRef(null);
    const [image, setImage] = React.useState(null);

    const sumbitPhoto = async () => {
        const file = await urltoFile(image, "image.png");
        console.log(file);
        if (file !== null) {
            const formData = new FormData();
            formData.append("picture", file);
            Axios.post(`${process.env.REACT_APP_API_URL}/api/v1/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
                .then(res => {
                    console.log(res.data);
                })
                .catch(err => {
                    console.log(err);
                });
        }

    }
    const capture = React.useCallback(async () => {
        
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
        //      let formdata = new FormData();
        // urltoFile(imageSrc, "a.png").then(function (file) {
        //     console.log(file, "file");
        //     formdata.append("picture", file);
        // });
        //    const config = {
        //      headers: {
        //        "Content-Type": "application/json",
        //      },
        //    };
        //  try {
        //      const res = await Axios.post(
        //        `${process.env.REACT_APP_API_URL}/api/v1/`,
        //        formdata,
        //        config
        //      );
        //      console.log(res.data);
        //  } catch (error) {
        //      console.log(error);
        //  }
             
         
     }, [webcamRef]);
    return (
      <>
        {isAuthenticated ? (
          <>
            {image ? (
              <>
                <img src={image} alt="" />

                <button onClick={sumbitPhoto}>Submit Photo</button>
              </>
            ) : (
              <>
                <Webcam
                  audio={false}
                  height={720}
                  ref={webcamRef}
                  width={1280}
                  imageSmoothing={true}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={1}
                  videoConstraints={videoConstraints}
                />
                <button onClick={capture}>Capture photo</button>
              </>
            )}
          </>
        ) : (
          <Redirect to="/login" />
        )}
      </>
    );
}

export default Facerecognition
