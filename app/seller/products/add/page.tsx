"use client";

import Image, { StaticImageData } from "next/image";
import ball from "@/public/ball.png";
import matrixcube from "@/public/matrixcube.png";
import cubeik from "@/public/cubeik.png";
import LinkIllu from "@/public/_static/illustrations/LinkIllu.png";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ProductPageTopbar from "@/components/Seller/ProductPageTopbar";
import { toast } from "sonner";
import { getAccessToken } from "@privy-io/react-auth";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { discordAccessToken } from "@/store/atom/discordAccessToken";
import { CategoryInterface } from "@/lib/models";
import UploadForm from "@/components/UploadForm";
import { Widget } from "@uploadcare/react-widget";
import { phantomWallet } from "@/store/atom/phantomWallet";
import MarkdownEditor from "@/components/MarkdownEditor";
import { usePrivy } from "@privy-io/react-auth";
import { userIdState } from "@/store/atom/userIdState";
import { RoleSchema } from "@/lib/models";
import spinnerLoader from "@/public/loaders/spinnerthree.svg";
import spinningLoader from "@/public/loaders/spinningloader.svg";
import { useRouter } from "next/navigation";

const tabActive = {
  img: "w-24",
  title: "font-medium text-2xl mt-4",
  shortDes: "text-xs mt-3",
};

const tabInactive = {
  img: "w-24 opacity-45",
  title: "font-medium text-2xl mt-4 text-[#a8a8a8]",
  shortDes: "text-xs mt-3 text-[#a8a8a8]",
};

const cardNotSelected =
  "flex items-center relative overflow-hidden border-[#DBDAD8]  px-4 gap-x-3 border rounded-xl h-32 hover:bg-[#EBEBEB] transition-all duration-500";

const cardSelected =
  "flex items-center  px-4 gap-x-3 border border-[#60646E] rounded-xl h-32 bg-[#EBEBEB] hover:bg-[#EBEBEB] transition-all duration-500";

