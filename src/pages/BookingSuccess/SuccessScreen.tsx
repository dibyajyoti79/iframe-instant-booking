import React, { useEffect, useState } from "react";
import background from "../assets/images/success-bg.png";
import styles from "./BookingSuccess.module.scss";
import Lottie from "react-lottie-player";
import checklottie from "../../assets/images/check.json";
import cancledlottie from "../../assets/images/canceled.json";
import { useDispatch, useSelector } from "react-redux";
import { prevToPage2 } from "../../redux/slices/StatusSlice";
import { resetRoomPayload } from "../../redux/slices/RoomSlice";
import { ThreeDots } from "react-loader-spinner";
import { be_instance } from "../../API/baseurl";
import endpoints from "../../API/endpoints";
import { toast } from "react-toastify";
import { setBookingLoaderStatus } from "../../redux/slices/BookingStatusSlice";
const SuccessScreen = () => {
  const { booking_status, booking_loader_status, booking_invoice_id } =
    useSelector((state: any) => state.bookingStatus);
  const [loading, setLoading] = useState<boolean>(true);
  const [invoice, setInvoice] = useState<string>("");
  const [invoiceDetails, setInvoiceDetails] = useState<any>();
  const [currency, setCurrency] = useState<string>("");
  const dispatch = useDispatch();
  const invoice_id = 1212312;

  //-==================================== handleBookAgain ====================================-//
  const handleBookAgain = () => {
    dispatch(prevToPage2());
    dispatch(resetRoomPayload());
  };

  //-==================================== fetch booking details ====================================-//
  const fetchBookingDetails = async () => {
    try {
      const { data } = await be_instance.get(
        `${endpoints.bookingInvoicDetails}/${booking_invoice_id}`
      );
      if (data.status === 1) {
        setInvoiceDetails(data.booking_details);
      }
      dispatch(setBookingLoaderStatus(false));
    } catch (err) {
      toast.error("Somthing went wrong!");
    }
  };

  //-==================================== fetch invoice ====================================-//
  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const { data } = await be_instance.get(
        `${endpoints.invoiceData}/${booking_invoice_id}`
      );
      if (data.status === 1) {
        setInvoice(data.data);
      }
      dispatch(setBookingLoaderStatus(false));
    } catch (err) {
      toast.error("Somthing went wrong!");
    }
  };

  //-==================================== download invoice ====================================-//
  const downloadDetails = () => {
    let printContents, popupWin;
    printContents = invoice;
    popupWin = window.open("", "_blank", "top=0,left=0,height=100%,width=auto");
    popupWin!.document.open();
    popupWin!.document.write(`
          <html>
              <head>
              <title>Print tab</title>
              <style>
              //........Customized style.......
              </style>
              </head>
          <body onload="window.print();window.close()">${printContents}</body>
          </html>`);
    // popupWin!.document.close();
  };
  useEffect(() => {
    if (invoiceDetails) {
      const codePoint = parseInt(invoiceDetails.currency_symbol, 16);
      const icon = String.fromCodePoint(codePoint);
      setCurrency(icon);
    }
  }, [invoiceDetails]);

  useEffect(() => {
    // console.log(booking_status, booking_invoice_id);
    if (booking_status && booking_invoice_id !== null) {
      fetchBookingDetails();
      fetchInvoice();
    } else {
      dispatch(setBookingLoaderStatus(false));
    }
  }, []);

  return (
    <>
      {booking_loader_status ? (
        // <div
        //   style={{
        //     height: "100%",
        //     width: "100%",
        //     display: "flex",
        //     flexDirection: "column",
        //     justifyContent: "center",
        //     alignItems: "center",
        //   }}
        // >
        //   <ThreeDots
        //     height="80"
        //     width="80"
        //     radius="9"
        //     color="#565656"
        //     ariaLabel="three-dots-loading"
        //     wrapperStyle={{}}
        //     wrapperClass=""
        //     visible={true}
        //   />
        //   <div className={styles.Verifying_txt}>
        //     Veifying your payment details please wait...!
        //   </div>
        // </div>
        <div className={styles.loader_container}>
          <div className={styles.loader_content}>
            <div className={styles.loader}></div>
            <span className={styles.texthold}>Hold On! </span>
            <span className={styles.textStatus}>
              We are getting you booking status...⏳
            </span>
            <span className={styles.textclose}>
              Please don&apos;t close or refresh the window.
            </span>
          </div>
        </div>
      ) : (
        <>
          {!booking_status ? (
            <>
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Lottie
                  loop
                  animationData={cancledlottie}
                  play
                  style={{ width: 150, height: 150 }}
                />
                <div className={styles.Verifying_txt}>
                  Your booking has been failed...!
                </div>
                <div style={{ width: "50%", marginTop: "3rem" }}>
                  <div
                    className={styles.bookagain_btn}
                    onClick={handleBookAgain}
                  >
                    <div className={styles.btn_text}>Book Again</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.booking_success}>
                <div className={styles.lottie_container}>
                  <Lottie
                    loop
                    animationData={checklottie}
                    play
                    style={{ width: 150, height: 150 }}
                  />
                </div>
                <div className={styles.clouds}></div>
              </div>

              <div className={styles.bottom_container}>
                <div className={styles.booking_success_text}>
                  Booking Successful
                </div>
                <div className={styles.emailtext}>
                  An Email has been sent to you containing your booking details
                </div>

                <div className={styles.voucherbtn} onClick={downloadDetails}>
                  <i className="bi bi-filetype-pdf"></i>

                  <div className={styles.vouchertext}>Download Voucher</div>
                </div>

                <div className={styles.amount_header}>Total Amount</div>
                <div className={styles.amount_price}>
                  {currency} {invoiceDetails?.paid_amount}
                </div>
                <div className={styles.booking_id}>
                  Booking ID: {invoiceDetails?.booking_id}
                </div>
              </div>
              <div className={styles.bookagain_btn} onClick={handleBookAgain}>
                <div className={styles.btn_text}>Book Again</div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default SuccessScreen;
