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
import { RoleSchema } from "@/lib/models";

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

  const [discordProductId, setDiscordProductId] = useState("");

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

  const [discordGuildId, setDiscordGuildId] = useState("");
  const [discordServerName, setDiscordServerName] = useState("");
  const [discordAccess, setDiscordAccess] = useState("");
  const [isDiscordPopup, setDiscordPopup] = useState(false);
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
        <div className="grid grid-cols-1 gap-y-2 md:gap-y-0 md:grid-cols-2 gap-x-4 mt-4">
          <div>
            <button
              className="border px-4 rounded-full h-8"
              onClick={() => setDiscordPopup(true)}
            >
              Manage Discord
            </button>
          </div>
          <div>
            <button
              className="border px-4 rounded-full h-8"
              onClick={() => setIsPopupOpen(true)}
            >
              Manage Telegram
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-y-2 md:gap-y-0 md:grid-cols-2 gap-x-4 mt-4">
          <>
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
                <div className=" w-full">
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
              />
            )}
          </>
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
                privyAccess={privyAccessToken}
                productId={"9990f0e3-9371-41fc-882c-cec213580ff1"}
              />
            )}
          </>
        </div>

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
          onClick={() => router.push("/seller/products/add/category/success")}
          className="rounded w-28 md:w-32 lg:w-36 text-xs md:text-sm"
          disabled={!discordGuildId ? true : false}
        >
          DONE
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
  productId,
  privyAccess,
}: {
  onClose: any;
  onGenerate: any;
  onCopy: any;
  telegramCode: string;
  productId: string;
  privyAccess: string;
}) => {
  const verificationToken = localStorage.getItem("TeleToken");
  const verifyTelegram = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SWAGGER_API_V2}/admin/telegram/${productId}/channels`,
        {
          params: {
            verification_code: verificationToken,
            filter: 1,
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${privyAccess}`,
          },
        }
      );
      console.log(response.data);
      toast.info(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      //@ts-ignore
      toast.info("Failed to verify, try again!");
    }
  };

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

const activeTabForDiscord = "px-4 border-b-2 border-black";
const inActiveTabForDiscord = "px-4 border-b-2";

