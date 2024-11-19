"use client";

import Head from "next/head";
import { useState, useEffect, useRef } from "react";

const baseUrl = process.env.BASE_URL;
const chatLinks = [
  `${baseUrl}/chat/embed/6c781138-97a0-4541-b280-5377a0fac187`,
];

export default function IframePage() {
  const [selectedChat, setSelectedChat] = useState(chatLinks[0]);
  const [iframeSrc, setIframeSrc] = useState<string>("");

  useEffect(() => {
    setIframeSrc(selectedChat);
  }, [selectedChat]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === "REQUEST_JWT_TOKEN") {
        const tokenResp = await fetch("/api/authenticate").then((res) =>
          res.json()
        );
        const jwtToken = tokenResp.token;
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: "JWT_TOKEN_RESPONSE",
            token: jwtToken,
          },
          "*"
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      <Head>
        <title>Embedded Content</title>
      </Head>
      <div className="flex flex-col items-center min-h-screen p-4">
        <h1 className="text-4xl font-bold mb-8">Embedded Content</h1>
        <div className="flex w-4/5 gap-4">
          <div className="w-64 bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Select Chat</h2>
            <div className="flex flex-col gap-2">
              {chatLinks.map((link, index) => (
                <button
                  key={link}
                  onClick={() => setSelectedChat(link)}
                  className={`p-2 rounded ${
                    selectedChat === link
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Chat {index + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 h-[800px]">
            <iframe
              src={iframeSrc}
              className="w-full h-full border-0"
              allow="fullscreen"
              ref={iframeRef}
            />
          </div>
        </div>
      </div>
    </>
  );
}
