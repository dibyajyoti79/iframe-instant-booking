import React, { useEffect, useState } from "react";
import styles from "./Checkout.module.scss";
import Button from "../../components/Button/Button";
import CheckInOut from "../../components/CheckInOut/CheckInOut";
import CustomTextField from "../../components/CustomTextField/CustomTextFied";
import { useDispatch, useSelector } from "react-redux";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import moment from "moment";
import axios from "axios";
import { nextToPage4 } from "../../redux/slices/StatusSlice";
import { setTotalRoomPrice } from "../../redux/slices/RoomSlice";
import { setTransaction } from "../../redux/slices/TransactionSlice";
import { ToastContainer, toast } from "react-toastify";
import { be_instance } from "../../API/baseurl";
import endpoints from "../../API/endpoints";
import Modal from "react-bootstrap/Modal";

import {
  handleEasebuzPayment,
  handleRazorpayPayment,
} from "../../utils/paymentGateway";
import { setBookingLoaderStatus } from "../../redux/slices/BookingStatusSlice";
import Policies from "../../components/Policies/Policies";
interface CheckoutProps {
  apikey: string;
  hotelId: number;
}

const Checkout = ({ apikey, hotelId }: CheckoutProps) => {
  // console.log("apikey", apikey);
  const { roomDetails, totalPrice, totalnoOfRooms, totalnoOfPersons } =
    useSelector((state: any) => state.roomDetails);

  const { checkIndate, checkOutdate } = useSelector(
    (state: any) => state.checkInOut
  );
  const { currency_symbol, currency_code } = useSelector(
    (state: any) => state.currency
  );
  const { booking_loader_status } = useSelector(
    (state: any) => state.bookingStatus
  );
  const { hotelInfo } = useSelector((state: any) => state.hotelInfo);
  const { gstSlab } = useSelector((state: any) => state.gstSlab);
  const [rooms, setRooms] = useState<any>([]);
  const [gst, setGst] = useState<number>(0);
  const [gstArray, setGstArray] = useState<any>([]);
  const [payload, setPayload] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [service_charge, setServiceCharge] = useState<number>(0);
  const [payable_amount, setPayableAmout] = useState<number>(0);
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    const totalRooms = roomDetails.filter((room: any) => {
      return room.rooms.length > 0 ? room : null;
    });
    setRooms(totalRooms);
    calculateTotalGst(totalRooms);
  }, [roomDetails]);

  const setPayloadData = () => {
    const payload = {
      user_details: {
        first_name:
          formValue.name.split(" ").length > 2
            ? `${formValue.name.split(" ")[0]} ${formValue.name.split(" ")[1]}`
            : `${formValue.name.split(" ")[0]}`,
        last_name:
          formValue.name.split(" ").length > 2
            ? `${formValue.name.split(" ")[2]}`
            : `${formValue.name.split(" ")[1]}`
            ? `${formValue.name.split(" ")[1]}`
            : "",
        email_id: formValue.email,
        mobile: formValue.phone,
        address: formValue.address,
        zip_code: null,
        country: null,
        state: null,
        city: null,
        identity: {
          identity_type: "",
          identity_no: "",
          expiry_date: "",
        },
        date_of_birth: "",
        company_name: formValue.company,
        GST_IN: formValue.gstin,
        guest_note: "",
        arrival_time: "",
      },
      booking_details: {
        hotel_id: hotelId,
        checkin_date: moment(checkIndate).format("DD-MM-YYYY"),
        checkout_date: moment(checkOutdate).format("DD-MM-YYYY"),
        booking_reference: "",
        source: "Website",
        opted_book_assure: 0,
        payment_mode: 1,
        private_coupon: "",
        amount_to_pay: payable_amount,
        currency: currency_code,
      },
      room_details: rooms.map((room: any) => {
        return {
          room_type_id: room.id,
          rate_plan_id: room.mealPlan,
          no_of_rooms: room.rooms.length,
          occupancy: room.rooms.map((room: any) => {
            return {
              room_no: room.roomNo,
              adult: room.adults,
              child: room.childs,
            };
          }),
        };
      }),

      paid_service: [],
    };
    setPayload(payload);
    return payload;
  };

  const calculateGst = (price: number, gst: number) => {
    return (price * gst) / 100;
  };
  // console.log(rooms);
  const calculateTotalGst = (rooms: any) => {
    if (gstSlab.is_taxable === 0) return setGst(0);

    const totalGstArray: any = [];
    let totalGst = 0;
    rooms.forEach((room_data: any) => {
      const room_gst: any = [];
      room_data.rooms.forEach((room: any) => {
        let per_night_gst: any = [];
        room.room_price.forEach((price: any) => {
          let gst = 0;

          if (gstSlab.tax_type == "slab") {
            if (gstSlab.gst_slab_name === "Bundled") {
              gstSlab.tax_value.forEach((tax: any) => {
                if (
                  price.price >= tax.start_range &&
                  price.price <= tax.end_range
                ) {
                  gst += calculateGst(price.price, tax.value);
                }
              });
            } else if (gstSlab.gst_slab_name === "Individual") {
              gstSlab.tax_value.forEach((tax: any) => {
                if (
                  price.individual_price >= tax.start_range &&
                  price.individual_price <= tax.end_range
                ) {
                  gst = calculateGst(price.price, tax.value);
                }
              });
            }
          } else if (gstSlab.tax_type == "flat") {
            if (gstSlab.gst_slab_name === "Bundled") {
              if (price.price >= gstSlab.tax_value[0].start_range)
                gst = calculateGst(price.price, gstSlab.tax_value[0].value);
            } else if (gstSlab.gst_slab_name === "Individual") {
              if (price.individual_price >= gstSlab.tax_value[0].start_range)
                gst = calculateGst(price.price, gstSlab.tax_value[0].value);
            }
          }

          per_night_gst.push({
            date: price.date,
            price: price.price,
            gst: gst,
          });
          totalGst += gst;
        });
        room_gst.push({ gst: per_night_gst });
      });
      totalGstArray.push({
        roomType: room_data.roomType,
        room_gst: room_gst,
      });
    });
    setGst(parseFloat(totalGst.toFixed(2)));
    setGstArray(totalGstArray);
  };

  /////////////////////////////////////////
  const form = [
    { label: "Guest Name", id: "name" },
    { label: "Email Address", id: "email" },
    { label: "Phone Number", id: "phone" },
    {
      label: "Address",
      id: "address",
    },
  ];
  const businessform = [
    { label: "Guest Name", id: "name" },
    { label: "Email Address", id: "email" },
    { label: "Phone Number", id: "phone" },
    { label: "Company Name", id: "company" },
    { label: "Company Address", id: "address" },
    { label: "GSTIN no", id: "gstin" },
  ];

  const initialFormValue = {
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    gstin: "",
  };

  const [formValue, setFormValue] = useState<any>(initialFormValue);
  const [formErrors, setFormErrors] = useState<any>({});
  const [value, setValue] = React.useState("myself");
  const [addOnCharge, setAddonCharge] = useState<any>();
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  let icon = "";
  if (currency_symbol) {
    const codePoint = parseInt(currency_symbol, 16);
    icon = String.fromCodePoint(codePoint);
  }

  //-==================================== function to  handle form input ====================================-//
  const handleFormValue = (e: any) => {
    const { name, value } = e.target;
    // console.log(name, value);
    setFormValue((prev: any) => ({ ...prev, [name]: value }));
    setFormErrors((prev: any) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  //-==================================== function to validate input filed ====================================-//
  const validateField = (name: string, values: string) => {
    let error = "";

    if (values.trim() === "") {
      // if (value === "myself" && name === "address") return;
      error = "This field is required";
    } else {
      switch (name) {
        case "email":
          error = validateEmail(values);
          break;
        case "phone":
          error = validatePhone(values);
          break;
        case "gstin":
          error = validateGstin(values);
          break;
        default:
          break;
      }
    }

    return error;
  };

  //-==================================== function to toogle myself and business ====================================-//
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setFormErrors({});
  };

  //-==================================== function to validate email ====================================-//
  const validateEmail = (email: string) => {
    if (email === "") {
      return "Email is required";
    }
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.match(validRegex) ? "" : "Invalid email format";
  };

  //-==================================== function to validate phone ====================================-//
  const validatePhone = (phone: string) => {
    if (phone === "") {
      return "Phone number is required";
    }
    const validRegex = /^[0-9]{10}$/;
    return phone.match(validRegex) ? "" : "Invalid phone number format";
  };

  //-==================================== function to validate gastin ====================================-//
  const validateGstin = (gstin: string) => {
    if (gstin === "") {
      return "GSTIN is required";
    }
    const validRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return gstin.match(validRegex) ? "" : "Invalid GSTIN format";
  };

  //-==================================== function to validate form ====================================-//
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    if (value === "myself") {
      form.forEach((item) => {
        // if (item.id === "address") return;
        const { id } = item;
        const value = formValue[id];
        const error = validateField(id, value);

        if (error) {
          errors[id] = error;
          isValid = false;
        }
      });
    } else {
      businessform.forEach((item) => {
        const { id } = item;
        const value = formValue[id];
        const error = validateField(id, value);

        if (error) {
          errors[id] = error;
          isValid = false;
        }
      });
    }

    setFormErrors(errors);
    return isValid;
  };

  //-==================================== handle payment ====================================-//
  const handlePayment = async () => {
    // dispatch(setBookingLoaderStatus(true));
    // return;
    try {
      const isValid = validateForm();
      if (!checked) {
        toast.warn("Please accept the terms and conditions");
      }
      let payload = {};
      if (isValid && checked) {
        payload = setPayloadData();
        setLoading(true);
        const { data } = await be_instance.post(
          `${endpoints.fetchInvoiceId}/${apikey}`,
          payload
        );
        if (data.status === 1) {
          if (hotelInfo?.payment_provider === "razorpay") {
            const res = await be_instance.get(
              `${endpoints.razorpayOrderId}/${data.invoice_id}`
            );
            // console.log(res);
            if (res.data.status === 1) {
              await handleRazorpayPayment(
                res.data.order_id,
                setLoading,
                dispatch
              );
            } else {
              toast.error("Somthing went wrong!");
              setLoading(false);
            }
          } else if (hotelInfo?.payment_provider === "easebuzz") {
            const res = await be_instance.get(
              `${endpoints.easebuzzAccessKey}/${data.invoice_id}`
            );
            if (res.data.status === 1) {
              await handleEasebuzPayment(
                res.data.data.access_key,
                setLoading,
                dispatch
              );
            } else {
              toast.error("Somthing went wrong!");
              setLoading(false);
            }
          }
        } else {
          toast.error("Somthing went wrong!");
          setLoading(false);
        }
      } else {
        return;
      }
    } catch (err) {
      toast.error("Somthing went wrong!");
      setLoading(false);
    }
  };

  //-==================================== fetch add on charges ====================================-//
  const fetchAddonCharges = async () => {
    try {
      const { data } = await be_instance(
        `${endpoints.serviceCharge}/${hotelId}`
      );
      if (data.status === 1) {
        setAddonCharge(data.data);
      }
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  useEffect(() => {
    fetchAddonCharges();
  }, []);

  useEffect(() => {
    calculateServiceCharge();
  }, [totalPrice, addOnCharge]);

  useEffect(() => {
    // console.log(totalPrice, gst, service_charge);
    let payable_amount = totalPrice + gst + service_charge;
    payable_amount = payable_amount.toFixed(2);
    setPayableAmout(payable_amount);
  }, [totalPrice, gst, service_charge]);

  //-==================================== fetch add on charges ====================================-//
  const calculateServiceCharge = () => {
    if (addOnCharge) {
      const service = addOnCharge[0];
      const service_price =
        (totalPrice * service.add_on_charges_percentage) / 100;
      let service_price_with_tax =
        (service_price * service.add_on_tax_percentage) / 100 + service_price;
      service_price_with_tax = parseFloat(service_price_with_tax.toFixed(2));
      setServiceCharge(service_price_with_tax);
    }
  };

  const handleModalShow = (arr: any) => {
    setShow(true);
    // const imgarr: any = [];
    // arr.forEach((obj: any) => {
    //   imgarr.push(`${img_base_url}/${obj.image_name}`);
    // });
    // setImgarr(imgarr);
  };

  return (
    <>
      {booking_loader_status ? (
        <>
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
        </>
      ) : (
        <>
          <div className={styles.container}>
            <CheckInOut />

            <div
              style={{
                height: "1px",
                border: "0",
                borderTop: "1px solid #CED4DA",
                margin: "0.5rem 0",
                padding: "0",
              }}
            ></div>

            <div className={styles.parentdiv}>
              <div className={styles.left}>Guest Details</div>
              <div className={styles.right}>
                {" "}
                <div className={styles.radiobtn}>
                  <input
                    type="radio"
                    id="myself"
                    name="myself"
                    value="myself"
                    checked={value === "myself"}
                    onChange={handleChange}
                  />
                  <label htmlFor="myself">MySelf</label>
                </div>
                <div className={styles.radiobtn}>
                  <input
                    className={styles.radiobtninput}
                    type="radio"
                    id="business"
                    name="business"
                    value="business"
                    checked={value === "business"}
                    onChange={handleChange}
                  />
                  <label htmlFor="business">Business</label>
                </div>
              </div>
            </div>

            <div className={styles.guestdetilsform}>
              <div className={styles.form}>
                {value === "myself"
                  ? form.map((item) => (
                      <CustomTextField
                        key={item.id}
                        label={item.label}
                        id={item.id}
                        onChange={handleFormValue}
                        name={item.id}
                        value={formValue[item.id]}
                        error={formErrors[item.id]}
                        helperText={formErrors[item.id]}
                      />
                    ))
                  : businessform.map((item) => (
                      <CustomTextField
                        key={item.id}
                        label={item.label}
                        id={item.id}
                        onChange={handleFormValue}
                        name={item.id}
                        value={formValue[item.id]}
                        error={formErrors[item.id]}
                        helperText={formErrors[item.id]}
                      />
                    ))}
              </div>
            </div>
            <div className={styles.pricebreakup}>Price Breakup</div>
            <div className={styles.totalPriceContainer}>
              <div className={styles.row}>
                <div className={styles.totalPriceText}>Room Total</div>
                <div className={styles.totalPrice}>
                  {icon}
                  {totalPrice}
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.totalPriceText}>Service Charge</div>
                <div className={styles.totalPrice}>
                  {icon}
                  {service_charge}
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.totalPriceText}>GST</div>
                <div className={styles.totalPrice}>
                  {icon}
                  {gst}
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.totalPriceText}>Total</div>
                <div className={styles.totalPrice}>
                  {icon}
                  {payable_amount}
                </div>
              </div>
            </div>
            <div className={styles.tacbox}>
              <input
                id="checkbox"
                type="checkbox"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setChecked(!checked);
                }}
              />
              <span>
                {" "}
                I agree to these{" "}
                <span
                  style={{ color: "#2563eb", cursor: "pointer" }}
                  onClick={handleModalShow}
                >
                  Terms and Conditions
                </span>
                .
              </span>
            </div>
          </div>
          <Modal
            style={{ zIndex: 9999999 }}
            show={show}
            fullscreen={true}
            onHide={() => setShow(false)}
          >
            <Modal.Header closeButton style={{ border: "none" }}></Modal.Header>
            <Modal.Body>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "1rem",
                  padding: "1rem",
                  margin: "1rem 10rem",
                }}
              >
                <Policies />
              </div>
            </Modal.Body>
          </Modal>
          <Button
            btnClick={handlePayment}
            btnText={`Pay ${icon}${payable_amount}`}
            roomNo={totalnoOfRooms}
            pageNo={3}
            totalPerson={totalnoOfPersons}
            roomdata={rooms}
            isLoading={loading}
            btnDisabled={loading || !checked}
          />
        </>
      )}
    </>
  );
};

export default Checkout;
