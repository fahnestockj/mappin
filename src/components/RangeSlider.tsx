import ReactSlider, { ReactSliderProps } from "react-slider";
import cn from "classnames";
const RangeSlider = <T extends number | readonly number[]>(
  _props: ReactSliderProps<T>
) => {
  return (
    <ReactSlider
      {..._props}
      renderThumb={(props, state) => (
        <div
          {...props}
          className={
            "h-full aspect-square rounded-full bg-sky-700 hover:bg-sky-800 text-xs text-white flex items-center justify-center cursor-grab"
          }
        >
          {state.valueNow}
        </div>
      )}
      renderTrack={(props, state) => {
        const numPoints = Array.isArray(state.value)
          ? state.value.length
          : null;
        const isMulti = numPoints && numPoints > 0;
        const isFirst = state.index === 0;
        const isLast = isMulti && state.index === numPoints - 1;
        return (
          <div
            {...props}
            className={cn({
              //use 1/4 height or width depending on the orientation and make sure to center it.
              "h-1/4 top-1/2 -translate-y-1/2 rounded-full": true,
              "bg-gray-200": isFirst || !isLast,
              "bg-sky-900": isLast,
            })}
          />
        );
      }}
    />
  );
};
export default RangeSlider;
