import React from "react";
import { UpgradeButtonProps } from "../../types";
import diamondSmallIcon from "../../assets/diamondsmall.webp";

const UpgradeButton: React.FC<UpgradeButtonProps> = ({
  title,
  currentValue,
  price,
  description,
  disabled,
  onClick,
  multiplier = false,
}) => {
  return (
    <button className="upgrade-btn" onClick={onClick} disabled={disabled}>
      {title} (Current: {multiplier ? "x" : ""}
      {currentValue})
      <span className="price">
        Cost: {price}{" "}
        <img src={diamondSmallIcon} alt="diamonds" className="diamond-icon" />
      </span>
      {description && <span className="description">{description}</span>}
    </button>
  );
};

export default UpgradeButton;
