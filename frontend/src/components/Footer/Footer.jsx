import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
         <div className="footer-content-left">
            <img className="footer-logo" src={assets.footer} alt="" />
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad tenetur eius quisquam! Facilis nihil, ab deleniti similique explicabo modi necessitatibus. Voluptas id dolorem nobis amet eum nesciunt reiciendis explicabo delectus!</p>
            <div className="footer-social-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a> 
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>  
            </div>
         </div>
         <div className="footer-content-center">
             <h2>COMPANY</h2>
             <ul>
                <a href="#"><li>Home</li></a>
                <a href="#"><li>About us</li></a>
                <a href="#"><li>Delivery</li></a>
                <a href="#"><li>Privacy policy</li></a>
             </ul>
         </div>
         <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+22 222 2222</li>
                    <li>contact@food.com</li>
                </ul>
         </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 © Food.com - All Rights Reserved. </p>
    </div>
  );
};

export default Footer;
