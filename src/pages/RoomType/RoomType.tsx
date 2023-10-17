import React, { useState, useRef, useEffect } from "react";
import { nextToPage3, prevToPage1 } from "../../redux/slices/StatusSlice";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button/Button";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import styles from "./RoomType.module.scss";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { add, set, sub } from "date-fns";
import CheckInOut from "../../components/CheckInOut/CheckInOut";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ImageCarousel from "../../components/Carousel/ImageCarousel";
import Modal from "react-bootstrap/Modal";
import "./custom.css";

import {
  setApiData,
  setCurreny,
  setRoomPayload,
  setTotalnoOfPersons,
  setTotalnoOfRooms,
  setTotalRoomPrice,
} from "../../redux/slices/RoomSlice";
import room_image from "../../assets/images/room_image.png";
import no_img from "../../assets/images/no_img.png";

import { be_instance, kernel_instance } from "../../API/baseurl";
import moment from "moment";
import { setFilter, setSelectedFilter } from "../../redux/slices/FilterSlice";
import axios from "axios";
import { setGSTSlab } from "../../redux/slices/GstSlice";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import endpoints from "../../API/endpoints";
import { setCheckIn, setCheckOut } from "../../redux/slices/CheckInOutSlice";
import { toast } from "react-toastify";
type price = {
  date: string;
  price: number;
  individual_price: number;
};
type Room = {
  // [key: string]: number;
  id: number;
  roomNo: number;
  adults: number;
  childs: number;
  room_price: price[];
  extraAdult: number;
  extraChild: number;
};

type Rooms = {
  id: number;
  roomType: string;
  mealPlan: string;
  mealPlanName: string;
  price: number;
  rooms: Room[];
};

interface RoomTypeProps {
  hotelId: number;
  apikey: string;
}

