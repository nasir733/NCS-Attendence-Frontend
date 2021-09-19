import Axios from 'axios';
import React from 'react'
import { ToastContainer, toast } from "react-toastify";

const ViewAttendence = () => {
    React.useEffect(() => {
     fetchAttendence();
    }, [])
       const fetchAttendence = async () => {
         try {
           const res = await Axios.get(
             `${process.env.REACT_APP_API_URL}/api/v1/see_all_attendence`
           );
           console.log(res.data);
         } catch (error) {
           console.log(error);
         }
       };
    return (
        <div>
            <h1>Hello</h1>
        </div>
    )
}

export default ViewAttendence;