const DiscordPopup = ({
  onClose,
  discordServerName,
  guildId,
  discordAccessToken,
  privyAccess,
  product_id,
  CreateDiscordProduct,
}: {
  onClose: any;
  discordServerName: string;
  guildId: string;
  discordAccessToken: string;
  privyAccess: string;
  product_id: string;
  CreateDiscordProduct: () => Promise<{ rowId: string } | void>;
}) => {
  const [tabOpen, setTabOpen] = useState<"roles" | "settings">("roles");
  const [roles, setRoles] = useState<RoleSchema[]>([]);

  const [selectedOption, setSelectedOption] = useState("No Action");

  const options = ["No Action", "Remove Role", "Kick User", "Remove All Users"];

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

  const rolesRefreshing = async () => {
    try {
      if (privyAccess) {
        await refetchRoles();
        await fetchRoles();
      }
    } catch (error) {
      toast.info("Error while refreshing roles");
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white rounded-xl p-5 shadow-lg w-[850px]">
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
                    className="bg-black text-white px-4 h-8 rounded-lg flex items-center "
                  >
                    <svg
                      className="w-5 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="white"
                        d="M5.1 16.05q-.55-.95-.825-1.95T4 12.05q0-3.35 2.325-5.7T12 4h.175l-1.6-1.6l1.4-1.4l4 4l-4 4l-1.4-1.4l1.6-1.6H12Q9.5 6 7.75 7.763T6 12.05q0 .65.15 1.275t.45 1.225zM12.025 23l-4-4l4-4l1.4 1.4l-1.6 1.6H12q2.5 0 4.25-1.763T18 11.95q0-.65-.15-1.275T17.4 9.45l1.5-1.5q.55.95.825 1.95T20 11.95q0 3.35-2.325 5.7T12 20h-.175l1.6 1.6z"
                      />
                    </svg>
                    <p>Refetch Roles</p>
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
              <div className="mb-3 font-medium text-[#5e5e5e]">
                <div className="flex justify-between">
                  <p>Available Roles</p>
                  <button
                    onClick={triggerRefetchRoles}
                    className="bg-black text-white px-4 h-8 rounded-lg flex items-center "
                  >
                    <svg
                      className="w-5 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="white"
                        d="M5.1 16.05q-.55-.95-.825-1.95T4 12.05q0-3.35 2.325-5.7T12 4h.175l-1.6-1.6l1.4-1.4l4 4l-4 4l-1.4-1.4l1.6-1.6H12Q9.5 6 7.75 7.763T6 12.05q0 .65.15 1.275t.45 1.225zM12.025 23l-4-4l4-4l1.4 1.4l-1.6 1.6H12q2.5 0 4.25-1.763T18 11.95q0-.65-.15-1.275T17.4 9.45l1.5-1.5q.55.95.825 1.95T20 11.95q0 3.35-2.325 5.7T12 20h-.175l1.6 1.6z"
                      />
                    </svg>
                    <p>Refetch Roles</p>
                  </button>
                </div>
                <div className="border w-full mt-2 p-1 rounded-md overflow-y-auto h-28 scroll-smooth">
                  {roles.length > 0 ? (
                    <div>
                      {roles?.map((role) => {
                        return (
                          <div
                            key={role.id}
                            className="flex items-center justify-between p-1 border border-white rounded hover:bg-[#F2F3F4] hover:border-[#d8d9da] transition-all duration-200 "
                          >
                            <p>{role.name}</p>
                            <button
                              onClick={() =>
                                handleAddRole(role.id, role.name, true)
                              }
                              className="border px-2 rounded bg-black text-white"
                              disabled={loading}
                            >
                              {loading ? "Adding..." : "Add Role"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className=" flex items-center justify-between text-black p-1 border border-white rounded hover:bg-[#F2F3F4] hover:border-[#d8d9da] transition-all duration-200 ">
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
                className="col-span-2 border border-black w-full z-10 shadow-xl text-white bg-black rounded-lg  h-10"
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
              <div className="border border-red-600 w-fit px-3 rounded-lg text-red-600 font-medium col-span-2 flex items-center gap-1">
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

            <div className="border flex items-center gap-x-1  w-fit px-2 rounded-lg h-9 bg-[#F2F3F4] border-[#9a9999]">
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
            <p className="mt-5 mb-3 font-medium text-[#5e5e5e]">
              Assign this role after past due bills
            </p>

            <div className="border flex items-center gap-x-1 w-fit px-3 rounded-lg h-9 bg-[#F2F3F4] border-[#9a9999]">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// gear button
{
  /* <button
onClick={() => setDiscordPopup(true)}
className="border border-[#767676] p-1 rounded-full flex justify-between items-center"
>
<svg
  xmlns="http://www.w3.org/2000/svg"
  className="w-6"
  viewBox="0 0 24 24"
>
  <path
    fill="#767676"
    d="m10.135 21l-.362-2.892q-.479-.145-1.035-.454q-.557-.31-.947-.664l-2.668 1.135l-1.865-3.25l2.306-1.739q-.045-.27-.073-.558q-.03-.288-.03-.559q0-.252.03-.53q.028-.278.073-.626L3.258 9.126l1.865-3.212L7.771 7.03q.448-.373.97-.673q.52-.3 1.013-.464L10.134 3h3.732l.361 2.912q.575.202 1.016.463t.909.654l2.725-1.115l1.865 3.211l-2.382 1.796q.082.31.092.569t.01.51q0 .233-.02.491q-.019.259-.088.626l2.344 1.758l-1.865 3.25l-2.681-1.154q-.467.393-.94.673t-.985.445L13.866 21zm1.838-6.5q1.046 0 1.773-.727T14.473 12t-.727-1.773t-1.773-.727q-1.052 0-1.776.727T9.473 12t.724 1.773t1.776.727"
  />
</svg>
</button> */
}
