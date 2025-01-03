"use client";
import { useSearchParams } from "next/navigation";
import PromoteWithBlinksBtn from "../PromoteWithBlinksBtn";
import Image from "next/image";
import React, { useState } from "react";
import kody from "@/public/kody.svg";
import noisebg from "@/public/_static/background/noisebg.png";
import { Button } from "@/components/ui/button";
import kind from "@/public/kind.svg";
import star from "@/public/_static/illustrations/star.svg";

import { ReviewInterface } from "@/lib/models";
import { useRecoilValue } from "recoil";
import { phantomWallet } from "@/store/atom/phantomWallet";
import homeIconSVG from "@/public/homeicon.svg";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function PreviewProduct() {
  const searchParams = useSearchParams();

  const title = searchParams.get("title");

  const price = searchParams.get("price");
  const compareprice = searchParams.get("compareprice");
  const imageUrl = searchParams.get("imgurl");
  const category = searchParams.get("category");

  return (
    <div className="">
      <div className="pb-20 w-full min-h-screen px-[11px] sm:px-[20px] md:px-[20px] lg:px-[30px] xl:px-[80px] 2xl:px-[200px] ">
        {title && category && (
          <FolderStructurePreview
            product={title}
            productCategory={category}
            redirectUrl={`/product/category/${category}`}
          />
        )}

        {compareprice && imageUrl && title && (
          <ProductDetailsPreview
            comparePrice={compareprice}
            bannerImg={imageUrl}
            productName={title}
            price={`${price} SOL`}
            productId={0}
            fileName={"preview product"}
            fileSize={0}
            sellerAddress={""}
          />
        )}

        <ProductReviews
          productId={0}
          productDescription={"This is your demo description"}
        />
      </div>
    </div>
  );
}

