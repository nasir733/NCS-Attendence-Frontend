import Axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import Webcam from "react-webcam";
import "../styles/Facerecognition.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [image, setImage] = React.useState(null);
  const [userData, setUserData] = React.useState(null);

  const sumbitPhoto = async () => {
    const file = await urltoFile(image, "image.png");
    console.log(file);
    if (file !== null) {
      const formData = new FormData();
      formData.append("picture", file);
      Axios.post(`${process.env.REACT_APP_API_URL}/api/v1/`, formData, {
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


          }
          else {
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
    data.append("user", userData.user.id);
    Axios.post(`${process.env.REACT_APP_API_URL}/api/v1/attendence/`, data)
      .then((res) => {
        console.log(res.data.message);
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
                  <button
                    className="btn btn-outline-danger"
                    onClick={sumbitPhoto}
                  >
                    Submit Photo
                  </button>
                </div>
              ) : (
                <div className="result_container mw-100 mx-100">
                  <img
                    className="result-image"
                    src={`${process.env.REACT_APP_API_URL}${userData.file}`}
                    alt=""
                  />
                  <table class="table">
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
                        <td>{userData?.user?.email}</td>
                        <td>{userData?.user?.first_name}</td>
                        <td>{userData?.user?.last_name}</td>

                        <td>{userData?.user?.roll_no}</td>

                        <td>{userData?.user?.grade}</td>
                      </tr>
                    </tbody>
                  </table>
                  <button
                    onClick={markAttendance}
                    className="btn btn-primary btn-lg"
                  >
                    Mark Attendence
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="container mw-100 mx-100">
                <div className="webcam-Container d-flex justify-content-center align-items-center ">
                  <div className="">
                    <Webcam
                      className="w-75 h-75"
                      audio={false}
                      height={720}
                      ref={webcamRef}
                      width={1280}
                      imageSmoothing={true}
                      screenshotFormat="image/jpeg"
                      screenshotQuality={1}
                      videoConstraints={videoConstraints}
                    />
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-success"
                      onClick={capture}
                    >
                      Capture photo
                    </button>
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
