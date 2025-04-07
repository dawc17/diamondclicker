import React from "react";

interface ClickPowerDisplayProps {
  clickPower: number;
  multiClickPower: number;
}

const ClickPowerDisplay: React.FC<ClickPowerDisplayProps> = ({
  clickPower,
  multiClickPower,
}) => {
  return (
    <div className="click-power-display">
      <div className="click-power-title">Click Power</div>
      <div className="click-power-formula">
        <span className="power-value">{clickPower}</span>
        <span className="power-operator">×</span>
        <span className="power-value">{multiClickPower}</span>
        <span className="power-operator">=</span>
        <span className="power-result">{clickPower * multiClickPower}</span>
      </div>
      <div className="click-power-label">per click</div>
    </div>
  );
};

export default ClickPowerDisplay;
