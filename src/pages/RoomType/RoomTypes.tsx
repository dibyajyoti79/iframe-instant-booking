// import axios from "axios";
// import moment from "moment";
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import Modal from "react-bootstrap/Modal";
// import ImageCarousel from "../../components/Carousel/ImageCarousel";
// import Button from "../../components/Button/Button";

// interface Occupancy {
//   room_no: number | null;
//   adult: number;
//   child: number;
// }

// interface RoomDetail {
//   room_type: string;
//   room_type_id: number | null;
//   rate_plan_id: number | null;
//   rate_plan_name: string;
//   total_price: number | null;
//   no_of_rooms: number;
//   occupancy: Occupancy[];
// }

// const initialOccupancy: Occupancy = {
//   room_no: null,
//   adult: 0,
//   child: 0,
// };

// const initialState: RoomDetail = {
//   room_type: "",
//   room_type_id: null,
//   rate_plan_id: null,
//   rate_plan_name: "",
//   total_price: null,
//   no_of_rooms: 0,
//   occupancy: [],
// };

// const RoomTypes = () => {
//   const { checkIndate, checkOutdate } = useSelector(
//     (state: any) => state.checkInOut
//   );
//   const { currency_code, currency_symbol } = useSelector(
//     (state: any) => state.currency
//   );
//   const [data, setData] = useState<any>([]);
//   const [room_details, setRoomDetails] = useState<RoomDetail[]>([]);
//   const [loader, setLoader] = useState<boolean>(false);
//   const [checkindate, setCheckindate] = useState<string>("");
//   const [checkoutdate, setCheckoutdate] = useState<string>("");
//   const [tax, setTax] = useState<any>({});
//   const [gst, setGst] = useState<number>(0);
//   const [gstArray, setGstArray] = useState<any>([]);
//   const [totalPrice, setTotalPrice] = useState<number>(0);
//   const [totalPriceWithGst, setTotalPriceWithGst] = useState<number>(0);
//   const [totalAdults, setTotalAdults] = useState<number>(0);
//   const [totalChilds, setTotalChilds] = useState<number>(0);
//   const [totalRooms, setTotalRooms] = useState<number>(0);

//   const [show, setShow] = useState<boolean>(true);

//   const apikey = "e10d3f3262b968a9fdd149365c5a0129";
//   const hotelid = "1953";

//   const handleModalClose = () => setShow(false);
//   const handleModalShow = () => setShow(true);

//   //====================================== handle add room ======================================//
//   const handleAddRoom = (room: any) => {
//     // check if roomtype is already exist
//     const roomExist = room_details.find(
//       (item: any) => item.room_type_id === room.room_type_id
//     );

//     // if roomtype is already exist
//     if (roomExist) {
//       const updatedRoom = room_details.map((item: any) => {
//         if (item.room_type_id === room.room_type_id) {
//           if (item.no_of_rooms === room.min_inv) {
//             return item;
//           }
//           return {
//             ...item,
//             no_of_rooms: item.no_of_rooms + 1,
//             occupancy: [
//               ...item.occupancy,
//               {
//                 adult: room.base_adult,
//                 child: room.base_child,
//                 room_no: item.no_of_rooms + 1,
//               },
//             ],
//           };
//         }
//         return item;
//       });
//       setRoomDetails(updatedRoom);
//     } else {
//       const occupancy = {
//         ...initialOccupancy,
//         room_no: 1,
//         adult: room.base_adult,
//         child: room.base_child,
//       };
//       const roomdata = {
//         ...initialState,
//         room_type: room.room_type,
//         room_type_id: room.room_type_id,
//         no_of_rooms: 1,
//         occupancy: [occupancy],
//       };
//       setRoomDetails([...room_details, roomdata]);
//     }
//   };

//   //====================================== handle substract room ======================================//
//   const handleSubstractRoom = (room: any) => {
//     // check if roomtype is already exist
//     const roomExist = room_details.find(
//       (item) => item.room_type_id === room.room_type_id
//     );

//     // if roomtype is already exist
//     if (roomExist) {
//       const updatedRoom = room_details.map((item: any) => {
//         if (item.room_type_id === room.room_type_id) {
//           return {
//             ...item,
//             no_of_rooms: item.no_of_rooms - 1,
//             occupancy: item.occupancy.filter(
//               (i: any) => i.room_no !== item.no_of_rooms
//             ),
//           };
//         }
//         return item;
//       });
//       console.log(updatedRoom);
//       if (updatedRoom.find((item: any) => item.no_of_rooms === 0)) {
//         setRoomDetails(
//           updatedRoom.filter((item: any) => item.no_of_rooms !== 0)
//         );
//       } else {
//         setRoomDetails(updatedRoom);
//       }
//     }
//   };

