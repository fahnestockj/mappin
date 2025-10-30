import { MdClose, MdOpenInNew } from "react-icons/md";

interface IProps {
  imageUrl: string | null; // null when loading
  date: string;
  satellite: string;
  speed: string;
  error?: string;
  onClose: () => void;
}

export function ImageLinkModal(props: IProps) {
  const { imageUrl, date, satellite, speed, error, onClose } = props;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl border-2 border-gray-300 p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Satellite Image
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-200 transition-colors"
            title="Close"
          >
            <MdClose className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Data Point Info */}
        <div className="space-y-1 mb-4 text-sm">
          <div className="flex gap-2">
            <span className="text-gray-600 font-medium">Date:</span>
            <span className="font-semibold">{date}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-600 font-medium">Satellite:</span>
            <span className="font-semibold">{satellite}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-600 font-medium">Speed:</span>
            <span className="font-semibold">{speed} m/yr</span>
          </div>
        </div>

        {/* Image / Link / Loading / Error */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : imageUrl ? (
          <>
            {/* Display the actual image */}
            <div className="mb-4 rounded-lg overflow-hidden border border-gray-300 max-w-md mx-auto bg-gray-50">
              <img
                src={imageUrl}
                alt={`Satellite image from ${date}`}
                className="w-full h-auto"
                onError={(e) => {
                  console.error('Failed to load image:', imageUrl);
                  e.currentTarget.style.display = 'none';
                  const errorMsg = e.currentTarget.nextElementSibling;
                  if (errorMsg) errorMsg.classList.remove('hidden');
                }}
              />
              <div className="hidden bg-gray-100 p-4 text-center">
                <p className="text-sm text-gray-600">Failed to load image</p>
              </div>
            </div>

            {/* Link button */}
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              <MdOpenInNew className="w-5 h-5" />
              <span>Open in New Tab</span>
            </a>
          </>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-600 font-semibold py-3 px-4 rounded-lg">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading image...</span>
          </div>
        )}
      </div>
    </div>
  );
}
