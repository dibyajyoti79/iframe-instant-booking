import React, { useEffect, useRef, useState } from "react";
import BjLogo from "../../assets/images/bjlogo.png";
import styles from "./WidgetButton.module.scss";
import BookingCalender from "../../pages/BookingCalender/BookingCalender";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Header/Header";
import RoomType from "../../pages/RoomType/RoomType";
import Checkout from "../../pages/Checkout/Checkout";
import { isBrowser, isMobile } from "react-device-detect";
import SuccessScreen from "../../pages/BookingSuccess/SuccessScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { be_instance } from "../../API/baseurl";
import endpoints from "../../API/endpoints";
import { setHotelInfo } from "../../redux/slices/HotelInfoSlice";
import moment from "moment";
import { setCheckIn, setCheckOut } from "../../redux/slices/CheckInOutSlice";
import { setCurrency } from "../../redux/slices/CurrencySlice";

interface WidgetButtonProps {
  position: string;
  logo: string;
  hotelId: number;
  apikey: string;
  theme: string;
}

const WidgetButton: React.FC<WidgetButtonProps> = (props) => {
  const { position, logo, hotelId, apikey, theme } = props;
  const { status } = useSelector((store: any) => store.status);
  const { booking_loader_status } = useSelector(
    (state: any) => state.bookingStatus
  );
  const { hotelInfo } = useSelector((state: any) => state.hotelInfo);

  const dispatch = useDispatch();

  const [STATUS, setSTATUS] = useState<number>(1);
  const [topPos, setTopPos] = useState<string>("bottom");

  const widget_ref = useRef<HTMLDivElement>(null);
  const WIDGET_CONTAINER_MIDDLE_LEFT_REF = useRef<HTMLDivElement>(null);
  const WIDGET_CONTAINER_BUTTON_LEFT_REF = useRef<HTMLDivElement>(null);
  const openCloseBtn_ref = useRef<HTMLDivElement>(null);

  const getPosition = (): { position: string; value: string }[] => {
    const [vertical, horizontal] = position.split("-");
    let objH;
    if (isMobile) {
      objH = {
        position: horizontal,
        value: "0px",
      };
    } else {
      objH = {
        position: horizontal,
        value: "25px",
      };
    }
    const objV = {
      position: vertical,
      value: "25px",
    };

    return [objV, objH];
  };

  useEffect(() => {
    if (!openCloseBtn_ref.current) return;
    getPosition().forEach(({ position, value }) => {
      (openCloseBtn_ref.current!.style as any)[position] = "25px";
    });
  }, [props]);

  useEffect(() => {
    if (!widget_ref.current) return;
    getPosition().forEach(({ position, value }) => {
      if (position === "left" || position === "right") {
        (widget_ref.current!.style as any)[position] = value;
      } else if (position === "top" || position === "bottom") {
        (widget_ref.current!.style as any)[position] =
          position === "bottom" ? "125vh" : "-125vh";
        setTopPos(position);
      }
    });
  }, [props]);

  const hexToRgb = (hex: string) => {
    const color = parseInt(hex.substring(1), 16);
    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;
    return { r, g, b };
  };

  useEffect(() => {
    if (!theme) return;
    const rgbColor = hexToRgb(theme);
    const { r, g, b } = rgbColor;
    const accent = `${r},${g},${b}`;
    // console.log();
    const root = document.documentElement;

    root?.style.setProperty("--main-color", theme);
    root?.style.setProperty("--color-accent-rgb", accent);
  }, [props]);

  useEffect(() => {
    if (!openCloseBtn_ref.current) return;
    const timeout = setTimeout(() => {
      openCloseBtn_ref.current!.style.display = "flex";
    }, 1000);

    return () => clearTimeout(timeout); // Clear the timeout when the component unmounts
  }, []);

  useEffect(() => {
    setSTATUS(status);
  }, [status]);

  const handleVisibility = () => {
    if (!widget_ref.current) return;
    if (isMobile) {
      widget_ref.current.style.top = "0.1%";
    } else {
      widget_ref.current.style.top = "3%";
    }
    widget_ref.current.style.opacity = "1";
    widget_ref.current.style.transition = `
      top 0.3s ease-in,
      opacity 0.3s ease-in,
      `;
    if (openCloseBtn_ref.current) {
      openCloseBtn_ref.current.className = styles.OPEN_CLOSE_BTN_NO_SEE;
    }
  };
  //-==================================== fetch hotel info ====================================-//
  const getHotelInfo = async () => {
    try {
      const { data } = await be_instance.get(
        `${endpoints.getHotelInfo}/${apikey}/${hotelId}`
      );
      if (data.status === 1) {
        dispatch(setHotelInfo(data.data));
        dispatch(
          setCurrency({
            currency_code: data.data?.currency_code,
            currency_symbol: data.data?.currency_symbol,
          })
        );
        const abd = data.data?.advance_booking_days;
        if (abd) {
          const new_checkin = moment().add(abd, "days").format("DD-MMM-YYYY");
          const new_checkout = moment()
            .add(abd + 1, "days")
            .format("DD-MMM-YYYY");
          // console.log(new_checkin, new_checkout);
          dispatch(setCheckIn(new_checkin));
          dispatch(setCheckOut(new_checkout));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (hotelId && apikey) {
      getHotelInfo();
    }
  }, []);

  const handleMiddleLeftWidget = () => {
    // if (
    //   WIDGET_BUTTON_MIDDLE_LEFT_REF.current!.style.transform == `translateX(0%)`
    // ) {
    //   WIDGET_BUTTON_MIDDLE_LEFT_REF.current!.style.transform = `translateX(-100%)`;
    // } else {
    // WIDGET_CONTAINER_BUTTON_LEFT_REF.current!.style.display = `none`;
    WIDGET_CONTAINER_MIDDLE_LEFT_REF.current!.style.transform = `translateX(0%)`;
    // }
  };
  return (
    <>
      <div
        className={styles.WIDGET_BUTTON_MIDDLE_LEFT}
        ref={WIDGET_CONTAINER_BUTTON_LEFT_REF}
        onClick={handleMiddleLeftWidget}
      >
        <span> B</span>
        <span> O</span>
        <span> O</span>
        <span> K</span>
        <span> N</span>
        <span> O</span>
        <span> W</span>
      </div>

      <div
        className={styles.WIDGET_CONTAINER_MIDDLE_LEFT}
        ref={WIDGET_CONTAINER_MIDDLE_LEFT_REF}
      >
        <>
          {!booking_loader_status && (
            <>
              {status !== 4 ? (
                <Header
                  openCloseBtn_ref={openCloseBtn_ref}
                  widget_ref={widget_ref}
                  WIDGET_CONTAINER_BUTTON_LEFT_REF={
                    WIDGET_CONTAINER_BUTTON_LEFT_REF
                  }
                  WIDGET_CONTAINER_MIDDLE_LEFT_REF={
                    WIDGET_CONTAINER_MIDDLE_LEFT_REF
                  }
                  status={STATUS}
                  topPos={topPos}
                  position="middle-left"
                />
              ) : null}
            </>
          )}

          {STATUS === 1 ? (
            <BookingCalender hotelId={hotelId} />
          ) : STATUS === 2 ? (
            <RoomType hotelId={hotelId} apikey={apikey} />
          ) : STATUS === 3 ? (
            <Checkout apikey={apikey} hotelId={hotelId} />
          ) : STATUS === 4 ? (
            <SuccessScreen />
          ) : (
            <></>
          )}
        </>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>

      {/* <div
        className={styles.OPEN_CLOSE_BTN}
        ref={openCloseBtn_ref}
        onClick={handleVisibility}
      >
        <div
          style={{
            backgroundImage: logo ? `url(${logo})` : `url(${BjLogo})`,
          }}
        ></div>
      </div>

      <div className={styles.widgetParentContainer} ref={widget_ref}>
        <>
          {!booking_loader_status && (
            <>
              {status !== 4 ? (
                <Header
                  openCloseBtn_ref={openCloseBtn_ref}
                  widget_ref={widget_ref}
                  WIDGET_CONTAINER_BUTTON_LEFT_REF={
                    WIDGET_CONTAINER_BUTTON_LEFT_REF
                  }
                  WIDGET_CONTAINER_MIDDLE_LEFT_REF={
                    WIDGET_CONTAINER_MIDDLE_LEFT_REF
                  }
                  status={STATUS}
                  topPos={topPos}
                />
              ) : null}
            </>
          )}

          {STATUS === 1 ? (
            <BookingCalender hotelId={hotelId} />
          ) : STATUS === 2 ? (
            <RoomType hotelId={hotelId} apikey={apikey} />
          ) : STATUS === 3 ? (
            <Checkout apikey={apikey} hotelId={hotelId} />
          ) : STATUS === 4 ? (
            <SuccessScreen />
          ) : (
            <></>
          )}
        </>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div> */}
    </>
  );
};

export default WidgetButton;