//   //===============================================update adult===============================================//
//   const updateAdult = (room: any, room_no: number, type: string) => {
//     const updatedRoom = room_details.map((item) => {
//       if (item.room_type_id === room.room_type_id) {
//         return {
//           ...item,
//           occupancy: item.occupancy.map((i) => {
//             if (i.room_no === room_no) {
//               if (type === "add") {
//                 if (room.extra_adult + room.base_adult === i.adult) {
//                   return i;
//                 }
//                 if (room.max_occupancy === i.adult + i.child) {
//                   return i;
//                 }
//                 return {
//                   ...i,
//                   adult: i.adult + 1,
//                 };
//               } else {
//                 if (i.adult === 0) {
//                   return i;
//                 }
//                 return {
//                   ...i,
//                   adult: i.adult - 1,
//                 };
//               }
//             }
//             return i;
//           }),
//         };
//       }
//       return item;
//     });
//     setRoomDetails(updatedRoom);
//   };

//   //====================================== update child ======================================//
//   const updateChild = (room: any, room_no: number, type: string) => {
//     const updatedRoom = room_details.map((item) => {
//       if (item.room_type_id === room.room_type_id) {
//         return {
//           ...item,
//           occupancy: item.occupancy.map((i) => {
//             if (i.room_no === room_no) {
//               if (type === "add") {
//                 if (room.extra_child + room.base_child === i.child) {
//                   return i;
//                 }
//                 if (room.max_occupancy === i.adult + i.child) {
//                   return i;
//                 }
//                 return {
//                   ...i,
//                   child: i.child + 1,
//                 };
//               } else {
//                 if (i.child === 0) {
//                   return i;
//                 }
//                 return {
//                   ...i,
//                   child: i.child - 1,
//                 };
//               }
//             }
//             return i;
//           }),
//         };
//       }
//       return item;
//     });
//     setRoomDetails(updatedRoom);
//   };

//   //====================================== handle meal plan ======================================//
//   const handleMealPlan = (room_id: number, item: any) => {
//     const updatedRoom = room_details.map((room) => {
//       if (room.room_type_id === room_id) {
//         return {
//           ...room,
//           rate_plan_id: item.rate_plan_id,
//           rate_plan_name: item.plan_name,
//           rate_plan_price: item.price_after_discount,
//         };
//       }
//       return room;
//     });
//     setRoomDetails(updatedRoom);
//   };

//   //====================================== api call for inventory fetch ======================================//
//   const fetchInventory = async () => {
//     try {
//       const checkin = moment(checkIndate).format("DD-MM-YYYY");
//       const checkout = moment(checkOutdate).format("DD-MM-YYYY");
//       setLoader(true);
//       const { data } = await axios.get(
//         `https://be.bookingjini.com/get-inventory/${apikey}/${hotelid}/${checkindate}/${checkoutdate}/${currency_code}`
//       );

//       if (data.status === 1) {
//         setData(data.data);
//       }
//       setLoader(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ====================================== calculate total price with gst ======================================//

//   const calculateGst = (price: number, gst: number) => {
//     return (price * gst) / 100;
//   };

//   const calculateTotalPriceWithGSt = () => {
//     const totalGstArray: any = [];
//     let totalGst = 0;
//     let totalPrice = 0;
//     let finalPrice = 0;
//     let total_discount = 0;
//     room_details.forEach((room_data) => {
//       const room_type_data = data.find((item: any, index: number) => {
//         return item.room_type_id === room_data.room_type_id;
//       });
//       const rate_plans = room_type_data.rate_plans.find(
//         (rate: any) => rate.rate_plan_id === room_data.rate_plan_id
//       );

//       const rates = rate_plans.rates;

//       const room_gst: any = [];
//       let per_roomtype_price = 0;
//       let per_roomtype_discount = 0;
//       room_data.occupancy.forEach((room) => {
//         let per_night_gst: any = [];
//         const extra_adult =
//           room.adult > room_type_data.base_adult
//             ? room.adult - room_type_data.base_adult
//             : 0;
//         const extra_child =
//           room.child > room_type_data.base_child
//             ? room.child - room_type_data.base_child
//             : 0;

//         rates.forEach((rate: any) => {
//           let room_price = 0;
//           let multiple_occupancy_price = 0;
//           if (extra_adult > 0) {
//             room_price +=
//               rate.price_after_discount + extra_adult * rate.extra_adult_price;
//           } else if (room_type_data.base_adult === room.adult) {
//             room_price += rate.price_after_discount;
//           } else if (room_type_data.base_adult > room.adult) {
//             room_price += rate.multiple_occupancy[room.adult - 1];
//             multiple_occupancy_price = rate.multiple_occupancy[room.adult - 1];
//           }
//           room_price += extra_child * rate.extra_child_price;
//           let gst = 0;
//           if (tax.is_taxable === 0) {
//             gst = 0;
//           } else {
//             if (tax.tax_type === "slab") {
//               if (tax.gst_slab_name === "Bundled") {
//                 tax.tax_value.forEach((tax: any) => {
//                   if (
//                     room_price >= tax.start_range &&
//                     room_price <= tax.end_range
//                   ) {
//                     gst = calculateGst(room_price, tax.value);
//                     return;
//                   }
//                 });
//               } else if (tax.gst_slab_name === "Individual") {
//                 tax.tax_value.forEach((tax: any) => {
//                   const price =
//                     multiple_occupancy_price > 0
//                       ? multiple_occupancy_price
//                       : rate.price_after_discount;

