import React, { useEffect, useState } from "react";
import styles from "./Button.module.scss";
import { Oval } from "react-loader-spinner";
interface ButtonProps {
  btnClick: () => void;
  btnText: string;
  roomNo?: number;
  pageNo?: number;
  totalPrice?: number;
  btnDisabled?: boolean;
  currencyIcon?: string;
  totalPerson?: number;
  clearCart?: () => void;
  roomdata?: any;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  btnClick,
  btnText,
  roomNo,
  pageNo,
  totalPrice,
  currencyIcon,
  btnDisabled,
  clearCart,
  totalPerson,
  roomdata,
  isLoading,
}) => {
  let icon = "";
  if (currencyIcon) {
    const codePoint = parseInt(currencyIcon, 16);
    icon = String.fromCodePoint(codePoint);
  }
  const [show, setShow] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (roomdata) {
      const totalRooms = roomdata.filter((room: any) => {
        return room.rooms.length > 0 ? room : null;
      });
      setRooms(totalRooms);
    }
  }, [roomdata]);

  const handleToggle = () => {
    if (rooms.length > 0) {
      setShow(!show);
    }
  };
  return (
    <div className={styles.customBtn}>
      <div
        className={styles.totalInfo}
        style={pageNo === 1 ? { display: "none" } : { display: "flex" }}
      >
        <div className={styles.cartItems} onClick={handleToggle}>
          <i className={`bi bi-door-closed ${styles.icon}`}></i>
          <span className={styles.text}>{roomNo}</span>
          <span className={styles.circle}></span>
          <i className={`bi bi-person ${styles.icon}`}></i>
          <span className={styles.text}>{totalPerson}</span>
          <span className={styles.circle}></span>
          <i className={`bi bi-eye ${styles.icon}`}></i>
        </div>
        <div
          onClick={handleToggle}
          className={styles.cartItems}
          style={pageNo === 3 ? { display: "none" } : { display: "flex" }}
        >
          <span className={styles.text}>
            {icon}
            {totalPrice}
          </span>
        </div>
        <div
          className={styles.cartItems}
          style={
            pageNo === 3 || btnDisabled
              ? { display: "none" }
              : { display: "flex" }
          }
          onClick={clearCart}
        >
          <i className={`bi bi-trash ${styles.icon}`}></i>
        </div>
      </div>
      <div className={show ? styles.accordion : styles.hideaccordion}>
        <div className={styles.header}>
          <div className={styles.headertext}>Room Details</div>
          <div onClick={handleToggle}>
            <i className={`bi bi-x-lg ${styles.headericon}`}></i>
          </div>
        </div>
        {rooms &&
          rooms.map((room: any, index: number) => {
            const room_price = room.rooms.reduce((acc: any, room: any) => {
              const price = room.room_price.reduce((acc: any, price: any) => {
                return acc + price.price;
              }, 0);
              return acc + price;
            }, 0);
            const adults = room.rooms.reduce((acc: any, room: any) => {
              return acc + room.adults;
            }, 0);
            const childs = room.rooms.reduce((acc: any, room: any) => {
              return acc + room.childs;
            }, 0);
            return (
              <div className={styles.roomContainer} key={index}>
                <div className={styles.leftContainer}>
                  <div className={styles.roomType}>{room.roomType}</div>
                  <div className={styles.mealPlan}>{room.mealPlanName}</div>
                  <div className={styles.person}>
                    <div>
                      <span className={styles.rooms}>Adult </span>{" "}
                      <span className={styles.price}>{adults},</span>{" "}
                      <span className={styles.rooms}>Child </span>{" "}
                      <span className={styles.price}>{childs}</span>{" "}
                    </div>
                    <div>
                      <span className={styles.price}>{room.rooms.length}</span>{" "}
                      <span className={styles.rooms}>Rooms</span>{" "}
                    </div>
                  </div>
                </div>
                <div className={styles.rightContainer}>
                  <div className={styles.rooms}>Total</div>
                  <div className={styles.roomType}>
                    <i className="bi bi-currency-rupee"></i>
                    {room_price}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div
        className={btnDisabled ? styles.disbled : styles.button}
        onClick={() => btnClick()}
      >
        {btnText}
        <div style={{ marginLeft: "5px" }}></div>
        {isLoading && (
          <Oval
            height={25}
            width={25}
            color="#fff"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#fff"
            strokeWidth={5}
            strokeWidthSecondary={2}
          />
        )}
      </div>
    </div>
  );
};

export default Button;
