import { useState } from "react";
import { BiShare, BiShareAlt } from "react-icons/bi";
import { FiShare } from "react-icons/fi";

export const ShareButton = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      (err) => {
        console.log("failed to copy", err.mesage);
      }
    );
  };

  return (
    <button
      onClick={copyToClipboard}
      disabled={copied}
      className="
      h-[40px] inline-flex items-center rounded-md border border-gray-300 bg-white px-5 py-3 
      text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
    >
      {copied ? "Link Copied!" : "Share"}
      {!copied && <FiShare className="scale-110 ml-2" />}
    </button>
  );
};
