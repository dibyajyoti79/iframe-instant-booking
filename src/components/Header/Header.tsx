import React, { useEffect, useRef, useState } from "react";
import { prevToPage2, prevToPage1 } from "../../redux/slices/StatusSlice";
import { useDispatch, useSelector } from "react-redux";
import widgetStyle from "../WidgetButton/WidgetButton.module.scss";
import styles from "./Header.module.scss";
import { setCurrency } from "../../redux/slices/CurrencySlice";
import endpoints from "../../API/endpoints";
import { be_instance } from "../../API/baseurl";

interface HeaderProps {
  openCloseBtn_ref: React.RefObject<HTMLDivElement>;
  widget_ref: React.RefObject<HTMLDivElement>;
  WIDGET_CONTAINER_BUTTON_LEFT_REF: React.RefObject<HTMLDivElement>;
  WIDGET_CONTAINER_MIDDLE_LEFT_REF: React.RefObject<HTMLDivElement>;
  status: number;
  topPos: string;
  position?: string;
}

const Header: React.FC<HeaderProps> = ({
  openCloseBtn_ref,
  widget_ref,
  WIDGET_CONTAINER_BUTTON_LEFT_REF,
  WIDGET_CONTAINER_MIDDLE_LEFT_REF,
  status,
  topPos,
  position,
}) => {
  const dispatch = useDispatch();

  // title
  let title = "";
  if (status === 1) {
    title = "Select Dates";
  } else if (status === 2) {
    title = "Room Type";
  } else if (status === 3) {
    title = "Checkout";
  }

  const { currency_code } = useSelector((state: any) => state.currency);

  //STATES
  const [currencyType, setSelectedCurrencyType] = useState<any>(currency_code);
  const [currencyList, setCurrencyList] = useState<any[]>([]);

  //REFS
  const currencyTypesList_ref = useRef<HTMLDivElement>(null);
  const chevronIconRef = useRef<HTMLDivElement>(null);

  // //EVENTS
  // const showCurrencyList = () => {
  //   const classList = currencyTypesList_ref.current?.classList;
  //   currencyTypesList_ref.current!.className = classList?.contains(
  //     styles.currencyTypesList
  //   )
  //     ? styles.currencyTypesListHeight
  //     : styles.currencyTypesList;
  // };

  const closeTheWidget = () => {
    if (position === "middle-left") {
      // WIDGET_CONTAINER_BUTTON_LEFT_REF.current!.style.display = `flex`;
      WIDGET_CONTAINER_MIDDLE_LEFT_REF.current!.style.transform = `translateX(-100%)`;
      return;
    }
    const widgetRef = widget_ref.current;
    const openCloseBtnRef = openCloseBtn_ref.current;

    if (widgetRef) {
      widgetRef.style.top = topPos === "bottom" ? "125vh" : "-125vh";
      widgetRef.style.opacity = "0";
      widgetRef.style.transition = `
        top 0.3s ease-in,
        opacity 0.3s ease-in
      `;
    }

    if (openCloseBtnRef) {
      openCloseBtnRef.classList.remove(widgetStyle.OPEN_CLOSE_BTN_NO_SEE);
      openCloseBtnRef.classList.add(widgetStyle.OPEN_CLOSE_BTN);
      // currencyTypesList_ref.current!.className = styles.currencyTypesList;
    }
  };

  // useEffect(() => {
  //   getCurrencyList();
  // }, []);

  // const getCurrencyList = async () => {
  //   try {
  //     const { data } = await be_instance.get(endpoints.fetchCurrencyList);
  //     if (data.status === 1) {
  //       setCurrencyList([...data.currency_details]);
  //     } else {
  //       console.log(data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const handleCurrencyType = (text: string, code: string) => {
  //   setSelectedCurrencyType(text);
  //   dispatch(setCurrency({ currency_code: text, currency_symbol: code }));
  //   showCurrencyList();
  // };

  const takeMeBack = () => {
    if (status === 2) dispatch(prevToPage1());
    else if (status === 3) dispatch(prevToPage2());
  };

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        {status === 3 && (
          <i
            className="bi bi-arrow-left"
            style={{
              cursor: "pointer",
              fontSize: "1.5rem",
              marginLeft: "0.5rem",
            }}
            onClick={takeMeBack}
          ></i>
        )}
        <div>{title}</div>
      </div>

      <div className={styles.right}>
        {/* <div className={styles.accordion}>
          <div id={styles.currencyType}>{currencyType}</div>
          <div ref={currencyTypesList_ref} className={styles.currencyTypesList}>
            {currencyList.map((cur) => {
              const codePoint = parseInt(cur.currency_symbol, 16);
              const icon = String.fromCodePoint(codePoint);
              const text = cur.currency_code;
              return (
                <React.Fragment key={icon}>
                  <div
                    className={
                      text == currencyType
                        ? styles.selectedCurrency
                        : styles.currencylist
                    }
                    onClick={() =>
                      handleCurrencyType(text, cur.currency_symbol)
                    }
                  >
                    {icon} {text}
                  </div>
                  <div
                  // style={{
                  //   width: "100%",
                  //   height: "1px",
                  //   background: "#E0E0E0",
                  //   margin: "0.5rem 0",
                  // }}
                  ></div>
                </React.Fragment>
              );
            })}
          </div>
          {!(status === 3) && (
            <i
              ref={chevronIconRef}
              className="bi bi-globe"
              onClick={showCurrencyList}
            ></i>
          )}
        </div> */}
        <div id={styles.currencyType}>{currencyType}</div>
        <i
          className="bi bi-x-lg"
          style={{ cursor: "pointer" }}
          onClick={closeTheWidget}
        ></i>
      </div>
    </div>
  );
};

export default Header;
