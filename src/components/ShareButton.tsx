import { useState } from "react";
import { BiShare } from "react-icons/bi";

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
      {!copied && <BiShare className="scale-150 mr-2" />}
      {copied ? "Link Copied!" : "Share"}
    </button>
  );
};
