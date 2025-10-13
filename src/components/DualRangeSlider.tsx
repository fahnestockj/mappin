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
    <div className={classNames("relative w-full", className)}>
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
        style={{ zIndex: minVal > max - 100 ? 5 : undefined }}
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
      />

      {/* Slider track container */}
      <div className="relative w-full">
        {/* Background track */}
        <div className="absolute w-full h-1 bg-gray-200 rounded-full top-1/2 -translate-y-1/2" />

        {/* Active range track */}
        <div
          ref={range}
          className="absolute h-1 bg-sky-900 rounded-full top-1/2 -translate-y-1/2"
        />

        {/* Min value label */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-sky-700 text-white text-xs font-medium pointer-events-none"
          style={{ left: `${getPercent(minVal)}%` }}
        >
          {minVal}
        </div>

        {/* Max value label */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-sky-700 text-white text-xs font-medium pointer-events-none"
          style={{ left: `${getPercent(maxVal)}%` }}
        >
          {maxVal}
        </div>
      </div>

      <style>{`
        .thumb {
          pointer-events: none;
          position: absolute;
          height: 0;
          width: 100%;
          outline: none;
          top: 50%;
          transform: translateY(-50%);
        }

        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: all;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: transparent;
          cursor: grab;
          position: relative;
          z-index: 3;
        }

        .thumb::-webkit-slider-thumb:active {
          cursor: grabbing;
        }

        .thumb::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 8px rgba(14, 116, 144, 0.1);
        }

        .thumb::-webkit-slider-thumb:focus {
          box-shadow: 0 0 0 8px rgba(14, 116, 144, 0.2);
        }

        .thumb::-moz-range-thumb {
          pointer-events: all;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: transparent;
          cursor: grab;
          position: relative;
          z-index: 3;
        }

        .thumb::-moz-range-thumb:active {
          cursor: grabbing;
        }

        .thumb::-moz-range-thumb:hover {
          box-shadow: 0 0 0 8px rgba(14, 116, 144, 0.1);
        }

        .thumb::-moz-range-thumb:focus {
          box-shadow: 0 0 0 8px rgba(14, 116, 144, 0.2);
        }
      `}</style>
    </div>
  );
}
