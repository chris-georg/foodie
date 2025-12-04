import React, { useContext } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContextContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={url + "/images/" + image}
          alt=""
        />
        {!cartItems[id] ? (
          <i className="fas fa-plus add" onClick={() => addToCart(id)}></i>
        ) : (
          <div className="food-item-counter">
            <i
              onClick={() => removeFromCart(id)}
              className="fas fa-minus"
              style={{
                color: "red",
                backgroundColor: "rgba(241, 172, 172, 1)",
                borderRadius: "50%",
                padding: "5px",
              }}
            ></i>
            <p>{cartItems[id]}</p>
            <i
              onClick={() => addToCart(id)}
              className="fas fa-plus"
              style={{
                color: "green",
                backgroundColor: "rgb(171, 233, 171)",
                borderRadius: "50%",
                padding: "5px",
              }}
            ></i>
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <div className="star">
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star-half-alt"></i>
          </div>
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;