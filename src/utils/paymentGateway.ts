import { toast } from "react-toastify";
import { be_instance } from "../API/baseurl";
import endpoints from "../API/endpoints";
import { useDispatch } from "react-redux";
import { nextToPage4 } from "../redux/slices/StatusSlice";
import {
  setBookingInvoiceId,
  setBookingLoaderStatus,
  setBookingStatus,
} from "../redux/slices/BookingStatusSlice";
//-==================================== easebuz payment integration ====================================-//
export const handleEasebuzPayment = async (
  access_key: string,
  setLoading: any,
  dispatch: any
) => {
  const res = await loadScript(
    "https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js"
  );
  if (!res) {
    toast.error("Somthing went wrong!");
    return;
  }
  const option_easebuzz = {
    access_key: access_key,
    onResponse: async (response: any) => {
      // console.log(response);
      dispatch(setBookingLoaderStatus(true));
      await handleEaseBuzzResponse(response, setLoading, dispatch);
    },
    theme: "var(--main-color)",
  };

  var easebuzzCheckout = new (window as any).EasebuzzCheckout(
    access_key,
    "prod"
  );
  easebuzzCheckout.initiatePayment(option_easebuzz);
};

//-==================================== razorpay payment integration ====================================-//
export const handleRazorpayPayment = async (
  orderid: any,
  setLoading: any,
  dispatch: any
) => {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    toast.error("Somthing went wrong!");
    return;
  }
  const options = {
    key: "rzp_test_kYzro6v3xfkAlE",
    order_id: orderid,
    handler: async function (response: any) {
      // console.log(response);
      dispatch(setBookingLoaderStatus(true));
      await verifyPaymentDetails(response, setLoading, dispatch);
    },
    modal: {
      ondismiss: function () {
        dispatch(setBookingLoaderStatus(true));
        dispatch(setBookingStatus(false));
        dispatch(nextToPage4());
      },
    },
    theme: {
      color: "var(--main-color)",
    },
  };
  const paymentObject = new (window as any).Razorpay(options);
  paymentObject.open();
};

//-==================================== api call for store payment details ====================================-//
const verifyPaymentDetails = async (
  transaction: any,
  setLoading: any,
  dispatch: any
) => {
  try {
    const { data } = await be_instance.post(
      endpoints.razorpayResponse,
      transaction
    );
    // console.log(data);
    if (data.status === 1) {
      dispatch(setBookingStatus(true));
      dispatch(setBookingInvoiceId(data.invoice_id));
      dispatch(nextToPage4());
    } else {
      dispatch(setBookingStatus(false));
      dispatch(nextToPage4());
    }
  } catch (err: any) {
    toast.error("Somthing went wrong!");
    // alert(err.message);
  }
};

const handleEaseBuzzResponse = async (
  transaction: any,
  setLoading: any,
  dispatch: any
) => {
  try {
    const { data } = await be_instance.post(
      endpoints.easebuzzResponse,
      transaction
    );
    if (data.status === 1) {
      dispatch(setBookingStatus(true));
      dispatch(setBookingInvoiceId(data.invoice_id));
      dispatch(nextToPage4());
    } else {
      dispatch(setBookingStatus(false));
      dispatch(nextToPage4());
    }
    // setLoading(false);
    // setBookingLoader(false);
  } catch (err: any) {
    toast.error("Somthing went wrong!");
    // alert(err.message);
  }
};

export function loadScript(src: any) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}
