export const SvgCross = (color: 'blue' | 'red' | 'yellow' | 'green') => {
  
  let rgb: string
  switch (color) {
    case 'blue':
      rgb = '0, 0, 255'
      break;
    case 'red':
      rgb = '255, 0, 0'
      break;
    case 'yellow':
      rgb = '255, 255, 0'
      break;
    case 'green':
      rgb = '0, 255, 0'
      break;
  }

  return (
    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <rect x="70" y="73.427" width="400" height="74" style={{ "stroke": "rgb(0, 0, 0)", "fill": `rgb(${rgb})`, "paintOrder": "stroke", "strokeWidth": "50px" }} transform="matrix(0.707107, -0.707107, 0.707107, 0.707107, -22.161585, 344.300842)" />
      <rect x="70" y="73.427" width="400" height="74" style={{ "stroke": "rgb(0, 0, 0)", "fill": `rgb(${rgb})`, "paintOrder": "stroke", "strokeWidth": "50px" }} transform="matrix(0.707107, 0.707107, -0.707107, 0.707107, 134.005829, -37.536957)" />
      <rect x="269.831" y="1587.819" width="74" height="300" style={{ "stroke": "rgb(0, 0, 0)", "paintOrder": "fill", "strokeWidth": "0px", "fill": `rgb(${rgb})` }} transform="matrix(0.707107, 0.707107, -0.707107, 0.707107, 1281.520386, -1236.866333)" />
    </svg>
  )
};