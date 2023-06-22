import ReactSlider, { ReactSliderProps } from "react-slider";
import cn from "classnames";
const RangeSlider = 
<T extends number | readonly number[]>(
  _props: ReactSliderProps<T>
) => {
  const isVertical = _props.orientation === "vertical";
  return (
    <ReactSlider
      {..._props}
      renderThumb={(props, state) => (
        <div
          {...props}
          className={cn({
            "h-full": !isVertical,
            "w-full": isVertical,
            "aspect-square rounded-full bg-sky-700 hover:bg-sky-800 text-xs text-white flex items-center justify-center cursor-grab":
              true,
          })}
        >
          {state.valueNow}
        </div>
      )}
      renderTrack={(props, state) => {
        const numPoints = Array.isArray(state.value) ? state.value.length : null;
        const isMulti = numPoints && numPoints > 0;
        //So is last is true when the index is the last index of the array?? but its indexed from 0 
        const isFirst = state.index === 0;
        const isLast = isMulti && (state.index === numPoints - 1);
        
        
        return (
          <div
            {...props}
            className={cn({
              //use 1/4 height or width depending on the orientation and make sure to center it.
              "h-1/4 top-1/2 -translate-y-1/2": !isVertical,
              "w-1/4 left-1/2 -translate-x-1/2": isVertical,
              "rounded-full": true,
              "bg-gray-200": isFirst || !isLast,
              "bg-sky-900":  isLast,
            })}
          />
        );
      }}
    />
  );
};
export default RangeSlider;
