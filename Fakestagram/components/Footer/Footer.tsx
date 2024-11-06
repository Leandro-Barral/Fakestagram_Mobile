import { useNavigate } from "react-router-dom";
import React from "react";
import './Footer.css';
import Logout from "../Logout/logout.tsx";

const Footer = ({ onOpenModal }) => {
    const navigate = useNavigate();

    return (
        <div className="footer">
            <button onClick={() => { navigate("/myfeed") }}>
                <img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" alt="Feed" className="icon" />
            </button>

            <button onClick={() => { navigate("/myprofile") }}>
                <img src="https://i.pinimg.com/736x/37/8a/27/378a270e775265622393da8c0527417e.jpg" alt="Profile" className="profile-picture" />
            </button>
            <button className="logout-button">
                <Logout className="logout-button"></Logout>
            </button>
        </div>
    );
};

export default Footer;
