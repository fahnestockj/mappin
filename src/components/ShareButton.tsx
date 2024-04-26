import React from "react";
import { BiShare } from "react-icons/bi";

type IProps = {};
export const ShareButton = (props: IProps) => {
  const [copied, setCopied] = React.useState<boolean>(false);

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
      h-[3rem] inline-flex items-center rounded-md border border-gray-300 bg-white px-5 py-3 
      text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none 
      focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {!copied && <BiShare className="scale-150 mr-2" />}
      {copied ? "Link Copied!" : "Share"}
    </button>
  );
};
