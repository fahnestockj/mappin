import React from "react"
import { BiShare } from "react-icons/bi";

type IProps = {
}
export const CopyButton = (props: IProps) => {
  const [copied, setCopied] = React.useState<boolean>(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        setCopied(true)
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      (err) => {
        console.log("failed to copy", err.mesage);
      }
    )
  }


  return (
    <button
      onClick={copyToClipboard}
      disabled={copied}
      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    // className={
    //   btnStyle +
    //   " text-sm border w-36 border-gray-500 rounded p-2 transition"
    // }
    >
      {!copied && <BiShare className='scale-150 mr-2' /> }
      {copied ? 'Copied to Clipboard!' : 'Share this Chart'}
    </button>
  )
};


