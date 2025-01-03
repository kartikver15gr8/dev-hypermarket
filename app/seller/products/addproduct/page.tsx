"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CategoryInterface } from "@/lib/models";
import UploadForm from "@/components/UploadForm";
import { Widget } from "@uploadcare/react-widget";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { phantomWallet } from "@/store/atom/phantomWallet";
import MarkdownEditor from "@/components/MarkdownEditor";
import { usePrivy } from "@privy-io/react-auth";
import { userIdState } from "@/store/atom/userIdState";
import Link from "next/link";
import { toast } from "sonner";

import ProductPageTopbar from "@/components/Seller/ProductPageTopbar";

const uploadcarekey = process.env.NEXT_PUBLIC_UPLOADCARE_KEY || "";

export default function AddProduct() {
  const { user, authenticated, getAccessToken } = usePrivy();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [file, setFile] = useState(null);
  const [newDescription, setNewDescription] = useState("");
  const user_id = useRecoilValue(userIdState);

  const handleMarkdownChange = (value?: string) => {
    if (value) {
      setNewDescription(value);
    }
  };

  // const handleFileChange = (event: any) => {
  //   const selectedFile = event.target.files[0];
  //   setFile(selectedFile);
  // };

  const [imageUrl, setImageUrl] = useState<string>("");

  const handleFileUpload = (fileInfo: any) => {
    if (fileInfo) {
      const url = fileInfo.cdnUrl;
      setImageUrl(url);
    } else {
      console.log("No files");
    }
  };

  // for Tags
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [categoryName, setCategoryName] = useState<string | undefined>("");
  const [categoryId, setCategoryId] = useState<string | number | undefined>();
  const userWalletAddress = useRecoilValue(phantomWallet);
  const [userId, setUserId] = useState(0);
  const [privyAccessToken, setPrivyAccessToken] = useState("");
  const [productId, setProductId] = useState("");
  const [isSubscription, setIsSubscription] = useState(false);
  const [threeMonthSubsPrice, setThreeMonthSubsPrice] = useState("");
  const [sixMonthSubsPrice, setSixMonthSubsPrice] = useState("");
  const [annualSubsPrice, setAnnualSubsPrice] = useState("");

  const togglePricingModel = () => {
    setIsSubscription(!isSubscription);
  };

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

  useEffect(() => {
    if (productId) {
      router.push(`/seller/products/add?productId=${productId}`);
    }
  }, [productId]);

  const formSubmit = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SWAGGER_API_V2}/admin/product`,
        {
          name: title,
          description: newDescription,
          price: price,
          compare_price: comparePrice,
          thumbnail_url: imageUrl,
          category_id: categoryId,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${privyAccessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProductId(response.data.rowId);
      localStorage.setItem("PRODUCT_ID", response.data.rowId);
      return response.data;
    } catch (error) {
      console.log(`You got an error: ${error}`);
    }

    console.log(selectedCategory);
  };

  // const pushFile = async () => {
  //   try {
  //     if (productId.length < 4) {
  //       toast.info("Add your product first.");
  //       return;
  //     }
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_SWAGGER_API_V2}/admin/products/upload-file`,
  //       {
  //         file: file,
  //         product_id: productId,
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
  //     router.push("/seller/products/add/category/success");
  //     return response.data;
  //   } catch (error) {
  //     toast.error(`You got an error: ${error}`);
  //   }

  //   console.log(selectedCategory);
  // };

  return (
    <div className="pt-16 pb-20 px-[15px] sm:px-[20px] md:px-[40px] min-h-screen lg:px-[60px] xl:px-20 bg-[#FAF9F5] w-full relative overflow-y-auto hide-scrollbar h-[90vh] scroll-smooth ">
      <ProductPageTopbar barValue={10} />
      {/* <ProductDescription /> */}
      <div className="border  h-96 rounded-xl p-4 bg-white">
        <p className="font-medium text-lg">Describe your product</p>
        <div className="grid grid-cols-1 gap-x-5 mt-4">
          <div className="">
            <p className="text-xs mb-2">Title</p>
            <input
              type="text"
              className="border w-full h-12 p-2 flex items-center rounded outline-none"
              placeholder="Enter title"
              onChange={(e: any) => {
                setTitle(e.target.value);
              }}
            />
          </div>
        </div>
        <p className="mt-3 text-xs mb-2">Description</p>

        <MarkdownEditor
          initialValue=""
          onChange={handleMarkdownChange}
          minHeight={300}
        />
      </div>
      <div className="mt-5 p-4 flex flex-col bg-white rounded-xl border">
        {categories && (
          <select
            className=" outline-none"
            id="category-select"
            //@ts-ignore
            value={selectedCategory?.id || ""}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>
      {/* <Pricing /> */}

      <div className="mt-4 p-4 rounded-xl border bg-white">
        {/* Toggle Button */}
        <div className="mb-4 flex justify-between items-center ">
          <p className="text-lg">Pricing</p>
          <button
            onClick={togglePricingModel}
            className={`px-4 py-2 rounded-lg ${
              isSubscription
                ? "bg-[#4B6161] hover:bg-[#658282] transition-all duration-300 text-white"
                : "bg-[#ECECEF] hover:bg-[#c9c9c9] transition-all duration-300 text-black"
            }`}
          >
            {isSubscription
              ? "Switch to Fixed Pricing"
              : "Switch to Subscription"}
          </button>
        </div>

        {/* Pricing Inputs */}
        {isSubscription ? (
          <div className="grid grid-cols-3 gap-x-4">
            <div>
              <p className="text-xs mb-1">3 Month Subscription</p>
              <div className="border rounded flex justify-between h-12">
                <input
                  className="flex p-2 items-center rounded-l outline-none"
                  type="text"
                  placeholder="Enter price"
                  onChange={(e) => setThreeMonthSubsPrice(e.target.value)}
                />
                <div className="flex items-center justify-center bg-[#ECECEF] rounded-r w-12 h-12">
                  <p>$</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs mb-1">6 Month Subscription</p>
              <div className="border rounded flex justify-between h-12">
                <input
                  className="flex p-2 items-center rounded-l outline-none"
                  type="text"
                  placeholder="Enter price"
                  onChange={(e) => setSixMonthSubsPrice(e.target.value)}
                />
                <div className="flex items-center justify-center bg-[#ECECEF] rounded-r w-12 h-12">
                  <p>$</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs mb-1">1 Year Subscription</p>
              <div className="border rounded flex justify-between h-12">
                <input
                  className="flex p-2 items-center rounded-l outline-none"
                  type="text"
                  placeholder="Enter price"
                  onChange={(e) => setAnnualSubsPrice(e.target.value)}
                />
                <div className="flex items-center justify-center bg-[#ECECEF] rounded-r w-12 h-12">
                  <p>$</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6">
            <div>
              <p className="text-xs mb-1">Buy Now Price</p>
              <div className="border rounded flex justify-between h-12">
                <input
                  className="flex p-2 items-center rounded-l outline-none"
                  type="text"
                  placeholder="Enter buy now price"
                  onChange={(e) => setPrice(e.target.value)}
                />
                <div className="flex items-center justify-center bg-[#ECECEF] rounded-r w-12 h-12">
                  <p>$</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs mb-1">Compare Price</p>
              <div className="border rounded flex justify-between h-12">
                <input
                  className="flex p-2 items-center rounded-l outline-none"
                  type="text"
                  placeholder="Enter Limit"
                  onChange={(e) => setComparePrice(e.target.value)}
                />
                <div className="flex items-center justify-center bg-[#ECECEF] rounded-r w-12 h-12">
                  <svg
                    width="8"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.667969 7.99984L4.0013 11.3332L7.33464 7.99984M0.667969 3.99984L4.0013 0.666504L7.33464 3.99984"
                      stroke="black"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Subscription Section */}

      {/* <AddMedia /> */}
      <div className="border rounded-xl p-4 mt-5 bg-white">
        <p>Media</p>
        <p className="text-xs mt-2 mb-1">
          Click to upload and slide to switch order:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-2 gap-y-2">
          <div className="border flex flex-col items-center justify-center p-1 text-white bg-[#4B6161] rounded h-44 relative">
            <Widget publicKey={uploadcarekey} onChange={handleFileUpload} />
            {imageUrl && (
              <div className="absolute inset-0 rounded border border-[#ccccce] overflow-hidden">
                {/* Image container */}
                <img
                  src={imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="border hover:bg-[#F9F9FD] transition-all duration-200 flex items-center justify-center rounded h-44">
            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.60091 1.16675V12.8334M1.76758 7.00008H13.4342"
                stroke="black"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="border hover:bg-[#F9F9FD] transition-all duration-200 flex items-center justify-center rounded h-44">
            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.60091 1.16675V12.8334M1.76758 7.00008H13.4342"
                stroke="black"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="border hover:bg-[#F9F9FD] transition-all duration-200 flex items-center justify-center rounded h-44">
            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.60091 1.16675V12.8334M1.76758 7.00008H13.4342"
                stroke="black"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="border hover:bg-[#F9F9FD] transition-all duration-200 flex items-center justify-center rounded h-44">
            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.60091 1.16675V12.8334M1.76758 7.00008H13.4342"
                stroke="black"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className=" mt-5 flex justify-end gap-x-3">
        <Button onClick={formSubmit} className="rounded w-36">
          NEXT
        </Button>
      </div>
      {/* <Content /> */}

      {/* {appsPanelVisibility && (
        <div className="mt-5 border rounded-xl bg-white p-4">
          <p>What&apos;s Included</p>

          <div className="grid grid-cols-3 gap-x-4 mt-2 mb-4">
            <button
              onClick={() => setWhatsIncluded("private-groups")}
              className={
                whatsIncluded == "private-groups"
                  ? "h-9 rounded-md bg-black text-white"
                  : "border h-9 rounded-md bg-[#ECECEF] border-[#DBDAD8] hover:bg-[#cbcbca] transition-all duration-300"
              }
            >
              Private Groups
            </button>
            <button
              onClick={() => setWhatsIncluded("digital-assets")}
              className={
                whatsIncluded == "digital-assets"
                  ? "h-9 rounded-md bg-black text-white"
                  : "border h-9 rounded-md bg-[#ECECEF] border-[#DBDAD8] hover:bg-[#cbcbca] transition-all duration-300"
              }
            >
              Digital Assets
            </button>
            <button
              onClick={() => setWhatsIncluded("links")}
              className={
                whatsIncluded == "links"
                  ? "h-9 rounded-md bg-black text-white"
                  : "border h-9 rounded-md bg-[#ECECEF] border-[#DBDAD8] hover:bg-[#cbcbca] transition-all duration-300"
              }
            >
              Links
            </button>
          </div>

          {whatsIncluded == "digital-assets" && (
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
          )}

          {whatsIncluded == "private-groups" && (
            <div className="grid grid-cols-2 gap-x-4">
              <div className="border border-[#DBDAD8] rounded-lg h-24 flex items-center hover:bg-[#E4E4E5] transition-all duration-300 justify-between cursor-pointer">
                <div className="flex items-center px-2 gap-x-3">
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
                      Offer exclusive access to your private Discord server
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-[#DBDAD8] rounded-lg h-24 flex items-center hover:bg-[#E4E4E5] transition-all duration-300 justify-between cursor-pointer">
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
            </div>
          )}

          {whatsIncluded == "links" && (
            <div className="border mt-6 rounded-xl p-4 bg-white">
              <p className="font-medium text-lg">
                Share the product link below
              </p>
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
          )}
        </div>
      )} */}
    </div>
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
