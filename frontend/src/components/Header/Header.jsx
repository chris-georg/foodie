import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-content">
        <h2>Order your favourite food here</h2>
        <p>
          Browse through our wide range of delicious options and choose the meal
          that speaks to your taste today. Whether you're craving something
          spicy, something sweet, or a comforting classic, we’ve arranged our
          menu into easy categories to help you find exactly what you want.{" "}
        </p>
        <a href="#explore-menu">
          <button>View Menu</button>
        </a>
      </div>
    </div>
  );
};

export default Header;
