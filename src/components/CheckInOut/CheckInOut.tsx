import React, { useRef, useState } from "react";
import styles from "./CheckInOut.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { prevToPage1 } from "../../redux/slices/StatusSlice";
import { resetRoomPayload, setApiData } from "../../redux/slices/RoomSlice";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const CheckInOut = (prop: any) => {
  const { filteritems, selectedFilter } = useSelector(
    (state: any) => state.filter
  );

  const { filter } = prop;
  // ------------------------------redux store state
  const { checkIndate, checkOutdate } = useSelector(
    (state: any) => state.checkInOut
  );
  const { status } = useSelector((state: any) => state.status);
  const { apiData } = useSelector((state: any) => state.roomDetails);

  const dispatch = useDispatch();
  const sortIcon = useRef<any>(null);
  const [filteriItem, setFilterItem] = useState(selectedFilter);

  // ------------------------------handle edit
  const handleEdit = () => {
    dispatch(resetRoomPayload());
    dispatch(prevToPage1());
  };
  const handleSort = () => {
    if (sortIcon.current.className === "bi bi-sort-down") {
      const sortedData = apiData.slice().sort((a: any, b: any) => {
        return a.min_room_price - b.min_room_price;
      });
      dispatch(setApiData(sortedData));
      sortIcon.current.className = "bi bi-sort-up";
    } else {
      const sortedData = apiData.slice().sort((a: any, b: any) => {
        return b.min_room_price - a.min_room_price;
      });
      dispatch(setApiData(sortedData));
      sortIcon.current.className = "bi bi-sort-down";
    }
  };

  const filterTypeList_ref = useRef<HTMLDivElement>(null);

  //EVENTS
  const showFilterList = () => {
    const classList = filterTypeList_ref.current?.classList;
    filterTypeList_ref.current!.className = classList?.contains(
      styles.filterTypesList
    )
      ? styles.filterTypesListHeight
      : styles.filterTypesList;
  };

  const handleFilter = (obj: any) => {
    setFilterItem(obj.rate_plan_id);
    filter(obj);
    const classList = filterTypeList_ref.current?.classList;
    filterTypeList_ref.current!.className = classList?.contains(
      styles.filterTypesList
    )
      ? styles.filterTypesListHeight
      : styles.filterTypesList;
  };

  return (
    <div className={status === 2 ? styles.chekinCheckout : styles.disabled}>
      <div className={styles.DetailsBox}>
        <div className={styles.left} onClick={handleEdit}>
          <i
            style={{ fontSize: "1.7rem" }}
            className="bi bi-calendar4-range"
          ></i>
        </div>
        <div className={styles.middle} onClick={handleEdit}>
          <div className={styles.upper}>Check-In & Check-Out</div>
          <div className={styles.lower}>
            <div>
              {checkIndate.split("-")[0]}{" "}
              <span style={{ color: "#636474" }}>
                {" "}
                {checkIndate.split("-")[1]}, {checkIndate.split("-")[2]}
              </span>{" "}
              - {checkOutdate.split("-")[0]}{" "}
              <span style={{ color: "#636474" }}>
                {checkOutdate.split("-")[1]}, {checkOutdate.split("-")[2]}
              </span>
            </div>
            {/* <div>Adult 2, Child 0</div> */}
          </div>
        </div>
      </div>
      {status === 2 && (
        <div className={styles.right}>
          <div className={styles.rightIcons} onClick={handleSort}>
            <i
              ref={sortIcon}
              style={{ fontSize: "1.3rem" }}
              className="bi bi-sort-up"
            ></i>
          </div>
          <div className={styles.accordion}>
            <div ref={filterTypeList_ref} className={styles.filterTypesList}>
              {filteritems.map((item: any, ind: number) => (
                <div
                  key={ind}
                  className={
                    filteriItem === item.rate_plan_id
                      ? styles.selected
                      : styles.filterType
                  }
                  onClick={() => handleFilter(item)}
                >
                  {item.plan_name}
                </div>
              ))}
            </div>
            <i className="bi bi-funnel" onClick={showFilterList}></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInOut;
