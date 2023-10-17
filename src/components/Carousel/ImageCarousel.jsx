import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./imageCarousel.module.scss";
import img from "../../assets/images/room_image.png";

const ImageCarousel = ({ imgarr }) => {
  // console.log(imgarr);
  // const imgarr = [
  //   "https://bityl.co/GVhp",
  //   "https://bityl.co/GYRh",
  //   "https://bityl.co/GYS0",
  // ];

  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePreviousSlide = () => {
    if (activeIndex === 0) return;
    sliderRef.current.slickPrev();
    setActiveIndex(activeIndex - 1);
  };

  const handleNextSlide = () => {
    if (activeIndex === imgarr.length - 1) return;
    sliderRef.current.slickNext();
    setActiveIndex(activeIndex + 1);
  };

  const handleSlideChange = (index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    sliderRef.current.slickGoTo(activeIndex);
  }, [activeIndex]);

  var settings = {
    dots: false,
    arrows: false,
    infinite: false,
    afterChange: handleSlideChange,
  };

  return (
    <div className={styles.container}>
      <div className={styles.slider}>
        <Slider {...settings} ref={sliderRef}>
          {imgarr.map((img, index) => (
            <div className={styles.imgContainer} key={index}>
              <img className={styles.carouselimg} src={img} alt="img" />
            </div>
          ))}
        </Slider>
      </div>
      <div className={styles.navigationContainer}>
        <i
          className={`bi bi-arrow-left-short ${styles.arrow}`}
          onClick={handlePreviousSlide}
        ></i>
        <div className={styles.dotsContainer}>
          {imgarr.map((_, index) => (
            <div
              className={`${styles.dot} ${
                activeIndex === index ? styles.activedot : ""
              }`}
              key={index}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <i
          className={`bi bi-arrow-right-short ${styles.arrow}`}
          onClick={handleNextSlide}
        ></i>
      </div>
    </div>
  );
};

export default ImageCarousel;
