import { IColor } from "../types";

export const SvgCross = (color: IColor, className?: string) => {
  return (
    <svg
      className={`${className}`}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="70"
        y="73.427"
        width="400"
        height="74"
        style={{
          stroke: "rgb(0, 0, 0)",
          fill: `${color}`,
          paintOrder: "stroke",
          strokeWidth: "50px",
        }}
        transform="matrix(0.707107, -0.707107, 0.707107, 0.707107, -22.161585, 344.300842)"
      />
      <rect
        x="70"
        y="73.427"
        width="400"
        height="74"
        style={{
          stroke: "rgb(0, 0, 0)",
          fill: `${color}`,
          paintOrder: "stroke",
          strokeWidth: "50px",
        }}
        transform="matrix(0.707107, 0.707107, -0.707107, 0.707107, 134.005829, -37.536957)"
      />
      <rect
        x="269.831"
        y="1587.819"
        width="74"
        height="300"
        style={{
          stroke: "rgb(0, 0, 0)",
          paintOrder: "fill",
          strokeWidth: "0px",
          fill: `${color}`,
        }}
        transform="matrix(0.707107, 0.707107, -0.707107, 0.707107, 1281.520386, -1236.866333)"
      />
    </svg>
  );
};