const RoomType: React.FC<RoomTypeProps> = ({ hotelId, apikey }) => {
  const { checkIndate, checkOutdate } = useSelector(
    (state: any) => state.checkInOut
  );
  const { currency_code, currency_symbol } = useSelector(
    (state: any) => state.currency
  );

  const dispatch = useDispatch();
  const { roomDetails, apiData, totalnoOfRooms, currency } = useSelector(
    (state: any) => state.roomDetails
  );
  const { hotelInfo } = useSelector((state: any) => state.hotelInfo);
  const [roomTypeData, setRoomTypeData] = useState<any>(apiData);

  const [rooms, setRooms] = useState<any>(roomDetails);
  const [loader, setLoader] = useState<boolean>(false);

  const [slideIndex, setSlideIndex] = useState([]);

  const [totalRooms, setTotalRooms] = useState<number>(totalnoOfRooms);
  const [totalPrice, setTotalPrice] = useState<any>();
  const [totalPerson, setTotalPerson] = useState<any>(0);
  const [filterType, setFilterType] = useState<any>([]);
  const [show, setShow] = useState(false);
  const [imgarr, setImgarr] = useState<any>([]);
  const [fillterId, setFillterId] = useState<any>(0);

  const img_base_url = "https://d3ki85qs1zca4t.cloudfront.net/bookingEngine";

  const handleModalClose = () => {
    setShow(false);
    setImgarr([]);
  };

  //-==================================== function to show the image modal ====================================-//
  const handleModalShow = (arr: any) => {
    setShow(true);
    const imgarr: any = [];
    arr.forEach((obj: any) => {
      imgarr.push(`${img_base_url}/${obj.image_name}`);
    });
    setImgarr(imgarr);
  };

  //-==================================== function to handle next slide ====================================-//
  const handleNextSlide = (ind: number, mealPlanArray: any) => {
    if (slideIndex[ind] === mealPlanArray.length - 1) return;

    setSlideIndex((prev: any) =>
      prev.map((p: any, i: any) => (i === ind ? p + 1 : p))
    );
  };

  //-==================================== function to handle prev slide ====================================-//
  const handlePreviousSlide = (ind: number, mealPlanArray: any) => {
    if (slideIndex[ind] === 0) return;
    setSlideIndex((prev: any) =>
      prev.map((p: any, i: any) => (i === ind ? p - 1 : p))
    );
  };

  console.log(slideIndex);
  //-==================================== function to add a new room ====================================-//
  const handleAddRoom = (
    obj: any,
    index: number,
    i: number,
    mealPlanArray: any
  ) => {
    const no_of_night =
      moment(checkOutdate).diff(moment(checkIndate), "day") | 0;
    if (obj?.min_los > no_of_night) {
      toast.warn(
        `Minimum stay duration is ${obj?.min_los} for this room type.`
      );
      return;
    }
    const { base_adult, base_child } = obj;
    setRooms((prev: any) => {
      return prev.map((room: any, e: number) => {
        if (room.id === obj.room_type_id) {
          // if (room.mealPlan !== "") {
          //   flag = false;
          //   return room;
          // }
          return {
            ...room,
            mealPlan: mealPlanArray[index][i].meal_type,
            mealPlanName: mealPlanArray[index][i].meal,
            price: mealPlanArray[index][i].price,
            rooms: [
              ...room.rooms,
              {
                roomNo: room.rooms.length + 1,
                adults: base_adult,
                childs: base_child,
                extraAdult: 0,
                extraChild: 0,
                room_price: calculatePrice(
                  room,
                  obj,
                  mealPlanArray[index][i].meal_type,
                  base_adult,
                  base_child,
                  0,
                  0
                ),
              },
            ],
          };
        } else {
          return room;
        }
      });
    });
    setTotalRooms((prev: any) => prev + 1);
  };

  //-==================================== function to increace the room number in a room type ====================================-//
  const addRoom = (obj: any, min_inv: number) => {
    if (
      rooms.find((room: any) => room.id === obj.room_type_id).rooms.length ===
      min_inv
    ) {
      return;
    }
    const { base_adult, base_child } = obj;
    setRooms((prev: any) => {
      return prev.map((room: any, i: number) => {
        if (room.id === obj.room_type_id) {
          return {
            ...room,
            rooms: [
              ...room.rooms,
              {
                roomNo: room.rooms.length + 1,
                adults: base_adult,
                childs: base_child,
                extraAdult: 0,
                extraChild: 0,
                room_price: calculatePrice(
                  room,
                  obj,
                  room.mealPlan,
                  base_adult,
                  base_child,
                  0,
                  0
                ),
              },
            ],
          };
        } else {
          return room;
        }
      });
    });

    setTotalRooms((prev: any) => prev + 1);
  };

  //-==================================== function to substract the room number in a room type ====================================-//
  const subtractRoom = (obj: any) => {
    setRooms((prev: any) => {
      return prev.map((room: any, i: number) => {
        if (room.id === obj.room_type_id) {
          if (room.rooms.length === 1) {
            return {
              ...room,
              mealPlan: "",
              price: 0,
              rooms: [],
            };
          } else {
            return {
              ...room,
              rooms: room.rooms.filter(
                (r: any) => r.roomNo !== room.rooms.length
              ),
            };
          }
        } else {
          return room;
        }
      });
    });

    setTotalRooms((prev: any) => prev - 1);
  };

  //-==================================== function to increase the person ====================================-//
  const addPerson = (obj: any, roomNo: number, person: string) => {
    setRooms((prev: any) => {
      return prev.map((room: any, i: number) => {
        if (room.id === obj.room_type_id) {
          return {
            ...room,
            rooms: room.rooms.map((r: any, i: number) => {
              if (r.roomNo === roomNo) {
                const {
                  base_adult,
                  base_child,
                  extra_adult,
                  extra_child,
                  max_occupancy,
                } = obj;
                if (r.adults + r.childs === max_occupancy) return r;
                let extraAdult = r.extraAdult,
                  extraChild = r.extraChild;
                if (person === "adults") {
                  if (r.adults === base_adult + extra_adult) return r;
                  extraAdult = r.adults >= base_adult ? r.extraAdult + 1 : 0;
                } else if (person === "childs") {
                  if (r.childs === base_child + extra_child) return r;
                  extraChild = r.childs >= base_child ? r.extraChild + 1 : 0;
                }
                const adult = person === "adults" ? r.adults + 1 : r.adults;
                const child = person === "childs" ? r.childs + 1 : r.childs;
                return {
                  ...r,
                  [person]: r[person] + 1,
                  extraAdult: extraAdult,
                  extraChild: extraChild,
                  room_price: calculatePrice(
                    room,
                    obj,
                    room.mealPlan,
                    adult,
                    child,
                    extraAdult,
                    extraChild
                  ),
                };
              } else {
                return r;
              }
            }),
          };
        } else {
          return room;
        }
      });
    });
  };

  //-==================================== function to decrease the person ====================================-//
  const substractPerson = (obj: any, roomNo: number, person: string) => {
    setRooms((prev: any) => {
      return prev.map((room: any, i: number) => {
        if (room.id === obj.room_type_id) {
          return {
            ...room,
            rooms: room.rooms.map((r: any, i: number) => {
              if (r.roomNo === roomNo) {
                const { base_adult, base_child } = obj;
                if (person === "adults") {
                  if (r.adults === 1) return r;
                }
                if (r[person] === 0) return r;
                const adult = person === "adults" ? r.adults - 1 : r.adults;
                const child = person === "childs" ? r.childs - 1 : r.childs;

                let extra_adult = r.extraAdult;
                let extra_child = r.extraChild;

                if (person === "adults") {
                  if (r.adults > base_adult) {
                    extra_adult = r.extraAdult - 1;
                  } else if (r.adults === base_adult) {
                    extra_adult = 0;
                  } else if (r.adults < base_adult) {
                    extra_adult = 0;
                  }
                } else if (person === "childs") {
                  if (r.childs > base_child) {
                    extra_child = r.extraChild - 1;
                  } else if (r.childs === base_child) {
                    extra_child = 0;
                  } else if (r.childs < base_child) {
                    extra_child = 0;
                  }
                }
                // console.log("adult", adult);
                // console.log("child", child);
                // console.log("extraAdult", r.extraAdult);
                // console.log("extraChild", r.extraChild);
                return {
                  ...r,
                  [person]: r[person] - 1,
                  extraAdult: extra_adult,
                  extraChild: extra_child,
                  room_price: calculatePrice(
                    room,
                    obj,
                    room.mealPlan,
                    adult,
                    child,
                    extra_adult,
                    extra_child
                  ),
                };
              } else {
                return r;
              }
            }),
          };
        } else {
          return room;
        }
      });
    });
  };

  //-==================================== function for clear a perticular card ====================================-//
  const clearCard = (roomId: number) => {
    setRooms((prev: any) => {
      return prev.map((room: any, i: number) => {
        if (room.id === roomId) {
          return {
            ...room,
            mealPlan: "",
            mealPlanName: "",
            price: 0,
            rooms: [],
          };
        } else {
          return room;
        }
      });
    });
  };

  //-==================================== function for calculating price ====================================-//
  const calculatePrice = (
    room: any,
    room_type_data: any,
    meal_plan: number,
    adult: number,
    child: number,
    extra_adult: number,
    extra_child: number
  ) => {
    const room_night_price: any = [];
    room_type_data.rate_plans.map((plan: any) => {
      if (plan.rate_plan_id === meal_plan) {
        // console.log(plan.rate_plan_id, meal_plan);
        plan.rates.map((rate: any) => {
          let room_price = 0;
          let multiple_occupancy_price = 0;

          // console.log("base_adult", room_type_data.base_adult);
          // console.log("adult", adult);
          // console.log("child", child);
          // console.log("extra_adult", extra_adult);
          // console.log("extra_child", extra_child);

          if (extra_adult > 0) {
            room_price +=
              rate.price_after_discount + extra_adult * rate.extra_adult_price;
          } else if (room_type_data.base_adult === adult) {
            room_price += rate.price_after_discount;
          } else if (room_type_data.base_adult > adult) {
            room_price += rate.multiple_occupancy[adult - 1];
            multiple_occupancy_price = rate.multiple_occupancy[adult - 1];
          }
          room_price += extra_child * rate.extra_child_price;
          const individual_price =
            multiple_occupancy_price > 0
              ? multiple_occupancy_price
              : rate.price_after_discount;
          const obj: price = {
            date: rate.date,
            price: room_price,
            individual_price: individual_price,
          };
          // console.log(obj);
          room_night_price.push(obj);
        });
      }
    });
    return room_night_price;
  };

  //-==================================== function to handle go to checkout page ====================================-//
  const checkAndProceedToNextPage = () => {
    dispatch(setRoomPayload(rooms));
    dispatch(setTotalnoOfRooms(totalRooms));
    dispatch(setTotalnoOfPersons(totalPerson));
    dispatch(setTotalRoomPrice(totalPrice));
    dispatch(nextToPage3());
  };

  //-==================================== function to clear cart ====================================-//
  const clearCart = () => {
    setTotalRooms(0);
    setTotalPrice(0);
    setRooms((prev: any) => {
      return prev.map((room: any) => {
        return {
          ...room,
          mealPlan: "",
          mealPlanName: "",
          price: 0,
          rooms: [],
        };
      });
    });
  };

  //-==================================== function to handle filter ====================================-//
  const handleFilter = (obj: any) => {
    clearCart();
    setFillterId(obj.rate_plan_id);
    dispatch(setSelectedFilter(obj.rate_plan_id));
  };

  //==================== fetch the gst slab ====================//
  const fetchgstSlab = async () => {
    try {
      const { data } = await kernel_instance.get(
        `${endpoints.fetchLocaleDetails}/${hotelId}`
      );
      if (data) {
        const state = data.states;
        const obj = {
          is_taxable: state.is_taxable,
          gst_slab_name: state.gst_slab_name,
          tax_type: state.tax_type,
          tax_value: state.tax_value,
        };
        dispatch(setGSTSlab(obj));
      }
    } catch (error) {
      console.log(error);
    }
  };

  //-==================================== function to handle get inventory api ====================================-//
  const fetchRoomTypeData = async () => {
    try {
      setLoader(true);
      setTotalRooms(0);
      setTotalPrice(0);
      const abd = hotelInfo?.advance_booking_days;
      // console.log("hotelInfo", hotelInfo);
      let new_checkin = moment(checkIndate).format("DD-MM-YYYY");
      let new_checkout = moment(checkOutdate).format("DD-MM-YYYY");
      // if (abd) {
      //   new_checkin = moment().add(abd, "days").format("DD-MMM-YYYY");
      //   new_checkout = moment()
      //     .add(abd + 1, "days")
      //     .format("DD-MMM-YYYY");
      // }
      const payload = {
        date_from: new_checkin,
        date_to: new_checkout,
        hotel_id: hotelId,
        api_key: apikey,
        currency: currency_code,
        adult: 0,
        child: 0,
        infant: 0,
        rooms: 1,
      };
      const { data } = await be_instance.post(
        `${endpoints.getInventory}`,
        payload
      );
      const initialvalue: Rooms[] = [];
      const array: any = [];

      if (data.status === 1) {
        data.data.map((obj: any, index: any) => {
          const roomsObj: Rooms = {
            id: obj.room_type_id,
            roomType: obj.room_type,
            mealPlan: "",
            mealPlanName: "",
            price: 0,
            rooms: [],
          };

          initialvalue.push(roomsObj);
        });

        // EP, CP, MAP
        array.push({
          rate_plan_id: 0,
          plan_type: "all",
          plan_name: "Show all",
        });
        // console.log(data.data);
        data.data.forEach((item: any) => {
          item?.rate_plans?.forEach((ratePlan: any) => {
            if (
              ratePlan.plan_type === "EP" ||
              ratePlan.plan_type === "CP" ||
              ratePlan.plan_type === "MAP" ||
              ratePlan.plan_type === "AP"
            ) {
              const plan = {
                rate_plan_id: ratePlan.rate_plan_id,
                plan_type: ratePlan.plan_type,
                plan_name: ratePlan.plan_name.replaceAll(" ", ""),
              };

              // Check if the plan already exists in the array
              const exists = array.some(
                (existingPlan: any) =>
                  existingPlan.rate_plan_id === plan.rate_plan_id &&
                  existingPlan.plan_type === plan.plan_type &&
                  existingPlan.plan_name === plan.plan_name
              );

              // Add the plan to the array if it doesn't exist
              if (!exists) {
                array.push(plan);
              }
            }
          });
        });
      }

      setFilterType(array);
      setRooms(initialvalue);
      setRoomTypeData(data.data);
      dispatch(setFilter(array));
      dispatch(setApiData(data.data));
      dispatch(setCurreny(currency_code));
      // dispatch(setTotalnoOfRooms(0));
      const slideIndexArrayOfRooms: any = [];

      for (let i = 0; i < data.data.length; i++) {
        slideIndexArrayOfRooms.push(0);
      }
      setSlideIndex(slideIndexArrayOfRooms);
      setLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  //-==================================== useEffect to calculate total number of rooms, persons and price ====================================-//
  useEffect(() => {
    // calculate total price
    const totalPrice = rooms.map((room: any) => {
      return room.rooms.reduce((acc: any, room: any) => {
        const price = room.room_price.reduce((acc: any, price: any) => {
          return acc + price.price;
        }, 0);
        return acc + price;
      }, 0);
    });
    const sum = totalPrice.reduce((acc: any, price: any) => {
      return acc + price;
    }, 0);

    // calculate total rooms
    const totalRoom = rooms.reduce((acc: any, room: any) => {
      return acc + room.rooms.length;
    }, 0);

    // calculate total person
    const totalPerson = rooms.reduce((acc: any, room: any) => {
      return (
        acc +
        room.rooms.reduce((acc: any, room: any) => {
          return acc + room.adults + room.childs;
        }, 0)
      );
    }, 0);

    setTotalRooms(totalRoom);
    setTotalPrice(sum);
    setTotalPerson(totalPerson);
  }, [rooms]);

  //-==================================== fetch gst slab and room type data when currency changes ====================================-//
  useEffect(() => {
    if (hotelInfo !== null) {
      if (apiData.length > 0 && currency === currency_code) {
        const slideIndexArrayOfRooms: any = [];

        for (let i = 0; i < apiData.length; i++) {
          slideIndexArrayOfRooms.push(0);
        }
        setSlideIndex(slideIndexArrayOfRooms);
        return;
      }
      fetchRoomTypeData();
      fetchgstSlab();
    }
  }, [hotelInfo]);

  return (
    <>
      <div className={styles.container}>
        {loader ? (
          <SkeletonLoader />
        ) : (
          <>
            <CheckInOut filter={handleFilter} />
            <div
              style={{
                height: "1px",
                border: "0",
                borderTop: "1px solid #CED4DA",
                margin: "0.5rem 0",
                padding: "0",
              }}
            ></div>
            {apiData.length === 0 ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: " 500px",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      color: "#FB1212",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    No Rooms Available for the selected date
                  </span>
                  <span
                    style={{
                      color: "#FB1212",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    please choose another date
                  </span>
                </div>
              </>
            ) : (
              <>
                {" "}
                {apiData.map((obj: any, ind: number) => {
                  const mealPlans: any = [];
                  obj?.rate_plans?.map((plan: any, ind: any) => {
                    mealPlans.push({
                      meal_type: plan.rate_plan_id,
                      meal: plan.plan_name,
                      price: plan.price_after_discount,
                      discount_percentage: plan.discount_percentage,
                      before_discout: plan.bar_price,
                    });
                  });
                  const items = Math.ceil(mealPlans.length / 4) * 4;

                  const mealPlanArray: any = [];
                  for (let i = 0; i < items; i += 4) {
                    mealPlanArray.push(mealPlans.slice(i, i + 4));
                  }
                  const roomType = rooms.find(
                    (e: any) => e.id === obj.room_type_id
                  );
                  const no_of_night =
                    moment(checkOutdate).diff(moment(checkIndate), "day") | 0;
                  return (
                    <div
                      className={styles.roomtype_card_container}
                      // style={
                      //   ind === rooms.length - 1 ? { marginBottom: 0 } : {}
                      // }
                      key={ind}
                    >
                      <div className={styles.room_title}>
                        {obj.room_type.length <= 31 ? (
                          <span> {obj.room_type}</span>
                        ) : (
                          <span
                            data-tooltip-id="room-title"
                            data-tooltip-content={obj.room_type}
                          >
                            {obj.room_type.slice(0, 31) + "..."}
                            <Tooltip id="room-title" variant="dark" />
                          </span>
                        )}
                        {roomType.rooms.length > 0 && (
                          <span
                            className={styles.crearBtn}
                            onClick={() => clearCard(obj.room_type_id)}
                          >
                            Clear
                          </span>
                        )}
                      </div>
                      <div className={styles.room_info_container}>
                        <div
                          className={styles.room_image_container}
                          onClick={() => handleModalShow(obj.allImages)}
                        >
                          {obj.discount_percentage !== 0 && (
                            <div className={styles.discount}>
                              {obj.discount_percentage}% OFF
                            </div>
                          )}

                          <div className={styles.big_image}>
                            <img
                              src={
                                obj.image
                                  ? `${img_base_url}/${obj.image}`
                                  : no_img
                              }
                              // src={room_image}
                              alt="image"
                            />
                          </div>
                          <div className={styles.small_image_container}>
                            <div className={styles.small_image}>
                              <img
                                className={styles.first_small_image}
                                src={
                                  obj.allImages[0]
                                    ? `${img_base_url}/${obj.allImages[0].image_name}`
                                    : no_img
                                }
                                // src={room_image}
                                alt="image"
                              />
                            </div>
                            <div className={styles.small_image}>
                              <img
                                src={
                                  obj.allImages[1]
                                    ? `${img_base_url}/${obj.allImages[1].image_name}`
                                    : no_img
                                }
                                // src={room_image}
                                alt="image"
                              />
                            </div>
                            <div className={styles.small_image}>
                              <img
                                src={
                                  obj.allImages[2]
                                    ? `${img_base_url}/${obj.allImages[2].image_name}`
                                    : no_img
                                }
                                // src={room_image}
                                alt="image"
                              />
                            </div>
                          </div>
                        </div>
                        {obj.min_inv === 0 ? (
                          <div
                            style={{
                              width: "67%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              textAlign: "center",
                              borderTop: "1px solid #e7e7e7",
                              marginBottom: "1rem",
                            }}
                          >
                            <span
                              style={{
                                color: "#FB1212",
                                fontSize: "14px",
                                fontWeight: 600,
                              }}
                            >
                              Sold Out !
                            </span>
                          </div>
                        ) : (
                          <div className={styles.room_mealplan_container}>
                            <div
                              style={{ minHeight: "180px" }}
                              // ref={slider}
                              className={styles.carousel_container}
                            >
                              <div
                                className={styles.carousel}
                                style={{
                                  transform: `translateX(-${
                                    slideIndex[ind] * 100
                                  }%)`,
                                }}
                              >
                                {mealPlanArray.map(
                                  (mealPlan: any, index: number) => {
                                    const codePoint = parseInt(
                                      currency_symbol,
                                      16
                                    );
                                    const icon =
                                      String.fromCodePoint(codePoint);
                                    return (
                                      <div
                                        key={index}
                                        className={styles.carousel_item}
                                      >
                                        {mealPlan.map(
                                          (plan: any, i: number) => {
                                            return plan.meal === "" &&
                                              plan.price === 0 ? (
                                              <div
                                                style={{ minHeight: "47.39px" }}
                                              ></div>
                                            ) : (
                                              <div
                                                key={i}
                                                className={
                                                  roomType.rooms.length ||
                                                  fillterId
                                                    ? roomType.mealPlan ===
                                                        plan.meal_type ||
                                                      fillterId ===
                                                        plan.meal_type
                                                      ? styles.mealplan_card
                                                      : styles.mealplan_card_inactive
                                                    : styles.mealplan_card
                                                }
                                              >
                                                <div
                                                  className={
                                                    styles.meal_plan_title_container
                                                  }
                                                >
                                                  {plan.meal.length <= 31 ? (
                                                    <div
                                                      className={
                                                        styles.mealplan_title
                                                      }
                                                    >
                                                      {plan.meal}
                                                    </div>
                                                  ) : (
                                                    <div
                                                      className={
                                                        styles.mealplan_title
                                                      }
                                                      data-tooltip-id="meal-title"
                                                      data-tooltip-content={
                                                        plan.meal
                                                      }
                                                    >
                                                      {plan.meal.slice(0, 31) +
                                                        "..."}
                                                      <Tooltip
                                                        id="meal-title"
                                                        variant="dark"
                                                      />
                                                    </div>
                                                  )}

                                                  <div
                                                    className={
                                                      styles.mealplan_price
                                                    }
                                                  >
                                                    {icon}
                                                    {plan.price}
                                                    {plan.discount_percentage !==
                                                      0 && (
                                                      <span
                                                        className={
                                                          styles.mealplan_price_before_discount
                                                        }
                                                      >
                                                        {`${icon}${plan.before_discout}`}
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>

                                                {roomType.mealPlan ===
                                                plan.meal_type ? (
                                                  <div
                                                    className={
                                                      styles.btnContainer
                                                    }
                                                  >
                                                    {" "}
                                                    <div
                                                      className={
                                                        roomType.rooms
                                                          .length === 0
                                                          ? styles.btnDisabled
                                                          : styles.plusBtn
                                                      }
                                                      onClick={() =>
                                                        subtractRoom(obj)
                                                      }
                                                    >
                                                      <i className="bi bi-dash-lg"></i>
                                                    </div>
                                                    <div
                                                      className={styles.value}
                                                    >
                                                      {roomType.rooms.length}
                                                    </div>
                                                    <div
                                                      className={
                                                        roomType.rooms
                                                          .length ===
                                                        obj.min_inv
                                                          ? styles.btnDisabled
                                                          : styles.minusBtn
                                                      }
                                                      onClick={() =>
                                                        addRoom(
                                                          obj,
                                                          obj.min_inv
                                                        )
                                                      }
                                                    >
                                                      <i className="bi bi-plus-lg"></i>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div
                                                    className={
                                                      obj?.min_los > no_of_night
                                                        ? styles.disabledAddButton
                                                        : styles.addbutton
                                                    }
                                                    onClick={() =>
                                                      handleAddRoom(
                                                        obj,
                                                        index,
                                                        i,
                                                        mealPlanArray
                                                      )
                                                    }
                                                  >
                                                    Add Room
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>

                            <div>
                              {mealPlans.length > 4 && (
                                <>
                                  {" "}
                                  <div className={styles.hrline}></div>
                                  <div className={styles.view_more_container}>
                                    {/* <div className={styles.text_content}>
                                    <div className={styles.view_more}>
                                      {`+${mealPlans.length - 4} more plan(s)`}
                                    </div>
                                    <div className={styles.chevron_container}>
                                      <div className={styles.chevron}></div>
                                      <div className={styles.chevron}></div>
                                      <div className={styles.chevron}></div>
                                    </div>
                                  </div> */}
                                    <div className={styles.card_slider_icons}>
                                      <div
                                        className={
                                          slideIndex[ind] === 0
                                            ? styles.disable
                                            : styles.circle_arrow
                                        }
                                        onClick={() =>
                                          handlePreviousSlide(
                                            ind,
                                            mealPlanArray
                                          )
                                        }
                                      >
                                        <i className="bi bi-chevron-left"></i>
                                      </div>
                                      <div
                                        className={
                                          slideIndex[ind] ===
                                          mealPlanArray.length - 1
                                            ? styles.disable
                                            : styles.circle_arrow
                                        }
                                        onClick={() =>
                                          handleNextSlide(ind, mealPlanArray)
                                        }
                                      >
                                        <i className="bi bi-chevron-right"></i>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {roomType.rooms.length > 0 &&
                        roomType.rooms.map((value: any, index: any) => {
                          const room = roomType.rooms[index];
                          return (
                            <div
                              key={index}
                              className={
                                roomType.rooms.length > 0
                                  ? styles.personPayload
                                  : styles.displaynone
                              }
                            >
                              <div className={styles.lable}>
                                Room {room.roomNo}
                              </div>
                              <div className={styles.adultdiv}>
                                <div>Adult</div>
                                <div className={styles.btnContainer}>
                                  <div
                                    className={
                                      room.adults === 0
                                        ? styles.btnDisabled
                                        : styles.plusBtn
                                    }
                                    onClick={() =>
                                      substractPerson(
                                        obj,
                                        room.roomNo,
                                        "adults"
                                      )
                                    }
                                  >
                                    <i className="bi bi-dash-lg"></i>
                                  </div>
                                  <div className={styles.value}>
                                    {room.adults}
                                  </div>
                                  <div
                                    className={
                                      room.adults ===
                                        obj.base_adult + obj.extra_adult ||
                                      room.adults + room.childs ===
                                        obj.max_occupancy
                                        ? styles.btnDisabled
                                        : styles.minusBtn
                                    }
                                    onClick={() =>
                                      addPerson(obj, room.roomNo, "adults")
                                    }
                                  >
                                    <i className="bi bi-plus-lg"></i>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.childdiv}>
                                <div>Child</div>
                                <div className={styles.btnContainer}>
                                  <div
                                    className={
                                      room.childs === 0
                                        ? styles.btnDisabled
                                        : styles.plusBtn
                                    }
                                    onClick={() =>
                                      substractPerson(
                                        obj,
                                        room.roomNo,
                                        "childs"
                                      )
                                    }
                                  >
                                    <i className="bi bi-dash-lg"></i>
                                  </div>
                                  <div className={styles.value}>
                                    {room.childs}
                                  </div>
                                  <div
                                    className={
                                      room.childs ===
                                        obj.base_child + obj.extra_child ||
                                      room.adults + room.childs ===
                                        obj.max_occupancy
                                        ? styles.btnDisabled
                                        : styles.minusBtn
                                    }
                                    onClick={() =>
                                      addPerson(obj, room.roomNo, "childs")
                                    }
                                  >
                                    <i className="bi bi-plus-lg"></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>

      <Modal
        style={{ zIndex: 9999999 }}
        show={show}
        fullscreen={true}
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton style={{ border: "none" }}></Modal.Header>
        <Modal.Body>
          <ImageCarousel imgarr={imgarr} />
        </Modal.Body>
      </Modal>

      <Button
        btnClick={checkAndProceedToNextPage}
        btnText={"Next"}
        roomNo={totalRooms}
        pageNo={2}
        currencyIcon={currency_symbol}
        totalPrice={totalPrice}
        totalPerson={totalPerson}
        clearCart={clearCart}
        roomdata={rooms}
        btnDisabled={totalRooms === 0 ? true : false}
      />
    </>
  );
};

export default RoomType;
