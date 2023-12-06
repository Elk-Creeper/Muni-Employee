import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import './dashboard.css';
//import Calendar from './Calendar';
import image4 from '../assets/adminpic.png';
import image5 from '../assets/adminpic.png';
import image6 from '../assets/calendar.png';
import logo from '../assets/logo.png';
import notification from '../assets/icons/Notification.png';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, orderBy, query, limit } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsIqHHA8727cGeTjr0dUQQmttqJ2nW_IE",
  authDomain: "muniserve-4dc11.firebaseapp.com",
  projectId: "muniserve-4dc11",
  storageBucket: "muniserve-4dc11.appspot.com",
  messagingSenderId: "874813480248",
  appId: "1:874813480248:web:edd1ff1f128b5bb4a2b5cd",
  measurementId: "G-LS66HXR3GT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);


const Dashboard = ({ count }) => {

  // State to hold the fetched data
  const [data, setData] = useState([]);
  const [localData, setLocalData] = useState([]);

  // Function to fetch data from Firestore
  const fetchData = async () => {
    try {
      const appointmentsQuery = query(collection(firestore, "appointments"), orderBy("date", "desc"), limit(2)); // Limit to the latest 5 appointments
      const querySnapshot = await getDocs(appointmentsQuery);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(items);
      setLocalData(items); // Initialize localData with the fetched data
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);


  // State for currentDateTime
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update currentDateTime every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup the interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = currentDateTime.toLocaleTimeString();


  
  return (
    <div>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className='container'>
        <div className="header">
          <div className='icons'>
            <h1>Overview</h1>
              <img src={notification} alt="Notification.png" className='notif-icon'/>
              <img src={logo} alt="logo" className='account-img'/>
            <div className='account-name'><h1>Admin</h1></div>
          </div>
        </div>

        <div className="clock">
          <h4>Good day, It's</h4>
          <h2>{formattedTime}</h2>
        </div>

        <div className="news">
          News
        </div>

        <div className="image-admin">
          <img src={image4} alt="adminpic.png" />
          <img src={image5} alt="adminpic.png" />
        </div>

        <div className='subhead'>
          Service Requests
        </div>
        <div className="subhead">
          <div className="requests">
            {data.map((item) => (
              <div key={item.id} className="request-item">
                <div className="title">
                  <img src={logo} alt="logo" />
                  <h5>Appointment</h5>
                  <h3>{new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</h3>
                </div>
                <p>
                  {item.name} requested for {item.personnel} from {item.department} for an appointment on {new Date(item.date.seconds * 1000).toLocaleDateString()} at {new Date(item.time.seconds * 1000).toLocaleTimeString()} regarding {item.reason}.
                  Check the application for approval.
                </p>
                <a href='./appointments'><button className='check'>Check Now</button></a>
              </div>
            ))}
          </div>
          <div className="image-calendar">
            <img src={image6} alt="calendar.png" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;