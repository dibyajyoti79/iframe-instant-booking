import axios from "axios";

export const be_instance = axios.create({
  baseURL: "https://be.bookingjini.com",
});

export const kernel_instance = axios.create({
  baseURL: "https://kernel.bookingjini.com",
});

export const instant_be_instance = axios.create({
  baseURL: "https://be.bookingjini.com/extranetv4/instant-booking",
});