function CategoryPageContent() {
  const searchParams = useSearchParams();
  const [link, setLink] = useState("");
  const productId = searchParams.get("productId");
  const [file, setFile] = useState(null);
  const [privyAccessToken, setPrivyAccessToken] = useState("");

  const router = useRouter();

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const [digitalAssetSelected, setDigitalAssetSelected] = useState(false);
  const [personalLinkSelected, setPersonalLinkSelected] = useState(false);
  const [discordSelected, setDiscordSelected] = useState(false);
  const [telegramSelected, setTelegramSelected] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          setPrivyAccessToken(token);
        }
      } catch (error) {
        console.log("You got an error while executing fetchToken()");
      }
    };
    fetchToken();
  }, []);

  // Pushing Digital Assets
  const pushFile = async () => {
    try {
      const productId = localStorage.getItem("PRODUCT_ID");
      if (!productId) {
        toast.info("Add your product first.");
        return;
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SWAGGER_API_V2}/admin/products/upload-file`,
        {
          file: file,
          product_id: productId,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${privyAccessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log(response.data);
      // router.push("/seller/products/add/category/success");
      if (response.data) {
        toast.info("Digital Asset pushed!");
      }
      return response.data;
    } catch (error) {
      toast.error(`You got an error: ${error}`);
    }
  };

  // Discord Product Creation Logic

  const [discordProductId, setDiscordProductId] = useState("");
  const [discordGuildId, setDiscordGuildId] = useState("");
  const [discordServerName, setDiscordServerName] = useState("");
  const [discordAccess, setDiscordAccess] = useState("");
  const [isDiscordPopup, setDiscordPopup] = useState(false);

  const createDiscordCall = async () => {
    const PRODUCT_ID = localStorage.getItem("PRODUCT_ID");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SWAGGER_API_V2}/admin/discord/${PRODUCT_ID}/create`,
        {
          server_discord_id: discordGuildId,
          server_name: discordServerName,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${privyAccessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setDiscordProductId(response.data.rowId);
      setDiscordPopup(true);
      localStorage.setItem("DISCORD_PRODUCT_ID", response.data.rowId);
      toast.info("Saved Progress, Your discord group is created!");
      // router.push("/seller/products/add/category/success");
      return response.data;
    } catch (error) {
      console.log(`Error while creating discord: ${error}`);
    }
  };

  const [discord_access_token, setDiscordAccessToken] =
    useRecoilState(discordAccessToken);
  const setAaccess = useSetRecoilState(discordAccessToken);
  const handleOnCloseDiscord = () => {
    setDiscordPopup(false);
  };

  const fetchAccessToken = async (code: any) => {
    try {
      const response = await fetch("/api/discord/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          redirectUri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Access Token:", data.access_token);
        console.log("GuildId: ", data.guild.id);
        console.log("Server Name: ", data.guild.name);
        localStorage.setItem("DISCORD_ACCESS_TOKEN", data.access_token);
        localStorage.setItem("DISCORD_SERVER_NAME", data.guild.name);
        localStorage.setItem("DISCORD_GUILD_ID", data.guild.id);
        setDiscordPopup(true);

        toast.info(
          `You got your discord access token: ${data.access_token}, you may now list the product.`
        );
        setAaccess(data.access_token);
        setDiscordAccess(data.access_token);
        setDiscordGuildId(data.guild.id);
        setDiscordServerName(data.guild.name);
        return {
          accessToken: data.access_token,
          guildId: data.guild.id,
          serverName: data.guild.name,
        };
      } else {
        console.error("Error fetching access token:", data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      fetchAccessToken(code);
    }
  }, []);

  // Telegram Logic

  const [telegramVerificationToken, setTelegramVerificationToken] =
    useState("");

  const generateTelegramVerificationToken = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    setTelegramVerificationToken(result);
    localStorage.setItem("TeleToken", result);
    toast.info("Telegram verification token generated!");
    return result;
  };

  const copyTeleToken = async () => {
    try {
      await navigator.clipboard.writeText(telegramVerificationToken);
      toast.info("Verification Token Copied");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleCardClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const selectDiscordAsProduct = () => {
    setTelegramSelected(false);
    setDiscordSelected(!discordSelected);
    toast.info(!discordSelected ? "Telegram selected" : "Telegram removed");
  };
  const selectTelegramAsProduct = () => {
    setDiscordSelected(false);
    setTelegramSelected(!telegramSelected);
    toast.info(!telegramSelected ? "Telegram selected" : "Telegram removed");
  };

  return (
    <div className="pt-16 pb-20 relative  min-h-screen bg-[#FAF9F5] flex flex-col items-center w-full px-[15px] sm:px-[20px] md:px-[40px] lg:px-[60px] xl:px-20 overflow-y-auto hide-scrollbar h-[90vh] scroll-smooth">
      <ProductPageTopbar barValue={35} />

      <div className="bg-white rounded-xl p-4 border border-[#DBDAD8] w-full mt-4">
        <div className="flex justify-between items-center">
          <p>Select product type</p>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-3 mt-5">
          <div
            onClick={() => {
              setDigitalAssetSelected(!digitalAssetSelected);
              toast.info(
                !digitalAssetSelected
                  ? "Digital assets selected"
                  : "Digital assets removed"
              );
            }}
            className={digitalAssetSelected ? cardSelected : cardNotSelected}
          >
            <Image
              className="w-10 md:w-12 lg:w-16 opacity-60"
              src={matrixcube}
              width={200}
              height={200}
              alt=""
            />
            <div>
              <p className="font-medium text-[14px] md:text-[16px] lg:text-lg">
                Digital Assets
              </p>
              <p className="text-[10px] md:text-[11px]">
                Share digital products like ebooks, courses, etc
              </p>
            </div>
          </div>
          <div
            onClick={() => {
              setPersonalLinkSelected(!personalLinkSelected);
              toast.info(
                !personalLinkSelected
                  ? "Private Link selected"
                  : "Private Link removed"
              );
            }}
            className={personalLinkSelected ? cardSelected : cardNotSelected}
          >
            <Image
              className="w-10 md:w-12 lg:w-16 opacity-80"
              src={LinkIllu}
              width={200}
              height={200}
              alt=""
            />
            <div>
              <p className="font-medium text-[14px] md:text-[16px] lg:text-lg">
                Private Buy Link
              </p>
              <p className="text-[10px] md:text-[11px]">Share a buy link</p>
            </div>
          </div>
          <div
            onClick={selectDiscordAsProduct}
            className={discordSelected ? cardSelected : cardNotSelected}
          >
            <Image
              className="w-10 md:w-12 lg:w-16"
              src="https://s3-alpha-sig.figma.com/img/c89a/0a74/93f942f4f36a009c22adc6177b140086?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LySqO17PCfD1vsF1049b38Kaiu1Q9R2qs4Org2J8QcaXMboKRJw~UPOYINNusCUcG~CxnQMC8sx8viEKNeKomYUGaPd9PVIIpl5eV3HaRTcSAAU6s0YJBISJM7WZsPQg-HPczVxb0-WaFBo2mGpC7OWlJ7g7FrhfmqnoAmdDb~iDOUSvHmcGsXVLtFaoyDkQC6xY1h--kEUHEqKlQ4JnGyocOw4tr3Omw8vFzEIi~F0nE7AchatNLdgF3ys7kOUsfmKhsOzeOItCDu76Pwh-cGndtwVMKyjpSshuZQ8kZF3EVYzjkbDg5xytwANpl7g8aokqwiz5CSQuCbOKqy2ycg__"
              width={200}
              height={200}
              alt=""
            />
            <div>
              <p className="font-medium text-[14px] md:text-[16px] lg:text-lg">
                Discord
              </p>
              <p className="text-[10px] md:text-[11px]">
                Offer exclusive access to your private Discord server
              </p>
            </div>
          </div>
          <div
            onClick={selectTelegramAsProduct}
            className={telegramSelected ? cardSelected : cardNotSelected}
          >
            <Image
              className="w-10 md:w-12 lg:w-16"
              src="https://s3-alpha-sig.figma.com/img/1d2b/bc7f/92849e7867a21edd110a2b0e8a256f6e?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=KXCbXmfq1IjfOOzrGJzfWCl9Yl9UNj-SWz-mlmqH5Zfi~0-uKfDEpBVvBiLH-5N276OISTmZBs~v0XbJNwZavOwEKoZxa0S8~8nrh5irCkhsO5eSz62DTQawoVza297qf-ty8lwAUSlsj8yWkU1oHuGdNHqFnIyWju7PNN-P9jDNBrG6MUYJSMwJzG-9lTWqIOyMv3RrOeJf-nUYxIYQcTFYWy~0RPmsJYxUqYVGeH3Ivbjqim0v73LNB6~37POazuSAHUVXmbRglScZRgv4JTIrqmRhBNqjp54EEIRxsmfACjFcfiv1liKgHHi7vCM3GC34T-YcXUAJ8md9NHZ3ZQ__"
              width={200}
              height={200}
              alt=""
            />
            <div>
              <p className="font-medium text-[14px] md:text-[16px] lg:text-lg">
                Telegram
              </p>
              <p className="text-[10px] md:text-[11px]">
                Provide access to your private Telegram channel.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section for uploading digital assets */}

      {digitalAssetSelected && (
        <>
          <div className=" p-4 w-full mt-5 bg-white rounded-xl border">
            <p className="mb-3">Upload your file</p>
            <div className=" grid grid-cols-1 gap-x-5 rounded-md h-48">
              <div className="border border-[#DBDAD8] rounded-md">
                <div className="h-10 p-2 border-b bg-[#ECECEF] border-[#DBDAD8]">
                  <p>Content Being Bought</p>
                </div>
                <div className="flex flex-col items-center justify-center h-36">
                  <input
                    className="text-xs sm:text-sm lg:text-[15px]"
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end w-full">
            <button
              onClick={pushFile}
              className="w-40 bg-black text-white h-10 rounded mt-3"
            >
              UPLOAD
            </button>
          </div>
        </>
      )}

      {/* Discord Selected Logic */}

      {discordSelected && (
        <>
          <div className="border w-full mt-5 rounded-xl bg-white p-4 border-[#DBDAD8]">
            <div className=" justify-end flex">
              <button
                className="border px-4 rounded-full h-8 border-[#DBDAD8] flex items-center gap-x-1 hover:bg-[#ECECEF] transition-all duration-300"
                onClick={() => setDiscordPopup(true)}
              >
                <p>Manage Discord</p>
                <svg
                  className="w-[18px]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#75757E"
                    d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.3 7.3 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68m-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5"
                  />
                </svg>
              </button>
            </div>
            <div className="h-64 mt-4 flex justify-center items-center border rounded-xl bg-[#ECECEF] border-[#DBDAD8] shadow-inner">
              <a
                href={"/api/auth/discord"}
                className={
                  discordGuildId && discordServerName
                    ? "border bg-[#b8e6e3] shadow-2xl border-[#99f1ed] rounded-2xl h-24 flex items-center px-2 gap-x-3 hover:bg-[#E4E4E5] transition-all duration-300"
                    : "border bg-[#d0d7f6] shadow-2xl border-[#99aaf1] rounded-2xl h-24 flex items-center px-2 gap-x-3 hover:bg-[#ffffff] transition-all duration-300"
                }
              >
                <Image
                  className="w-10 md:w-12 lg:w-14"
                  src="https://s3-alpha-sig.figma.com/img/c89a/0a74/93f942f4f36a009c22adc6177b140086?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LySqO17PCfD1vsF1049b38Kaiu1Q9R2qs4Org2J8QcaXMboKRJw~UPOYINNusCUcG~CxnQMC8sx8viEKNeKomYUGaPd9PVIIpl5eV3HaRTcSAAU6s0YJBISJM7WZsPQg-HPczVxb0-WaFBo2mGpC7OWlJ7g7FrhfmqnoAmdDb~iDOUSvHmcGsXVLtFaoyDkQC6xY1h--kEUHEqKlQ4JnGyocOw4tr3Omw8vFzEIi~F0nE7AchatNLdgF3ys7kOUsfmKhsOzeOItCDu76Pwh-cGndtwVMKyjpSshuZQ8kZF3EVYzjkbDg5xytwANpl7g8aokqwiz5CSQuCbOKqy2ycg__"
                  width={200}
                  height={200}
                  alt=""
                />
                <div className=" w-full">
                  <p className="font-bold text-[14px] md:text-[16px] lg:text-lg text-[#304cbc]">
                    {discordGuildId ? `Connected` : `Connect Your Discord`}
                  </p>
                  <p className="text-[10px] md:text-[11px] text-[#304cbc]">
                    {discordGuildId
                      ? `connected server: ${discordServerName}`
                      : `Offer exclusive access to your private Discord server`}
                  </p>
                </div>
              </a>
            </div>
          </div>
          {isDiscordPopup && (
            <DiscordPopup
              onClose={handleOnCloseDiscord}
              discordAccessToken={discordAccess ? discordAccess : ""}
              discordServerName={
                discordServerName ? discordServerName : "No Server"
              }
              guildId={discordGuildId ? discordGuildId : ""}
              privyAccess={privyAccessToken}
              product_id={discordProductId ? discordProductId : "djfk"}
              CreateDiscordProduct={createDiscordCall}
              setDiscordGuildId={setDiscordGuildId}
              setDiscordServerName={setDiscordServerName}
            />
          )}
        </>
      )}

      {/* Telegram Selected Logic */}

      {telegramSelected && (
        <>
          <div className="border w-full mt-5 rounded-xl bg-white p-4 border-[#DBDAD8]">
            <div className=" justify-end flex">
              <button
                className="border px-4 rounded-full h-8 border-[#DBDAD8] flex items-center gap-x-1 hover:bg-[#ECECEF] transition-all duration-300"
                onClick={() => setIsPopupOpen(true)}
              >
                <p>Manage Telegram</p>
                <svg
                  className="w-[18px]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#75757E"
                    d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.3 7.3 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68m-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5"
                  />
                </svg>
              </button>
            </div>
            <div className="h-64 mt-4 flex justify-center items-center border rounded-xl bg-[#ECECEF] border-[#DBDAD8] shadow-inner">
              <div
                onClick={handleCardClick}
                className="border bg-[#c9e5f3] shadow-2xl border-[#388ab0] rounded-2xl h-24 flex items-center px-2 gap-x-3 hover:bg-[#ffffff] transition-all duration-300"
              >
                <Image
                  className="w-10 md:w-12 lg:w-14"
                  src="https://s3-alpha-sig.figma.com/img/1d2b/bc7f/92849e7867a21edd110a2b0e8a256f6e?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=KXCbXmfq1IjfOOzrGJzfWCl9Yl9UNj-SWz-mlmqH5Zfi~0-uKfDEpBVvBiLH-5N276OISTmZBs~v0XbJNwZavOwEKoZxa0S8~8nrh5irCkhsO5eSz62DTQawoVza297qf-ty8lwAUSlsj8yWkU1oHuGdNHqFnIyWju7PNN-P9jDNBrG6MUYJSMwJzG-9lTWqIOyMv3RrOeJf-nUYxIYQcTFYWy~0RPmsJYxUqYVGeH3Ivbjqim0v73LNB6~37POazuSAHUVXmbRglScZRgv4JTIrqmRhBNqjp54EEIRxsmfACjFcfiv1liKgHHi7vCM3GC34T-YcXUAJ8md9NHZ3ZQ__"
                  width={200}
                  height={200}
                  alt=""
                />
                <div>
                  <p className="font-bold text-[#216585] text-[14px] md:text-[16px] lg:text-lg xl:text-xl">
                    Telegram
                  </p>
                  <p className="text-[10px] text-[#216585] md:text-[11px]">
                    Provide access to your private Telegram channel
                  </p>
                </div>
              </div>
            </div>
          </div>

          {isPopupOpen && (
            <TelegramPopup
              onClose={handleClosePopup}
              onGenerate={generateTelegramVerificationToken}
              onCopy={copyTeleToken}
              telegramCode={telegramVerificationToken}
              privyAccess={privyAccessToken}
            />
          )}
        </>
      )}

      {/* Section for personalized buy Links */}

      {personalLinkSelected && (
        <>
          <div className="border mt-6 rounded-xl p-4 w-full bg-white">
            <p className="font-medium text-lg">Share the product link below</p>
            <div className="grid grid-cols-1 gap-x-5 mt-4">
              <div className="">
                <input
                  type="text"
                  className="border w-full h-12 p-2 flex items-center rounded outline-none"
                  placeholder="Enter Buy Link"
                  onChange={(e: any) => {
                    setLink(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end w-full">
            <button className="w-40 bg-black text-white h-10 rounded mt-3">
              ADD LINK
            </button>
          </div>
        </>
      )}

      <div className="flex mt-5 justify-end w-full">
        <button
          onClick={() => router.push("/seller/products/add/category/success")}
          className="h-9 bg-black text-white w-40 font-medium rounded-md"
        >
          FINISH
        </button>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryPageContent />
    </Suspense>
  );
}

const TelegramPopup = ({
  onClose,
  onGenerate,
  onCopy,
  telegramCode,
  privyAccess,
}: {
  onClose: any;
  onGenerate: any;
  onCopy: any;
  telegramCode: string;
  privyAccess: string;
}) => {
  const verificationToken = localStorage.getItem("TeleToken");
  const verifyTelegram = async () => {
    const PRODUCT_ID = localStorage.getItem("PRODUCT_ID");
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SWAGGER_API_V2}/admin/telegram/${PRODUCT_ID}/channels`,
        {
          params: {
            verification_code: verificationToken,
            filter: 0,
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${privyAccess}`,
          },
        }
      );
      if (response.data) {
        toast.info("Channel Verified");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      //@ts-ignore
      toast.info("Failed to verify, try again!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-5 shadow-lg w-[700px] shadow-[#616368]">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2 items-center">
            <Image
              className="w-6 md:w-7 lg:w-8"
              src="https://s3-alpha-sig.figma.com/img/1d2b/bc7f/92849e7867a21edd110a2b0e8a256f6e?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=KXCbXmfq1IjfOOzrGJzfWCl9Yl9UNj-SWz-mlmqH5Zfi~0-uKfDEpBVvBiLH-5N276OISTmZBs~v0XbJNwZavOwEKoZxa0S8~8nrh5irCkhsO5eSz62DTQawoVza297qf-ty8lwAUSlsj8yWkU1oHuGdNHqFnIyWju7PNN-P9jDNBrG6MUYJSMwJzG-9lTWqIOyMv3RrOeJf-nUYxIYQcTFYWy~0RPmsJYxUqYVGeH3Ivbjqim0v73LNB6~37POazuSAHUVXmbRglScZRgv4JTIrqmRhBNqjp54EEIRxsmfACjFcfiv1liKgHHi7vCM3GC34T-YcXUAJ8md9NHZ3ZQ__"
              width={200}
              height={200}
              alt=""
            />
            <h2 className="text-lg font-semibold">Connect Your Telegram</h2>
          </div>
          <div className="flex gap-x-2 items-center">
            <button className="border border-[#c0c0c0] bg-white px-2 text-sm h-8 rounded-lg hover:bg-[#4E6465] hover:text-white transition-all duration-200">
              Watch Tutorial Video
            </button>
            <button onClick={onClose} className="">
              <svg
                className="w-7 hover:rotate-180 transition-all duration-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="black"
                  d="m8.4 16.308l3.6-3.6l3.6 3.6l.708-.708l-3.6-3.6l3.6-3.6l-.708-.708l-3.6 3.6l-3.6-3.6l-.708.708l3.6 3.6l-3.6 3.6zM12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-4 border rounded-xl ">
          <div className="rounded-t-xl border-b flex items-center h-12 px-4 bg-[#f2f3f4] justify-between">
            <div className="flex items-center gap-x-2 ">
              <h1 className="font-medium text-lg">Step 1:</h1>
              <p className="">Add Sendit Bot to your Telegram</p>
            </div>
            <a
              href="https://t.me/sendit_markets_bot"
              target="_blank"
              className="border flex items-center border-[#c0c0c0] bg-white px-2 text-sm h-8 rounded-lg hover:bg-[#4E6465] hover:text-white transition-all duration-200"
            >
              Click here to get Telegram bot
            </a>
          </div>

          <div className="border-b p-2 flex justify-center px-4 flex-col h-20">
            <p className=" font-medium">Group</p>
            <p className="text-sm text-[#7F7F7F]">
              For a group, add Sendit bot as a member
            </p>
          </div>
          <div className=" p-2 flex justify-center px-4 flex-col h-20">
            <p className=" font-medium">Channel</p>
            <p className="text-sm text-[#7F7F7F]">
              For a channel, add Sendit bot as an admin
            </p>
          </div>
        </div>
        <div className="mt-4 border rounded-xl ">
          <div className="rounded-t-xl border-b flex items-center gap-x-2 h-12 px-4 bg-[#f2f3f4]">
            <h1 className="font-medium text-lg">Step 2:</h1>
            <p className="">Generate and Verify the unique verification code</p>
          </div>

          <div className=" p-2 flex justify-center px-4 flex-col py-2">
            <p className=" font-medium">Verify</p>
            <ul className=" list-disc text-sm ml-4 mt-2 text-[#7F7F7F]">
              <li>Generate the code by clicking on the generate button</li>
              <li>
                Paste it in your channel/group once the Sendit Bot is added
              </li>
              <li>
                Once you have pasted the code in your group, click on the verify
                button down below.
              </li>
            </ul>

            <div className="flex justify-between items-center mt-3">
              <p className="bg-[#E2E8F0] px-4 rounded">
                {telegramCode ? telegramCode : ""}
              </p>
              <div className="flex gap-x-2">
                <button
                  onClick={onGenerate}
                  className=" mt-3 h-8 bg-black text-white rounded-lg w-24 hover:bg-[#586e6e] hover:text-white transition-all duration-300"
                >
                  Generate
                </button>

                <button
                  onClick={onCopy}
                  className="flex items-center gap-x-1 mt-3 h-8 bg-black text-white rounded-lg w-24 justify-center hover:bg-[#586e6e] hover:text-white transition-all duration-300"
                >
                  <svg
                    className="w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="white"
                      d="M9.116 17q-.691 0-1.153-.462T7.5 15.385V4.615q0-.69.463-1.153T9.116 3h7.769q.69 0 1.153.462t.462 1.153v10.77q0 .69-.462 1.152T16.884 17zm0-1h7.769q.23 0 .423-.192t.192-.423V4.615q0-.23-.192-.423T16.884 4H9.116q-.231 0-.424.192t-.192.423v10.77q0 .23.192.423t.423.192m-3 4q-.69 0-1.153-.462T4.5 18.385V6.615h1v11.77q0 .23.192.423t.423.192h8.77v1zM8.5 16V4z"
                    />
                  </svg>
                  Copy
                </button>
                <button
                  onClick={verifyTelegram}
                  className=" mt-3 h-8 bg-[#3e607e] border border-[#314b62] text-white rounded-lg w-24 hover:bg-[#586e6e] hover:text-white transition-all duration-300"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import ManageDiscordBot from "@/public/_static/background/ManageDiscordBot.png";
import { Button } from "@/components/ui/button";

const activeTabForDiscord = "px-4 border-b-2 border-black cursor-pointer";
const inActiveTabForDiscord = "px-4 border-b-2 cursor-pointer";

const DiscordPopup = ({
  onClose,
  discordServerName,
  guildId,
  discordAccessToken,
  privyAccess,
  product_id,
  CreateDiscordProduct,
  setDiscordGuildId,
  setDiscordServerName,
}: {
  onClose: any;
  discordServerName: string;
  guildId: string;
  discordAccessToken: string;
  privyAccess: string;
  product_id: string;
  CreateDiscordProduct: () => Promise<{ rowId: string } | void>;
  setDiscordServerName: React.Dispatch<React.SetStateAction<string>>;
  setDiscordGuildId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [tabOpen, setTabOpen] = useState<"roles" | "settings">("roles");
  const [roles, setRoles] = useState<RoleSchema[]>([]);

  const [selectedOption, setSelectedOption] = useState("No Action");

  const options = ["No Action", "Remove Role", "Kick User", "Remove All Users"];

  const handleDisconnectDiscord = () => {
    setDiscordGuildId("");
    setDiscordServerName("");
    toast.info("Discord Disconnected!");
  };

  const refetchRoles = async () => {
    const productId = localStorage.getItem("PRODUCT_ID");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SWAGGER_API_V2}/admin/discord/${productId}/roles`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${privyAccess}`,
          },
        }
      );
    } catch (error) {
      toast.error("Error while refreshing roles");
    }
  };

  const fetchRoles = async () => {
    const productId = localStorage.getItem("PRODUCT_ID");
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SWAGGER_API_V2}/admin/discord/${productId}/roles?filter=false`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${privyAccess}`,
          },
        }
      );
      console.log(response.data);
      setRoles(response.data);
      // router.push("/seller/products/add/category/success");
      return response.data;
    } catch (error) {
      console.log(`Error while creating discord: ${error}`);
    }
  };
  const [loading, setLoading] = useState(false);

  const AddRole = async ({
    roleId,
    roleName,
    includeStatus,
  }: {
    roleId: string;
    includeStatus: boolean;
    roleName: string;
  }) => {
    const productId = localStorage.getItem("PRODUCT_ID");
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SWAGGER_API_V2}/admin/discord/${productId}/roles`,
        { role_id: roleId, include_status: includeStatus },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${privyAccess}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      toast.info(`${roleName} is added`);
    } catch (error) {
      setLoading(false);
      toast.info("Failed to add role");
    }
  };
  const handleAddRole = (
    roleId: string,
    roleName: string,
    includeStatus: boolean
  ) => {
    AddRole({
      roleId: roleId,
      roleName: roleName,
      includeStatus: includeStatus,
    });
  };

  const [isRefetching, setIsRefetching] = useState(false);

  const rolesRefreshing = async () => {
    setIsRefetching(true);
    try {
      if (privyAccess) {
        await refetchRoles();
        await fetchRoles();
      }
      setIsRefetching(false);
    } catch (error) {
      toast.info("Error while refreshing roles");
      setIsRefetching(false);
    }
  };

  const triggerRefetchRoles = () => {
    if (guildId) {
      rolesRefreshing();
    } else {
      toast.info("First go and click on 'SAVE PROGRESS' in the Roles tab.");
    }
  };

  useEffect(() => {
    if (guildId) {
      rolesRefreshing();
    }
  }, [guildId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-10">
      <div className="bg-white rounded-xl p-5 shadow-lg w-[850px] shadow-[#616368]">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2 items-center">
            <Image
              className="w-6 md:w-7 lg:w-8 rounded-lg"
              src="https://discord.apps.whop.com/_next/image/?url=%2F_static%2Fdiscord.png&w=64&q=75"
              width={200}
              height={200}
              alt=""
            />
            <h2 className="text-lg font-semibold">Manage Your Discord</h2>
          </div>
          <button onClick={onClose} className="">
            <svg
              className="w-7 hover:rotate-180 transition-all duration-300"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                fill="black"
                d="m8.4 16.308l3.6-3.6l3.6 3.6l.708-.708l-3.6-3.6l3.6-3.6l-.708-.708l-3.6 3.6l-3.6-3.6l-.708.708l3.6 3.6l-3.6 3.6zM12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4">
          <div className="flex">
            <p
              onClick={() => {
                setTabOpen("roles");
              }}
              className={
                tabOpen == "roles" ? activeTabForDiscord : inActiveTabForDiscord
              }
            >
              Roles
            </p>
            <p
              onClick={() => {
                setTabOpen("settings");
              }}
              className={
                tabOpen == "settings"
                  ? activeTabForDiscord
                  : inActiveTabForDiscord
              }
            >
              Settings
            </p>
          </div>
        </div>

        {tabOpen == "roles" && (
          <div className="mt-4 border p-4 rounded-lg">
            {roles.length <= 0 ? (
              <>
                <div className="mb-1 flex justify-between">
                  <div>
                    <p className="font-medium text-xl">Something Went Wrong!</p>
                    <p className="text-sm">
                      Please open Discord, go to your server&apos;s settings,
                      and drag SENDIT Bot to the top of your roles.
                    </p>
                  </div>
                  <button
                    onClick={triggerRefetchRoles}
                    className="text-black px-4 h-8 rounded-lg flex items-center hover:bg-[#DBDAD8] transition-all duration-300 "
                  >
                    {isRefetching ? (
                      <Image className="w-6" src={spinningLoader} alt="" />
                    ) : (
                      <svg
                        className="w-5 mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="black"
                          d="M5.1 16.05q-.55-.95-.825-1.95T4 12.05q0-3.35 2.325-5.7T12 4h.175l-1.6-1.6l1.4-1.4l4 4l-4 4l-1.4-1.4l1.6-1.6H12Q9.5 6 7.75 7.763T6 12.05q0 .65.15 1.275t.45 1.225zM12.025 23l-4-4l4-4l1.4 1.4l-1.6 1.6H12q2.5 0 4.25-1.763T18 11.95q0-.65-.15-1.275T17.4 9.45l1.5-1.5q.55.95.825 1.95T20 11.95q0 3.35-2.325 5.7T12 20h-.175l1.6 1.6z"
                        />
                      </svg>
                    )}
                    <p>{isRefetching ? "Fetching…" : "Refetch Roles"}</p>
                  </button>
                </div>
                <div className="border rounded-md h-96 w-full flex items-center justify-center overflow-hidden bg-[#32333A]">
                  <Image
                    src={ManageDiscordBot}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </>
            ) : (
              <div className="mb-3 font-medium text-[#60646E]">
                <div className="flex justify-between">
                  <p>Available Roles</p>
                  <button
                    onClick={triggerRefetchRoles}
                    className="text-black px-4 h-8 rounded-lg flex items-center hover:bg-[#DBDAD8] transition-all duration-300 "
                  >
                    {isRefetching ? (
                      <Image className="w-6" src={spinningLoader} alt="" />
                    ) : (
                      <svg
                        className="w-5 mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="black"
                          d="M5.1 16.05q-.55-.95-.825-1.95T4 12.05q0-3.35 2.325-5.7T12 4h.175l-1.6-1.6l1.4-1.4l4 4l-4 4l-1.4-1.4l1.6-1.6H12Q9.5 6 7.75 7.763T6 12.05q0 .65.15 1.275t.45 1.225zM12.025 23l-4-4l4-4l1.4 1.4l-1.6 1.6H12q2.5 0 4.25-1.763T18 11.95q0-.65-.15-1.275T17.4 9.45l1.5-1.5q.55.95.825 1.95T20 11.95q0 3.35-2.325 5.7T12 20h-.175l1.6 1.6z"
                        />
                      </svg>
                    )}
                    <p>{isRefetching ? "Fetching…" : "Refetch Roles"}</p>
                  </button>
                </div>
                <div className="border w-full mt-2 p-1 rounded-md overflow-y-auto h-52 scroll-smooth">
                  {roles.length > 0 ? (
                    <div>
                      {roles?.map((role, key) => {
                        return (
                          <div
                            key={key}
                            className="border-b px-2 flex items-center justify-between p-1 h-12 hover:bg-[#F2F3F4] hover:rounded hover:border-[#d8d9da] transition-all duration-200 "
                          >
                            <p>{role.name}</p>
                            <button
                              onClick={() =>
                                handleAddRole(role.id, role.name, true)
                              }
                              className="border w-24 h-8 rounded-lg bg-[#ECECEF] text-[#60646E] border-[#60646E] hover:bg-[#44698b] hover:text-white transition-all duration-300"
                              disabled={loading}
                            >
                              {loading ? "Adding..." : "Add Role"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="border-b px-2 flex items-center justify-between p-1 h-12    hover:bg-[#F2F3F4] hover:rounded hover:border-[#d8d9da] transition-all duration-200 ">
                      <p> No Roles Fetched!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-10 gap-x-2 items-center mt-3">
              <div className="col-span-8 gap-x-2 border border-[#7F7F7F] h-10 items-center flex text-lg p-1 rounded px-2 w-full">
                <p className="font-medium col-span-2">Connected Server: </p>
                <p> {discordServerName}</p>
              </div>
              <Button
                onClick={CreateDiscordProduct}
                className="col-span-2 border border-black w-full z-10 shadow-xl text-white bg-black rounded-md  h-10"
              >
                SAVE PROGRESS
              </Button>
            </div>

            {/* <div className=" mt-2 p-4 flex items-center justify-center rounded-lg border relative w-full h-96 bg-black bg-opacity-65">
              <Image
                src={
                  "https://imgs.search.brave.com/XfgddFVUkZ-YyQmowtlwOCm0SfUgo82hQmJ8O3Ru8fQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTAy/MjU3MTQ2L3Bob3Rv/L2xlYWRlcnNoaXAu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PVBXNWl6M1Q0bTdX/djFqSnlrT3d5OGZr/YTBOSU83Mmt3ZDc5/U3NDdTRNRUk9"
                }
                alt=""
                layout="fill" // Use layout fill to cover the entire div
                objectFit="cover" // Ensure the image covers the div without distortion
                className="rounded-lg opacity-45" // Optional: Add rounded corners to the image
              />
              <button className="border border-[#9A9999] bg-white z-10 shadow-xl rounded-xl  w-40 h-10">
                SELECT ROLES
              </button>
             
             
             


            </div> */}
          </div>
        )}

        {tabOpen == "settings" && (
          <div className="border rounded-xl mt-4 p-4">
            <p className="font-medium text-[#5e5e5e]">Discord Server</p>
            <div className="grid grid-cols-10 gap-x-2 mt-2">
              <p className="col-span-8 border px-2 h-8 items-center flex rounded-lg border-[#9a9999]">
                {discordServerName}
              </p>
              <div
                onClick={handleDisconnectDiscord}
                className="border cursor-pointer border-red-600 w-fit px-3 rounded-lg text-red-600 font-medium col-span-2 flex items-center gap-1 hover:bg-red-300 transition-all duration-300"
              >
                <svg
                  className="w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#DC2C25"
                    d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zm3-4q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17"
                  />
                </svg>
                <p>Disconnect</p>
              </div>
            </div>

            <p className="mt-5 mb-3 font-medium text-[#5e5e5e]">
              Event Log Channels
            </p>

            <div className="cursor-pointer border flex items-center gap-x-1  w-fit px-2 rounded-lg h-9 bg-[#F2F3F4] border-[#9a9999]">
              <svg
                className="w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#020817"
                  d="M12 21q-.425 0-.712-.288T11 20v-7H4q-.425 0-.712-.288T3 12t.288-.712T4 11h7V4q0-.425.288-.712T12 3t.713.288T13 4v7h7q.425 0 .713.288T21 12t-.288.713T20 13h-7v7q0 .425-.288.713T12 21"
                />
              </svg>
              <p>Add channels</p>
            </div>
            {/* <p className="mt-5 mb-3 font-medium text-[#5e5e5e]">
              Assign this role after past due bills
            </p> */}

            {/* <div className="border flex items-center gap-x-1 w-fit px-3 rounded-lg h-9 bg-[#F2F3F4] border-[#9a9999]">
              <svg
                className="w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#020817"
                  d="M15 7q-.425 0-.712-.288T14 6t.288-.712T15 5h6q.425 0 .713.288T22 6t-.288.713T21 7zm0 4q-.425 0-.712-.288T14 10t.288-.712T15 9h6q.425 0 .713.288T22 10t-.288.713T21 11zm0 4q-.425 0-.712-.288T14 14t.288-.712T15 13h6q.425 0 .713.288T22 14t-.288.713T21 15zm-7-1q-1.25 0-2.125-.875T5 11t.875-2.125T8 8t2.125.875T11 11t-.875 2.125T8 14m-6 5v-.9q0-.525.25-1t.7-.75q1.125-.675 2.388-1.012T8 15t2.663.338t2.387 1.012q.45.275.7.75t.25 1v.9q0 .425-.288.713T13 20H3q-.425 0-.712-.288T2 19"
                />
              </svg>
              <p>Select Roles</p>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

{
  /* <div className="flex justify-end w-full">
  <button className="w-40 bg-black text-white h-10 rounded mt-3">
    NEXT
  </button>
  </div> */
}

// Previous Commented Code

// const ProductCard = ({
//   img,
//   title,
//   examples,
//   redirectHref,
//   isActive,
// }: {
//   img: string | StaticImageData;
//   title: string;
//   examples: string;
//   redirectHref: string;
//   isActive: boolean;
// }) => {
//   return (
//     <Link
//     href={redirectHref}
//     className="border rounded-lg border-[#E5E5E5] bg-[#F5F5F5]  flex flex-col items-center justify-center aspect-square hover:bg-[#e5e5e5] transition-all duration-300 z-50"
//     >
//       <Image
//         className={isActive ? tabActive.img : tabInactive.img}
//         src={img}
//         alt=""
//         />
//       <p className={isActive ? tabActive.title : tabInactive.title}>{title}</p>
//       <p className={isActive ? tabActive.shortDes : tabInactive.shortDes}>
//         {examples}
//       </p>
//     </Link>
//   );
// };

{
  /* <div className="w-[80%]">
  <div className="flex gap-x-1 mt-10 xl:mt-20 items-center">
  <p className="font-bold text-3xl italic">ADD PRODUCT</p>
  </div>
  <p className="text-xs text-[#52525C]">
  List your product on Hyper here.
        </p>
        <div className="rounded-xl border border-[#E5E5E5]  p-4 mt-6 bg-white">
          <p className="text-xl font-medium">Select Product&apos;s Category</p>
          <p className="text-sm mt-2 text-[#52525C]">Categories:</p>
          <div className="grid grid-cols-1 gap-y-4 md:gap-y-0 md:grid-cols-3 mt-4 gap-x-4">
            <ProductCard
              redirectHref={`/seller/products/add/category/digital-products?productId=${productId}`}
              img={matrixcube}
              title="Digital Products"
              examples="Ebooks, Softwares, Design Templates, and more..."
              isActive={true}
            />
            <ProductCard
              redirectHref={`/seller/products/add/category/private-groups?productId=${productId}`}
              img={cubeik}
              title="Private Groups"
              examples="Alpha Groups!"
              isActive={true}
            />
            <ProductCard
              redirectHref={`/seller/products/add/category/links?productId=${productId}`}
              img={LinkIllu}
              title="Links"
              examples="Sell products through buy links!"
              isActive={true}
            />
          </div>
        </div>
      </div> */
}
