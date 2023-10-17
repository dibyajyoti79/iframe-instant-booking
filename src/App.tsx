// // import bootstrap
// import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

// import bootstrap icon
import "bootstrap-icons/font/bootstrap-icons.css";

// Custom Style Sheet
import "include-media/dist/_include-media.scss";
import "./assets/css/styles.min.css";

import React, { useEffect, useState } from "react";
import WidgetButton from "../src/components/WidgetButton/WidgetButton";
import axios from "axios";
import endpoints from "./API/endpoints";
import { instant_be_instance } from "./API/baseurl";
import { isBrowser } from "react-device-detect";
import { useParams } from "react-router-dom";

const App: React.FC<any> = () => {
  const { hotelId } = useParams();
  const [active, setActive] = useState<boolean>(false);
  const [props, setProps] = useState<any>({});

  const fetchWidgetData = async () => {
    try {
      const { data } = await instant_be_instance.get(
        `${endpoints.setup}/${hotelId}`
      );
      if (data.status === 1) {
        const widget_obj = data.data;
        const props = {
          position: `bottom-${widget_obj.widget_position}`,
          logo: widget_obj.logo,
          hotelId: hotelId,
          apikey: widget_obj.api_key,
          theme: widget_obj.theme_color,
        };
        setActive(widget_obj.is_active);
        setProps(props);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (hotelId) {
      fetchWidgetData();
    }
  }, [hotelId]);

  return <>{!active || !isBrowser ? <></> : <WidgetButton {...props} />}</>;
};

export default App;
