import { useState } from "react";
import { FiShare } from "react-icons/fi";
import { Button } from "./Button";

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
        console.log("failed to copy", err.message);
      }
    );
  };

  return (
    <Button onClick={copyToClipboard} disabled={copied} variant="secondary">
      {copied ? "Link Copied!" : "Share"}
      {!copied && <FiShare className="scale-110 ml-2" />}
    </Button>
  );
};
