import React from "react";
import styles from "./CustomTextField.module.scss"; // Import your SCSS module

const CustomTextField = (props: any) => {
  const { label, id, onChange, name, value, error, helperText } = props;

  return (
    <div className={styles["custom-text-field-container"]}>
      <input
        className={`${error ? styles["error"] : ""}`}
        type="text"
        id={id}
        placeholder=" "
        onChange={onChange}
        name={name}
        value={value}
      />
      <label htmlFor={id}>{label}</label>
      {error && (
        <div className={styles["custom-text-field-error"]}>{helperText}</div>
      )}
    </div>
  );
};

export default CustomTextField;
