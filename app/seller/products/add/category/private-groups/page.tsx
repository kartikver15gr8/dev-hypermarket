"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState, Suspense } from "react";
import { CategoryInterface } from "@/lib/models";
import UploadForm from "@/components/UploadForm";
import { Widget } from "@uploadcare/react-widget";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { phantomWallet } from "@/store/atom/phantomWallet";
import MarkdownEditor from "@/components/MarkdownEditor";
import { usePrivy } from "@privy-io/react-auth";
import { userIdState } from "@/store/atom/userIdState";
import Link from "next/link";
import { discordAccessToken } from "@/store/atom/discordAccessToken";
import { toast } from "sonner";

const uploadcarekey = process.env.NEXT_PUBLIC_UPLOADCARE_KEY || "";

function ProductUploadContent() {
  const { user, authenticated, getAccessToken } = usePrivy();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [file, setFile] = useState(null);
  const [newDescription, setNewDescription] = useState("");
  const user_id = useRecoilValue(userIdState);
  const [subscriptionMode, setSubscriptionMode] = useState("");

  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  // const setSubscriptionPlan = (event: any) => {
  //   setSubscriptionMode(event.target.value);
  // };

  // const handleMarkdownChange = (value?: string) => {
  //   if (value) {
  //     setNewDescription(value);
  //   }
  // };

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  const [imageUrl, setImageUrl] = useState<string>("");

  // const handleFileUpload = (fileInfo: any) => {
  //   if (fileInfo) {
  //     const url = fileInfo.cdnUrl;
  //     setImageUrl(url);
  //   } else {
  //     console.log("No files");
  //   }
  // };

  const [toggleWhatIncluded, setToggleWhatIncluded] = useState(false);

  const handleToggleWhatIncluded = () => {
    setToggleWhatIncluded((prevState) => !prevState);
  };

  const [isToggled, setIsToggled] = useState(false);

  // const handleToggle = () => {
  //   setIsToggled((prevState) => !prevState);
  // };

  const [togglePayment, setTogglePayment] = useState<
    "onetime" | "subscription"
  >("onetime");
  const togglePaymentOptions = () => {
    setTogglePayment(togglePayment == "onetime" ? "subscription" : "onetime");
  };

  const [showSocials, setShowSocials] = useState(false);

  const toggleShowSocials = () => {
    setShowSocials(!showSocials);
  };

  // for Tags
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [categoryName, setCategoryName] = useState<string | undefined>("");
  const [categoryId, setCategoryId] = useState<string | number | undefined>();
  const userWalletAddress = useRecoilValue(phantomWallet);
  const [userId, setUserId] = useState(0);
  const [privyAccessToken, setPrivyAccessToken] = useState("");

  const [product_id, setProduct_id] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SWAGGER_API_V2}/categories`
      );
      setCategories(response.data);
    } catch (error) {
      console.log(`You got an error: ${error}`);
    }
  };

  useEffect(() => {
    // fetchUserId();
    fetchCategories();
  }, []);

  const handleChange = (event: any) => {
    const selectedCategoryId = event.target.value;
    if (categories) {
      const selectedCategory = categories.find(
        (category) => category.id === selectedCategoryId
      );
      // @ts-ignore
      setSelectedCategory(selectedCategory);

      setCategoryId(selectedCategory?.id);
      setCategoryName(selectedCategory?.name);
    }
  };

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

  // const formSubmit = async () => {
  //   try {
  //     if (!discordGuildId) {
  //       toast.info("Connect your discord first");
  //       return;
  //     }
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_SWAGGER_API_V2}/admin/product`,
  //       {
  //         // file: file,
  //         name: title,
  //         description: newDescription,
  //         price: price,
  //         compare_price: comparePrice,
  //         thumbnail_url: imageUrl,
  //         // user_id: user_id,
  //         category_id: categoryId,
  //         // status: 1,
  //       },
  //       {
  //         headers: {
  //           Accept: "application/json",
  //           Authorization: `Bearer ${privyAccessToken}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     // console.log(response.data);
  //     toast.info("product created, now you can list it.");

  //     setProduct_id(response.data.rowId);

  //     return response.data;
  //   } catch (error) {
  //     console.log(`You got an error: ${error}`);
  //   }

  //   console.log(selectedCategory);
  // };

  const createDiscordCall = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SWAGGER_API_V2}/admin/discord/${product_id}/create`,
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
      router.push("/seller/products/add/category/success");
      return response.data;
    } catch (error) {
      console.log(`Error while creating discord: ${error}`);
    }
  };

  const [discord_access_token, setDiscordAccessToken] =
    useRecoilState(discordAccessToken);
  const setAaccess = useSetRecoilState(discordAccessToken);

  const [discordGuildId, setDiscordGuildId] = useState("");
  const [discordServerName, setDiscordServerName] = useState("");
  const [discordAccess, setDiscordAccess] = useState("");

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
        console.log("GuildId: ", data.guild.name);

        toast.info(`You got your discord access token: ${data.access_token}`);
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

  return (
    <div className="pt-16 pb-20 px-[15px] sm:px-[20px] md:px-[40px] min-h-screen lg:px-[60px] xl:px-20 bg-[#FAF9F5] w-full relative overflow-y-auto hide-scrollbar h-[90vh] scroll-smooth ">
      <div className="mt-5  flex justify-between items-center">
        <div className=" w-fit">
          <div className="flex gap-x-2 items-center ">
            <p className="font-bold text-3xl italic">ADD PRODUCT</p>
          </div>
          <p>List your product on Sendit here.</p>
        </div>
      </div>
      {/* <ProductDescription /> */}

      {/* <Content /> */}
      <div className="mt-4 p-4 rounded-xl border bg-white">
        <p className="mb-2">What&apos;s Included</p>
        <div className="grid grid-cols-2 gap-x-4">
          <div className="border h-16 p-2 rounded-lg flex items-center justify-between px-4">
            <p className="">Private Group</p>
            <button
              onClick={toggleShowSocials}
              className={`flex items-center justify-between w-16 h-8 rounded-full p-1 transition-colors duration-300 
                ${showSocials ? "bg-blue-500" : "bg-gray-300"}`}
            >
              <span
                className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 
                ${showSocials ? "transform translate-x-8" : ""}`}
              ></span>
            </button>
          </div>
          <div className="border h-16 p-2 rounded-lg flex items-center justify-between px-4">
            <p>Digital Assets</p>
            <button
              onClick={handleToggleWhatIncluded}
              className={`flex items-center justify-between w-16 h-8 rounded-full p-1 transition-colors duration-300 
                ${toggleWhatIncluded ? "bg-blue-500" : "bg-gray-300"}`}
            >
              <span
                className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 
                ${toggleWhatIncluded ? "transform translate-x-8" : ""}`}
              ></span>
            </button>
          </div>
        </div>
        <div
          className={`overflow-hidden transition-all duration-1000 ease-in-out ${
            toggleWhatIncluded
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          {toggleWhatIncluded ? (
            <>
              <p className="text-[15px] md:text-lg mb-4 mt-4">Upload Content</p>
              <div className=" grid grid-cols-1 gap-x-5 rounded-md h-48">
                <div className="border rounded-md">
                  <div className="h-10 p-2 border-b bg-slate-200">
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
            </>
          ) : (
            <></>
          )}
        </div>
        <div
          className={`overflow-hidden transition-all duration-1000 ease-in-out ${
            showSocials ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {showSocials ? (
            <>
              <div className="grid grid-cols-1 gap-y-2 md:gap-y-0 md:grid-cols-2 gap-x-4 mt-4">
                <div>
                  <a
                    href={"/api/auth/discord"}
                    className={
                      discordGuildId && discordServerName
                        ? "border border-[#4B6161] bg-[#d9faf2] rounded-lg h-24 flex items-center px-2 gap-x-3 hover:bg-[#E4E4E5] transition-all duration-300"
                        : "border rounded-lg h-24 flex items-center px-2 gap-x-3 hover:bg-[#E4E4E5] transition-all duration-300"
                    }
                  >
                    <Image
                      className="w-10 md:w-12 lg:w-14"
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
                        {discordGuildId
                          ? `connected server: ${discordServerName}`
                          : `Offer exclusive access to your private Discord server`}
                      </p>
                    </div>
                  </a>
                </div>
                <>
                  <div
                    className="border rounded-lg h-24 flex items-center hover:bg-[#E4E4E5] transition-all duration-300 justify-between cursor-pointer"
                    onClick={handleCardClick}
                  >
                    <div className="flex items-center px-2 gap-x-3">
                      <Image
                        className="w-10 md:w-12 lg:w-14"
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
                          Provide access to your private Telegram channel
                        </p>
                      </div>
                    </div>
                  </div>

                  {isPopupOpen && (
                    <TokenPopup
                      onClose={handleClosePopup}
                      onGenerate={generateTelegramVerificationToken}
                      onCopy={copyTeleToken}
                      telegramCode={telegramVerificationToken}
                    />
                  )}
                </>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* <div>
        <p>{discordServerName}</p>
        <p>{discordGuildId}</p>
        <p>{discordAccess}</p>
        <p>{product_id}</p>
      </div> */}
      <div className="w-full flex justify-end items-center mt-4">
        <Link href={"/seller/dashboard"}>
          <Button className="mr-2 border rounded w-28 md:w-32 lg:w-36 text-xs md:text-sm bg-white text-black hover:bg-slate-200 transition-all duration-200">
            Check Dashboard
          </Button>
        </Link>

        <Button
          onClick={createDiscordCall}
          className="rounded w-28 md:w-32 lg:w-36 text-xs md:text-sm"
          disabled={!discordGuildId ? true : false}
        >
          List Product
        </Button>
      </div>
    </div>
  );
}
export default function ProductUpload() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductUploadContent />
    </Suspense>
  );
}

const Topbar = () => {
  return (
    <div className="mt-5  flex justify-between items-center">
      <div className=" w-fit">
        <div className="flex gap-x-2 items-center ">
          <p className="font-bold text-3xl italic">ADD PRODUCT</p>
        </div>
        <p>List your product on Sendit here.</p>
      </div>
      <div className="flex justify-center shadow-md items-center gap-x-1 w-24 bg-white rounded-md border h-10">
        <svg
          width="18"
          height="14"
          viewBox="0 0 18 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.01677 7.59427C0.90328 7.41457 0.846535 7.32472 0.81477 7.18614C0.79091 7.08204 0.79091 6.91788 0.81477 6.81378C0.846535 6.67519 0.90328 6.58534 1.01677 6.40564C1.95461 4.92066 4.74617 1.16663 9.00034 1.16663C13.2545 1.16663 16.0461 4.92066 16.9839 6.40564C17.0974 6.58534 17.1541 6.67519 17.1859 6.81378C17.2098 6.91788 17.2098 7.08204 17.1859 7.18614C17.1541 7.32472 17.0974 7.41457 16.9839 7.59427C16.0461 9.07926 13.2545 12.8333 9.00034 12.8333C4.74617 12.8333 1.95461 9.07926 1.01677 7.59427Z"
            stroke="#050505"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.00034 9.49996C10.381 9.49996 11.5003 8.38067 11.5003 6.99996C11.5003 5.61925 10.381 4.49996 9.00034 4.49996C7.61962 4.49996 6.50034 5.61925 6.50034 6.99996C6.50034 8.38067 7.61962 9.49996 9.00034 9.49996Z"
            stroke="#050505"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p>Preview</p>
      </div>
    </div>
  );
};

const TokenPopup = ({
  onClose,
  onGenerate,
  onCopy,
  telegramCode,
}: {
  onClose: any;
  onGenerate: any;
  onCopy: any;
  telegramCode: string;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white rounded-xl p-5 shadow-lg w-[700px]">
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
        <div className="mt-4 border rounded-xl ">
          <div className="rounded-t-xl border-b flex items-center h-12 px-4 bg-[#f2f3f4] justify-between">
            <div className="flex items-center gap-x-2 ">
              <h1 className="font-medium text-lg">Step 1:</h1>
              <p className="">Add Sendit Bot to your Telegram</p>
            </div>
            <button className="border border-[#c0c0c0] bg-white px-2 text-sm h-8 rounded-lg hover:bg-[#4E6465] hover:text-white transition-all duration-200">
              Watch Tutorial Video
            </button>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
