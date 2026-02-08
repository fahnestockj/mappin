import { useState } from "react";
import { MdShare, MdContentCopy, MdCheck, MdClose } from "react-icons/md";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { IMarker } from "../types";

interface ShareButtonProps {
  markers: IMarker[];
}

export const ShareButton = ({ markers }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const close = () => {
    setIsOpen(false);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.log("failed to copy", err.message);
      }
    );
  };

  const params = new URLSearchParams(window.location.search);

  const xBounds = params.getAll("x");
  const yBounds = params.getAll("y");
  const intervalDays = params.getAll("int");
  const zoom = params.get("z");

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="secondary">
        <MdShare className="w-4 h-4" />
        Share
      </Button>

      <Modal isOpen={isOpen} onClose={close} size="md">
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Share this view</h2>
          <button
            onClick={close}
            className="p-1 rounded hover:bg-gray-200 transition-colors"
            title="Close"
          >
            <MdClose className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* URL + Copy */}
        <div className="flex gap-2">
          <div className="flex-1 min-w-0 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-mono text-gray-500 truncate select-all flex items-center">
            {window.location.href}
          </div>
          <Button onClick={copyToClipboard} variant="secondary">
            {copied ? (
              <MdCheck className="w-4 h-4 text-green-600" />
            ) : (
              <MdContentCopy className="w-4 h-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>

        {/* Summary sections */}
        <div className="mt-4 space-y-3 text-sm">
          <p className="font-medium text-gray-700">This link includes:</p>

          {/* Markers */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Markers ({markers.length})
            </h3>
            {markers.length === 0 ? (
              <p className="text-gray-400 text-xs">No markers placed</p>
            ) : (
              <div className="space-y-0.5">
                {markers.map((marker) => (
                  <div
                    key={marker.id}
                    className="flex items-center gap-2 py-1 px-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: marker.color }}
                    />
                    <span className="font-mono text-sm text-gray-600">
                      {marker.latLon.lat.toFixed(4)},{" "}
                      {marker.latLon.lon.toFixed(4)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chart Bounds */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Chart Bounds
            </h3>
            <div className="text-sm text-gray-600 space-y-0.5 px-2">
              {xBounds.length === 2 ? (
                <p>
                  Date range: {xBounds[0]} to {xBounds[1]}
                </p>
              ) : (
                <p>Date range: 1985 to present (default)</p>
              )}
              {yBounds.length === 2 ? (
                <p>
                  Speed range: {Number(yBounds[0]).toLocaleString()} to {Number(yBounds[1]).toLocaleString()} m/yr
                </p>
              ) : (
                <p>Speed range: -500 to 10,000 m/yr (default)</p>
              )}
            </div>
          </div>

          {/* Measurement Interval */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Measurement Interval
            </h3>
            <p className="text-sm text-gray-600 px-2">
              {intervalDays.length === 2
                ? `${intervalDays[0]} to ${intervalDays[1]} days`
                : "1 to 120 days (default)"}
            </p>
          </div>

          {/* Map */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Map
            </h3>
            <div className="text-sm text-gray-600 space-y-0.5 px-2">
              {markers.length > 0 && (() => {
                const centerIdx = Math.floor((markers.length - 1) / 2);
                const center = markers[centerIdx];
                return (
                  <p className="flex items-center gap-1.5">
                    Centered on
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: center.color }}
                    />
                    <span className="font-mono">
                      {center.latLon.lat.toFixed(4)}, {center.latLon.lon.toFixed(4)}
                    </span>
                  </p>
                );
              })()}
              <p>Zoom: {zoom ?? "7 (default)"}</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