//                   if (price >= tax.start_range && price <= tax.end_range) {
//                     gst = calculateGst(room_price, tax.value);
//                     return;
//                   }
//                 });
//               }
//             } else if (tax.tax_type == "flat") {
//               if (tax.gst_slab_name === "Bundled") {
//                 if (room_price >= tax.tax_value[0].start_range)
//                   gst = calculateGst(room_price, tax.tax_value[0].value);
//               } else if (tax.gst_slab_name === "Individual") {
//                 const price =
//                   multiple_occupancy_price > 0
//                     ? multiple_occupancy_price
//                     : rate.price_after_discount;

//                 if (price >= tax.tax_value[0].start_range)
//                   gst = calculateGst(room_price, tax.tax_value[0].value);
//               }
//             }
//           }

//           per_night_gst.push({
//             date: rate.date,
//             price: room_price,
//             gst: gst,
//           });
//           per_roomtype_discount += rate.bar_price - rate.price_after_discount;
//           per_roomtype_price += room_price;
//           totalPrice += room_price;
//           totalGst += gst;
//           finalPrice += room_price + gst;
//         });

//         room_data.total_price = per_roomtype_price;

//         room_gst.push({ room_gst: per_night_gst });

//         total_discount += per_roomtype_discount;
//       });
//       totalGstArray.push({
//         room_type: room_data.room_type,
//         total_gst: room_gst,
//       });
//     });
//     setGst(totalGst);
//     setGstArray(totalGstArray);
//     setTotalPrice(totalPrice);
//     setTotalPriceWithGst(finalPrice);

//     return [totalPrice, totalGst, finalPrice, total_discount];
//   };

//   //================================ use Effect for fecth Inventory  ================================//
//   const fetchlocaldetails = async () => {
//     try {
//       setLoader(true);
//       const { data } = await axios.get(
//         `https://kernel.bookingjini.com/locale-details/${hotelid}`
//       );
//       if (data.status === 1) {
//         const localdetail = {
//           tax_name: data.states.tax_name,
//           tax_type: data.states.tax_type,
//           tax_value: data.states.tax_value,
//           is_taxable: data.states.is_taxable,
//           gst_slab_name: data.states.gst_slab_name,
//         };
//         setTax(localdetail);
//       }
//       setLoader(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   //================================ use Effect for fecth Inventory  ================================//
//   useEffect(() => {
//     fetchInventory();
//     fetchlocaldetails();
//     setRoomDetails([]);
//     setTotalAdults(0);
//     setTotalChilds(0);
//     setTotalRooms(0);
//   }, [checkIndate, checkOutdate]);

//   //================================ set total rooms total adults and total childs ================================//
//   useEffect(() => {
//     let totalRooms = 0;
//     let totalAdults = 0;
//     let totalChilds = 0;
//     room_details.map((room) => {
//       totalRooms = totalRooms + room.no_of_rooms;
//       room.occupancy.map((occ) => {
//         totalAdults = totalAdults + occ.adult;
//         totalChilds = totalChilds + occ.child;
//       });
//     });
//     setTotalRooms(totalRooms);
//     setTotalAdults(totalAdults);
//     setTotalChilds(totalChilds);
//   }, [room_details]);

//   const clearCart = () => {};
//   const proceedToPayment = () => {};

//   return (
//     <>
//       <Modal
//         style={{ zIndex: 9999999 }}
//         show={show}
//         fullscreen={true}
//         onHide={() => setShow(false)}
//       >
//         <Modal.Header closeButton style={{ border: "none" }}></Modal.Header>
//         <Modal.Body>
//           <ImageCarousel />
//         </Modal.Body>
//       </Modal>

//       <Button
//         btnClick={proceedToPayment}
//         btnText={"Next"}
//         roomNo={totalRooms}
//         pageNo={2}
//         currencyIcon={currency_symbol}
//         totalPrice={totalPrice}
//         totalPerson={totalAdults + totalChilds}
//         clearCart={clearCart}
//         roomdata={room_details}
//         btnDisabled={totalRooms === 0 ? true : false}
//       />
//     </>
//   );
// };

// export default RoomTypes;

import React from "react";

const RoomTypes = () => {
  return <div>RoomTypes</div>;
};

export default RoomTypes;