const ProductDetailsPreview = ({
  bannerImg,
  productName,
  price,
  productId,
  comparePrice,
  fileSize,
  fileName,
  sellerAddress,
}: {
  bannerImg: string;
  productName: string;
  price: string;
  productId: number;
  comparePrice: string | number;
  fileSize: string | number;
  fileName: string;
  sellerAddress: string;
}) => {
  return (
    <div className="">
      {/* Top section which will show the folder structure */}

      {/* Main Product */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-5 mb-5 xl:gap-x-8 2xl:gap-x-12 px-2 pt-2 xl:justify-between 2xl:justify-evenly gap-y-4 sm:gap-y-4 md:gap-y-4 lg:gap-y-0 lg:gap-x-2">
        <div className="col-span-5 sm:col-span-5 md:col-span-5 lg:col-span-3 relative w-full h-0 pb-[60%] overflow-hidden border border-[#717274] rounded-lg">
          <img
            src={bannerImg}
            alt="product"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-2 col-span-1 sm:col-span-1 md:col-span-1">
          <PromoteWithBlinksBtn />
          <div className="flex items-center mt-4 justify-between">
            <p className="font-bold text-xl">{productName}</p>

            <div className="flex items-center gap-x-1">
              <Image src={kody} className="w-5 h-5 rounded-full" alt="" />
              <p className="text-xs md:text-sm">sold by: 0x45h…34x</p>
            </div>
          </div>
          <div className="mt-4 mb-1 flex items-center justify-between text-xs md:text-sm">
            <div className="border flex items-center w-36 h-12 rounded bg-[#F7F7F5]">
              <div className="border-r w-[50%] flex justify-center h-full items-center line-through">
                {comparePrice} SOL
              </div>
              <div className=" w-[50%] flex justify-center h-full items-center">
                {price}
              </div>
            </div>

            <div className="flex items-center gap-x-2">
              <p>5 Ratings</p>

              <div className="flex">
                <Image className="w-3" src={star} alt="" />
                <Image className="w-3" src={star} alt="" />
                <Image className="w-3" src={star} alt="" />
                <Image className="w-3" src={star} alt="" />
                <Image className="w-3" src={star} alt="" />
              </div>
            </div>
          </div>

          <div className="flex flex-col my-4 gap-y-1 text-sm md:text-[15px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-1">
                <svg
                  width="12"
                  height="16"
                  viewBox="0 0 12 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.33366 7.33337H3.33366M4.66699 10H3.33366M8.66699 4.66671H3.33366M11.3337 4.53337V11.4667C11.3337 12.5868 11.3337 13.1469 11.1157 13.5747C10.9239 13.951 10.618 14.257 10.2416 14.4487C9.81382 14.6667 9.25376 14.6667 8.13366 14.6667H3.86699C2.74689 14.6667 2.18683 14.6667 1.75901 14.4487C1.38269 14.257 1.07673 13.951 0.884979 13.5747C0.666992 13.1469 0.666992 12.5868 0.666992 11.4667V4.53337C0.666992 3.41327 0.666992 2.85322 0.884979 2.42539C1.07673 2.04907 1.38269 1.74311 1.75901 1.55136C2.18683 1.33337 2.74689 1.33337 3.86699 1.33337H8.13366C9.25376 1.33337 9.81382 1.33337 10.2416 1.55136C10.618 1.74311 10.9239 2.04907 11.1157 2.42539C11.3337 2.85322 11.3337 3.41327 11.3337 4.53337Z"
                    stroke="#8B8B92"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <p>File Name</p>
              </div>
              <p>{fileName}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-1">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.47203 11.2427L6.52922 12.1855C5.22748 13.4872 3.11693 13.4872 1.81518 12.1855C0.51343 10.8837 0.51343 8.77317 1.81518 7.47142L2.75799 6.52861M11.2433 7.47142L12.1861 6.52861C13.4878 5.22686 13.4878 3.11632 12.1861 1.81457C10.8843 0.51282 8.77378 0.51282 7.47203 1.81457L6.52922 2.75738M4.66729 9.33334L9.33396 4.66667"
                    stroke="#8B8B92"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <p>File size</p>
              </div>
              <p>{fileSize} MB</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-1">
                <svg
                  width="16"
                  height="14"
                  viewBox="0 0 16 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.66634 3.66667L7.92265 2.17928C7.70861 1.7512 7.60158 1.53715 7.44192 1.38078C7.30073 1.24249 7.13056 1.13732 6.94372 1.07287C6.73245 1 6.49315 1 6.01454 1H3.46634C2.7196 1 2.34624 1 2.06102 1.14532C1.81014 1.27316 1.60616 1.47713 1.47833 1.72801C1.33301 2.01323 1.33301 2.3866 1.33301 3.13333V3.66667M1.33301 3.66667H11.4663C12.5864 3.66667 13.1465 3.66667 13.5743 3.88465C13.9506 4.0764 14.2566 4.38236 14.4484 4.75869C14.6663 5.18651 14.6663 5.74656 14.6663 6.86667V9.8C14.6663 10.9201 14.6663 11.4802 14.4484 11.908C14.2566 12.2843 13.9506 12.5903 13.5743 12.782C13.1465 13 12.5864 13 11.4663 13H4.53301C3.4129 13 2.85285 13 2.42503 12.782C2.0487 12.5903 1.74274 12.2843 1.55099 11.908C1.33301 11.4802 1.33301 10.9201 1.33301 9.8V3.66667Z"
                    stroke="#8B8B92"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <p>Files Included</p>
              </div>
              <p>To be added</p>
            </div>
          </div>

          <div className="mt-1">
            {/* <p className="text-xs md:text-[12px] font-medium">Make a price:</p> */}
            <div className="relative border h-12 mt-1 flex justify-between px-4 items-center shadow-[inset_5px_2px_28px_rgba(0,0,0,0.07)]">
              <Image
                src={noisebg}
                alt="Background"
                layout="fill"
                objectFit="cover"
                className="opacity-[5%]"
              />
              <p className="text-xl font-medium">Price after discount</p>
              <div className="border bg-white z-10 flex items-center px-2 h-10 w-28">
                <p>{price}</p>
                {/* <input
                    type="number"
                    className="flex items-center p-1 h-full w-full outline-none "
                  /> */}
              </div>
            </div>
            {/* <p className="text-xs md:text-[12px] font-medium mt-1">
                Available in Wallet: 2000 USDC
              </p> */}
          </div>

          <div className="grid grid-cols-2 gap-x-2 h-14 mt-4 w-full">
            <Button className="text-black h-full bg-inherit border border-[#959592] hover:bg-[#dfdfdc] transition-all duration-200">
              Add to Basket!
            </Button>
            <Button className="text-white bg-black h-full border border-[#959592] hover:bg-[#222122] transition-all duration-200">
              Add to Basket!
            </Button>
          </div>
          <div className="flex p-2 mt-5 rounded border h-16 items-center relative overflow-hidden">
            <p className="text-[12px]">
              This product supports purchasing power parity. Because you&apos;re
              located in UAE, the price has been discounted by 10% to $8,99.
            </p>
            <Image
              src={kind}
              alt="svg"
              className="w-20 absolute -right-4 -bottom-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FolderStructurePreview = ({
  product,
  productCategory,
  redirectUrl,
}: {
  product: string;
  productCategory: string;
  redirectUrl: string;
}) => {
  return (
    <div className="flex items-center gap-x-3 mt-5 border-b pb-1 border-[##E8E7E5]">
      <Image
        className="w-4"
        src={homeIconSVG}
        alt="home"
        width={50}
        height={50}
      />

      <svg
        width="6"
        height="10"
        viewBox="0 0 6 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 9L5 5L1 1"
          stroke="#050505"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <p className=" cursor-pointer">{productCategory}</p>

      <svg
        width="6"
        height="10"
        viewBox="0 0 6 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 9L5 5L1 1"
          stroke="#050505"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <p className="text-[#8B8B92]">{product}</p>
    </div>
  );
};

const ProductReviews = ({
  productDescription,
  productId,
}: {
  productDescription: string;
  productId: number;
}) => {
  const [productReviews, setProductReviews] = useState<ReviewInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-5 xl:gap-x-4 2xl:gap-x-8 px-2 pt-2 xl:justify-between 2xl:justify-evenly gap-y-4 sm:gap-y-4 md:gap-y-4 lg:gap-y-0 mb-10">
      <div className=" col-span-5 sm:col-span-5 md:col-span-5 lg:col-span-3">
        <p className="font-bold text-lg">Description:</p>
        <p className="text-[#8B8B92] text-[13px]">Version 3.0 is out now!</p>
        <div className="mt-4">
          {/* <p className="text-sm md:text-[15px]">{productDescription}</p> */}
          <MarkdownRenderer content={productDescription} />
        </div>
      </div>
      <div className="lg:col-span-2 col-span-1 sm:col-span-1 md:col-span-1">
        <PostReviewTab productId={productId} />
        <p className="font-bold text-lg mt-2">Ratings:</p>
        {productReviews.length > 0 && (
          <div className="mt-2 relative overflow-y-auto hide-scrollbar scroll-smooth h-60 border rounded-lg w-[100%]">
            {productReviews.map((elem, key) => {
              return (
                <RatingLabel
                  key={key}
                  starCount={elem.rating}
                  description={elem.comment}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const RatingLabel = ({
  starCount,
  description,
}: {
  starCount: number;
  description: string;
}) => {
  const [isFullDescriptionVisible, setIsFullDescriptionVisible] =
    useState(false);

  const toggleDescription = () => {
    setIsFullDescriptionVisible(!isFullDescriptionVisible);
  };

  const displayedDescription = isFullDescriptionVisible
    ? description
    : description.length > 100
    ? `${description.substring(0, 100)}...`
    : description;

  return (
    <div className="border-b p-2  ">
      <div className="flex">
        {Array.from({ length: starCount }, (_, index) => (
          <Image
            key={index}
            className="w-3"
            src={star}
            alt={`Star ${index + 1}`}
          />
        ))}
      </div>

      <p>{displayedDescription}</p>
    </div>
  );
};

const PostReviewTab = ({ productId }: { productId: number }) => {
  const [reviewWindowVisibility, setAddReviewWindowVisibility] =
    useState(false);
  const walletAddress = useRecoilValue(phantomWallet);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [userId, setUserId] = useState(null);

  const toggleReviewWindowVisibility = () => {
    setAddReviewWindowVisibility(!reviewWindowVisibility);
  };

  return (
    <div className="">
      {!reviewWindowVisibility ? (
        <button
          onClick={toggleReviewWindowVisibility}
          className="border h-12 rounded-lg w-full bg-[#223D40] text-white font-medium hover:bg-[#416c70] transition-all duration-300"
        >
          Add Review
        </button>
      ) : (
        <div className="rounded-lg">
          <div className="h-10 flex justify-between items-center rounded-xl w-full">
            <div className="border px-2 rounded-xl h-10 items-center flex">
              {[...Array(5)].map((_, index) => {
                const starIndex = index + 1;
                return (
                  <button
                    key={starIndex}
                    type="button"
                    className={`star ${starIndex <= rating ? "on" : "off"}`}
                    onClick={() => setRating(starIndex)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: starIndex <= rating ? "#385570" : "#C5D1DB",
                      fontSize: "20px",
                    }}
                  >
                    ★
                  </button>
                );
              })}
            </div>
            <button
              onClick={toggleReviewWindowVisibility}
              className="px-2 border rounded-xl h-10 font-medium text-white bg-black"
            >
              Close
            </button>
          </div>
          <textarea
            className="border w-full p-1 rounded-lg mt-1"
            name="Review"
            id=""
            rows={5}
            placeholder="Write your review"
            onChange={(e) => {
              setComment(e.target.value);
            }}
          ></textarea>
          <button className="border h-12 rounded-lg w-full bg-[#223D40] text-white font-medium hover:bg-[#416c70] transition-all duration-300">
            Post Review
          </button>
        </div>
      )}
    </div>
  );
};
