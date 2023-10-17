// import React, { useEffect } from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { Provider } from "react-redux";
// import Store from "./redux/store/Store";
// import axios from "axios";

// const root = ReactDOM.createRoot(
//   document.getElementById("Mw31A3qlpySYe9FG") as HTMLElement
// );
// const rootWidget = document.getElementById("Mw31A3qlpySYe9FG") as HTMLElement;
// const hotelId = rootWidget.getAttribute("hotelId");

// root.render(
//   // <React.StrictMode>
//   <Provider store={Store}>
//     <App hotelId={hotelId} />
//   </Provider>
//   // </React.StrictMode>
// );

// export default App;

import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import Store from "./redux/store/Store";
import axios from "axios";

const root = ReactDOM.createRoot(
  document.getElementById("Mw31A3qlpySYe9FG") as HTMLElement
);

// const rootWidget = document.getElementById("Mw31A3qlpySYEe9FG") as HTMLElement;
// const hotelId = rootWidget.getAttribute("hotelId");

root.render(
  <Provider store={Store}>
    <BrowserRouter>
      <Routes>
        <Route path="/hotels/:hotelId" element={<App />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  </Provider>
);
