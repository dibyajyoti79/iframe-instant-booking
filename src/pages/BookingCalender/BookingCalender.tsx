import React, { useEffect, useRef, useState } from "react";
import styles from "./BookingCalender.module.scss";
import moment from "moment";
import { nextToPage2 } from "../../redux/slices/StatusSlice";
import Button from "../../components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { be_instance } from "../../API/baseurl";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  setCheckIn,
  setCheckOut,
  setSelectdDates,
} from "../../redux/slices/CheckInOutSlice";
import endpoints from "../../API/endpoints";

interface BookingCalenderProps {
  hotelId: number;
}

const BookingCalender: React.FC<BookingCalenderProps> = ({ hotelId }) => {
  const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const calender: any = [];
  for (let i = 0; i < 42; i++) {
    calender.push(i);
  }

  const dispatch = useDispatch();
  const { selectedDates } = useSelector((state: any) => state.checkInOut);
  const currency = useSelector((state: any) => state.currency);

  const [selectedDatesArr, setSelectedDatesArr] =
    useState<string[]>(selectedDates);
  const [selectedFirstDateVal, setSelectedFirstDateVal] = useState<string>(
    selectedDates[0]
  );
  const [selectedEndDateVal, setSelectedEndDateVal] = useState<string>(
    selectedDates[selectedDates.length - 1]
  );
  const [calenderData, setCalenderData] = useState<any>({});
  const [emptyDates, setEmptyDates] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [toogle, setToogle] = useState<boolean>(false);

  const currentDate = useRef<any>(new Date());
  const MonthName = useRef<string>(moment(new Date()).format("MMMM"));
  const YearName = useRef<string>(moment(new Date()).format("YYYY"));
  const curr_month_today_date = moment(new Date()).format("YYYY-MM-DD");

  useEffect(() => {
    fetchCalenderData();
  }, [currency]);

  //=================================== Api Call ===================================//
  const fetchCalenderData = async () => {
    setLoading(true);
    const month = moment(MonthName.current, "MMMM").format("MMM");
    const date = `01-${month}-${YearName.current}`;
    const { data } = await be_instance.get(
      `${endpoints.fetchCalender}/${hotelId}/${date}/${currency.currency_code}/INR`
    );
    if (data.status === 1) {
      const curr_month = moment(currentDate.current).format("MMM");
      const next_month = moment(currentDate.current)
        .add(1, "months")
        .format("MMM");
      const curr_month_data = data.details[curr_month];
      const next_month_data = data.details[next_month];
      setCalenderData((prev: any) => {
        return {
          ...prev,
          [curr_month]: curr_month_data,
          [next_month]: next_month_data,
        };
      });
      setLoading(false);
    }
  };
  const moveToPrevMonth = () => {
    setToogle((prev) => !prev);
    const currVal = moment(currentDate.current).format();
    currentDate.current = moment(currVal).subtract(1, "months").format();
    MonthName.current = moment(currentDate.current).format("MMMM");
    YearName.current = moment(currentDate.current).format("YYYY");
  };

  const moveToNextMonth = () => {
    setToogle((prev) => !prev);
    const currVal = moment(currentDate.current).format();
    currentDate.current = moment(currVal).add(1, "months").format();
    MonthName.current = moment(currentDate.current).format("MMMM");
    YearName.current = moment(currentDate.current).format("YYYY");
    const month = moment(MonthName.current, "MMMM").format("MMM");
    if (!calenderData[month]) {
      fetchCalenderData();
    }
  };

  const handleDateClick = (e: any) => {
    if (!e.is_room_available) {
      return;
    }

    if (selectedFirstDateVal === "" && selectedEndDateVal === "") {
      setSelectedFirstDateVal(e.date);
      setSelectedDatesArr([e.date]);
    } else if (selectedFirstDateVal !== "" && selectedEndDateVal === "") {
      let dates: string[] = [];
      if (moment(selectedFirstDateVal).isBefore(e.date)) {
        dates = selectDatesInBetween(selectedFirstDateVal, e.date);
      } else if (moment(selectedFirstDateVal).isAfter(e.date)) {
        dates = selectDatesInBetween(e.date, selectedFirstDateVal);
      }

      const is_blocked_dates_available_in_selected_dates =
        checkBlockedDatesInSelectedDates(dates);

      if (is_blocked_dates_available_in_selected_dates) {
        setSelectedFirstDateVal(e.date);
        setSelectedEndDateVal("");
        setSelectedDatesArr([e.date]);
      } else {
        if (moment(selectedFirstDateVal).isBefore(e.date)) {
          setSelectedEndDateVal(e.date);
          setSelectedDatesArr(dates);
        } else if (moment(selectedFirstDateVal).isAfter(e.date)) {
          setSelectedEndDateVal(selectedFirstDateVal);
          setSelectedFirstDateVal(e.date);
          setSelectedDatesArr(dates);
        }
      }
    } else if (selectedFirstDateVal !== "" && selectedEndDateVal !== "") {
      if (e.date === selectedFirstDateVal || e.date === selectedEndDateVal) {
        return;
      }
      setSelectedFirstDateVal(e.date);
      setSelectedEndDateVal("");
      setSelectedDatesArr([e.date]);
    }
  };

  function selectDatesInBetween(firstDate: string, endDate: string) {
    const datesArray = [];
    const currentDate = moment(firstDate);
    const lastDate = moment(endDate);

    while (currentDate <= lastDate) {
      datesArray.push(currentDate.format("YYYY-MM-DD"));
      currentDate.add(1, "day");
    }

    return datesArray;
  }

  function checkBlockedDatesInSelectedDates(dates: string[]) {
    // return true if blocked dates are available in selected dates or false if not

    return dates.some((date) => {
      const month = moment(date).format("MMM");
      const date_data = calenderData[month].find((e: any) => e.date === date);
      return !date_data.is_room_available;
    });
  }

  const selectsDatesIntoListOnHover = (e: any, data: any) => {
    if (selectedFirstDateVal && selectedEndDateVal === "") {
      let arr: string[] = [];

      if (moment(selectedFirstDateVal).isBefore(e.date)) {
        arr = selectDatesInBetween(selectedFirstDateVal, e.date);
      } else if (moment(selectedFirstDateVal).isAfter(e.date)) {
        arr = selectDatesInBetween(e.date, selectedFirstDateVal);
      }
      if (checkBlockedDatesInSelectedDates(arr)) {
        setSelectedDatesArr([selectedFirstDateVal]);
        return;
      }
      setSelectedDatesArr([...arr]);
    }
  };

  const calculateEmptyDates = (month: string, year: string) => {
    const startOfMonth_DayName = moment(`${month} ${year}`, "MMMM YYYY")
      .startOf("month")
      .format("ddd");
    const null_days = daysList.indexOf(startOfMonth_DayName);
    setEmptyDates([...Array(null_days).keys()]);
  };

  useEffect(() => {
    calculateEmptyDates(MonthName.current, YearName.current);
  }, [MonthName.current, YearName.current]);

  const goToNextPage = () => {
    if (selectedDatesArr.length) {
      const checkin = moment(selectedDatesArr[0]).format("DD-MMM-YYYY");
      const checkout = moment(
        selectedDatesArr[selectedDatesArr.length - 1]
      ).format("DD-MMM-YYYY");
      dispatch(setCheckIn(checkin));
      dispatch(setCheckOut(checkout));
      dispatch(setSelectdDates(selectedDatesArr));
      dispatch(nextToPage2());
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.calender}>
          <div className={styles.monthDisplaySect}>
            <div className={styles.left}>
              <i
                className={`bi bi-arrow-left `}
                onClick={
                  moment().format("MMMM")?.toLowerCase() ===
                    MonthName.current?.toLowerCase() &&
                  moment().format("YYYY") === YearName.current
                    ? () => {}
                    : () => moveToPrevMonth()
                }
              ></i>
            </div>
            <div className={styles.middle}>
              <div className={styles.monthName}>{MonthName.current}</div>
              <div className={styles.year}>{YearName.current}</div>
            </div>
            <div className={styles.right}>
              <i className={`bi bi-arrow-right`} onClick={moveToNextMonth}></i>
            </div>
          </div>
          <div className={styles.daysDisplaySect}>
            {daysList.map((day, id) => {
              return (
                <div key={id} className={styles.day}>
                  {day}
                </div>
              );
            })}
          </div>
          <div className={styles.datesDisplaySect}>
            {loading ? (
              [...Array(42).keys()].map((e) => {
                return <Skeleton style={{ height: "100%" }} />;
              })
            ) : (
              <>
                {emptyDates.map((e, id) => (
                  <div key={id}></div>
                ))}
                {calenderData[
                  moment(MonthName.current, "MMMM").format("MMM")
                ]?.map((e: any, id: any) => {
                  const date = e.date.split("-")[2];
                  const { minimum_rates, currency_symbol, is_room_available } =
                    e;
                  const codePoint = parseInt(currency_symbol, 16);
                  const symbol = String.fromCodePoint(codePoint);
                  // if date is before today
                  if (
                    moment(e.date, "YYYY-MM-DD").isBefore(curr_month_today_date)
                  ) {
                    return (
                      <div className={styles.dateHolder}>
                        <div className={styles.date}>{date}</div>
                      </div>
                    );
                  }
                  return (
                    <>
                      <div
                        className={
                          is_room_available
                            ? selectedDatesArr.includes(e.date)
                              ? selectedDatesArr[0] === e.date ||
                                selectedDatesArr[
                                  selectedDatesArr.length - 1
                                ] === e.date
                                ? styles.firstandlastselectedDateHolder
                                : styles.dateHolderEnabledSelected
                              : styles.dateHolderEnabled
                            : styles.dateHolderBlocked
                        }
                        onClick={() => {
                          handleDateClick(e);
                        }}
                        onMouseEnter={() => {
                          selectsDatesIntoListOnHover(
                            e,
                            calenderData[
                              moment(MonthName.current, "MMMM").format("MMM")
                            ]
                          );
                        }}
                      >
                        <div className={styles.date}>{date}</div>
                        <div className={styles.amount}>
                          {is_room_available
                            ? `${symbol}${minimum_rates} `
                            : ""}
                        </div>
                      </div>
                    </>
                  );
                })}
              </>
            )}
          </div>
        </div>
        <Button
          btnClick={goToNextPage}
          btnDisabled={
            selectedFirstDateVal && selectedEndDateVal ? false : true
          }
          btnText={"Check Availability"}
          pageNo={1}
        />
      </div>
    </>
  );
};

export default BookingCalender;
