import { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";

interface DualRangeSliderProps {
  min: number;
  max: number;
  defaultValue: [number, number];
  onAfterChange?: (value: [number, number]) => void;
  className?: string;
}

export default function DualRangeSlider({
  min,
  max,
  defaultValue,
  onAfterChange,
  className,
}: DualRangeSliderProps) {
  const [minVal, setMinVal] = useState(defaultValue[0]);
  const [maxVal, setMaxVal] = useState(defaultValue[1]);
  const minValRef = useRef(defaultValue[0]);
  const maxValRef = useRef(defaultValue[1]);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Get thumb position accounting for thumb width
  const getThumbPosition = useCallback(
    (value: number) => {
      const percent = (value - min) / (max - min);
      const thumbWidth = 40; // Width of thumb in pixels
      const trackWidth = 100; // Assume percentage-based positioning
      // Adjust position to account for thumb size
      return `calc(${percent * 100}% + ${(0.5 - percent) * thumbWidth}px)`;
    },
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Trigger callback when user stops dragging
  const handleMinMouseUp = () => {
    if (onAfterChange) {
      onAfterChange([minVal, maxVal]);
    }
  };

  const handleMaxMouseUp = () => {
    if (onAfterChange) {
      onAfterChange([minVal, maxVal]);
    }
  };

  return (
    <div className={classNames("relative w-full h-10 flex items-center", className)}>
      {/* Background track */}
      <div className="absolute w-full h-1 bg-gray-200 rounded-full" />

      {/* Active range track */}
      <div
        ref={range}
        className="absolute h-1 bg-sky-900 rounded-full"
      />

      {/* Min thumb input */}
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
        }}
        onMouseUp={handleMinMouseUp}
        onTouchEnd={handleMinMouseUp}
        className="thumb thumb-left"
        style={{ zIndex: minVal > max - 100 ? 5 : 3, touchAction: 'none' }}
      />

      {/* Max thumb input */}
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        onMouseUp={handleMaxMouseUp}
        onTouchEnd={handleMaxMouseUp}
        className="thumb thumb-right"
        style={{ zIndex: 4, touchAction: 'none' }}
      />

      {/* Min value label */}
      <div
        className="absolute -translate-x-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-sky-700 text-white text-xs font-medium pointer-events-none select-none"
        style={{ left: getThumbPosition(minVal), zIndex: minVal > max - 100 ? 6 : 4 }}
      >
        {minVal}
      </div>

      {/* Max value label */}
      <div
        className="absolute -translate-x-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-sky-700 text-white text-xs font-medium pointer-events-none select-none"
        style={{ left: getThumbPosition(maxVal), zIndex: 5 }}
      >
        {maxVal}
      </div>

      <style>{`
        .thumb {
          pointer-events: none;
          position: absolute;
          height: 0;
          width: 100%;
          outline: none;
          appearance: none;
          background: transparent;
        }

        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: all;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: rgb(3 105 161);
          cursor: grab;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .thumb::-webkit-slider-thumb:active {
          cursor: grabbing;
          background: rgb(7 89 133);
        }

        .thumb::-webkit-slider-thumb:hover {
          background: rgb(7 89 133);
        }

        .thumb::-moz-range-thumb {
          pointer-events: all;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: rgb(3 105 161);
          cursor: grab;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .thumb::-moz-range-thumb:active {
          cursor: grabbing;
          background: rgb(7 89 133);
        }

        .thumb::-moz-range-thumb:hover {
          background: rgb(7 89 133);
        }
      `}</style>
    </div>
  );
}
