import Axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import Webcam from "react-webcam";
import "../styles/Facerecognition.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner,Button } from "react-bootstrap";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import { drawMesh } from "./utilities";
import { axiosInstance } from "../api";
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
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const webcamRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const [image, setImage] = React.useState(null);
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(null);
  const [captureButton, setCaptureButton] = React.useState(false);
const runFacemesh = async () => {
  // OLD MODEL
  // const net = await facemesh.load({
  //   inputResolution: { width: 640, height: 480 },
  //   scale: 0.8,
  // });
  // NEW MODEL
  const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
  setInterval(() => {
    detect(net);
  }, 100);
};
  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      // OLD MODEL
      //       const face = await net.estimateFaces(video);
      // NEW MODEL
      const face = await net.estimateFaces({ input: video });
      console.log(face);
      if (face.length > 0) { 
        console.log('the face is detected')
        if (captureButton === false) {
          setCaptureButton(true);
        }
      } else {
         if (captureButton ===true) {
           setCaptureButton(false);
         }
      }
      // Get canvas context
      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(() => {
        drawMesh(face, ctx);
      });
    }
  };

  React.useEffect(() => {
    runFacemesh();
  }, []);

  const sumbitPhoto = async () => {
    const file = await urltoFile(image, "image.png");
    console.log(file);
    if (file !== null) {
      const formData = new FormData();
      formData.append("picture", file);
      setLoading(true);
      axiosInstance
        .post(`${process.env.REACT_APP_API_URL}/api/v1/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            setUserData(res.data);
            toast.success("Person Identified ", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          } else {
            toast.error("Person Not Identified ", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const markAttendance = async (e) => {
    let data = new FormData();
    var today = new Date();
    data.append("year", today.getFullYear());
    data.append("month", today.getMonth() + 1);
    data.append("day", today.getDate());
    data.append("time", today.getHours() + ":" + today.getMinutes());
    data.append("user", userData.id);
    axiosInstance
      .post(`${process.env.REACT_APP_API_URL}/api/v1/attendence/`, data)
      .then((res) => {
        console.log(res.data.message);
        if (res.status === 200) {
          toast.success("Attendence Marked ", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        if (res.data.message === "Already Present") {
          toast.error("Already Present", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  };
  const goBack = () => { 
    setImage(null)
    setLoading(null)
    setUserData(null)
    console.log("goBack");
  }
  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);
  

  return (
    <>
      {isAuthenticated ? (
        <>
          {image ? (
            <>
              {!userData ? (
                <div className=" submit_photo_div d-flex justify-content-around align-items-center container-fluid mt-10   mw-100 mx-100">
                  <img className="detected-image" src={image} alt="" />
                  {/* Canvas is there just to get rid of the error react complaining about the canvas ref not being set find a better way later  */}
                  <canvas
                    ref={canvasRef}
                    style={{
                      position: "absolute",
                      marginLeft: "auto",
                      marginRight: "auto",
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      zindex: 8,
                      width: 640,
                      height: 480,
                    }}
                  />
                  {loading ? (
                    <div className="spinner-grow text-light" role="status">
                      <span className="visually-hidden"></span>
                    </div>
                  ) : (
                    <button
                      className="btn btn-outline-danger"
                      onClick={sumbitPhoto}
                    >
                      Submit Photo
                    </button>
                  )}
                </div>
              ) : (
                <div className="result_container mw-100 mx-100">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Email</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Roll No</th>
                        <th scope="col">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{userData?.email}</td>
                        <td>{userData?.first_name}</td>
                        <td>{userData?.last_name}</td>

                        <td>{userData?.roll_no}</td>

                        <td>{userData?.grade}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="w-100 d-flex justify-content-around ">
                    {" "}
                    <button
                      onClick={markAttendance}
                      className="btn btn-primary btn-lg"
                    >
                      Mark Attendence
                    </button>
                    <button className="btn btn-danger btn-lg" onClick={goBack}>
                      Go back
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="container mw-100 mx-100">
                <div className="webcam-Container d-flex justify-content-center align-items-center ">
                  <div className="">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: 640,
                        height: 480,
                      }}
                      imageSmoothing={true}
                      screenshotFormat="image/jpeg"
                      screenshotQuality={1}
                      videoConstraints={videoConstraints}
                    />
                    <canvas
                      ref={canvasRef}
                      style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 8,
                        width: 640,
                        height: 480,
                      }}
                    />
                  </div>
                  <div>
                    <Button
                      className={` btn btn-success btn-lg`}
                      disabled={!captureButton ? "disabled" : ""}
                      onClick={capture}
                    >
                      Capture photo
                    </Button>
                    <h5 className="text-bold">
                      {!captureButton
                        ? "Plzz wait for the FaceRecognition model to load "
                        : ""}
                    </h5>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
};

export default Facerecognition;
