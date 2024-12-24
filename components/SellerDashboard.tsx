"use client";

import Image from "next/image";
import hex from "@/public/hex.svg";
import randomstatic from "@/public/randomstatic.png";
import circlemedal from "@/public/circlemedal.svg";
import ShareDepositStakeTnx from "./ShareDepositStakeTnx";
import ShareWithdrawStakeTnx from "./ShareWithdrawStakeTnx";
import ResponsiveLinearChart from "./ResponsiveLinearChart";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { phantomWallet } from "@/store/atom/phantomWallet";
import { PurchasesInterface, SellerAnalytics } from "@/lib/models";
import spinnerthree from "@/public/loaders/spinnerthree.svg";
import { toast } from "sonner";
import ShareClaimPurchase from "./ShareClaimPurchase";
import { ResponsiveBarGraph } from "./ResponsiveBarGraph";

export default function SellerDashboard() {
  const [sellerAnalytics, setSellerAnalytics] = useState<SellerAnalytics>({
    user_id: 0,
    user: {
      id: 0,
      wallet_address: "",
      created_at: "2024-10-03T18:53:03.441Z",
      updated_at: "2024-10-03T18:53:03.441Z",
      seller_reg_tx_hash: null,
    },
    view_count: 0,
    sale_count: 0,
    sale_amount: 0,
    average_rating: 0,
    review_count: 0,
  });
  const sellerWalletAddress = useRecoilValue(phantomWallet);

  const fetchSellerAnalytics = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_SWAGGER_URL}/fetch/analytics/seller?seller_wallet_address=${sellerWalletAddress}`
      );
      setSellerAnalytics(response.data[0]);
      // console.log(response.data[0]);
    } catch (error) {
      console.log(`You got error while fetching seller analytics`);
    }
  };

  useEffect(() => {
    if (sellerWalletAddress) {
      fetchSellerAnalytics();
    }
  }, [sellerWalletAddress]);

  return (
    <div className="w-[100%] pb-20 relative overflow-y-auto hide-scrollbar h-[90vh] scroll-smooth">
      <TopLabel />
      <div className="px-[20px] sm:px-[20px] md:px-[40px] lg:px-[60px] xl:px-20 mt-8 ">
        {/* <MidSection /> */}
        {/* <TotalEarningsSection /> */}
        <div className="">
          <p className="text-xs md:text-[13px]">ACCOUNT STATISTICS</p>
          <MidSectionTwo
            unitsSold={sellerAnalytics?.sale_count}
            avgRating={sellerAnalytics?.average_rating}
            totalViews={sellerAnalytics?.view_count}
          />
        </div>
        <GraphWindow saleAmount={sellerAnalytics?.sale_amount} />
        <CurrentRank />
        {/* <Sales sellerWalletAddress={sellerWalletAddress} /> */}
      </div>
    </div>
  );
}

const TopLabel = () => {
  return (
    <div className="relative border-b w-[100%] px-[20px] sm:px-[20px] md:px-[40px] lg:px-[60px] xl:px-20">
      <Image
        src={randomstatic}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="opacity-[4%]"
      />
      <div className="h-20 grid grid-cols-2">
        <div className=" h-full flex items-center gap-x-2">
          <div className="relative  flex items-center justify-center">
            <Image className="w-8 md:w-10 xl:w-12" src={hex} alt="" />
            <p className="text-lg font-medium text-white absolute z-20">2</p>
          </div>
          <div>
            <p className="font-medium text-sm  lg:text-lg">Emerging Seller</p>
            <div className="flex gap-x-[1px] mt-[5px] mb-[1px]">
              <div className="w-28 h-[3px] bg-[#223D40]"></div>
              <div className="w-8 h-[3px] bg-[#E2E0D9]"></div>
            </div>
            <p className="text-[11px] text-[#959594]">Next:Establised Seller</p>
          </div>
        </div>
        <div className=" h-full flex items-center">
          <p className="text-sm lg:text-lg font-medium">User Welcome Ape</p>
        </div>
      </div>
    </div>
  );
};

const MidSection = () => {
  return (
    <div className="border rounded-2xl grid grid-cols-3 bg-white">
      <div className="p-2 sm:p-3 md:p-4">
        <div className=" flex items-center gap-x-1">
          <p className="text-xs md:text-[13px]">AVAILABLE BALANCE</p>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.545 4.5C4.66255 4.16583 4.89458 3.88405 5.19998 3.70457C5.50538 3.52508 5.86445 3.45947 6.21359 3.51936C6.56273 3.57924 6.87941 3.76076 7.10754 4.03176C7.33567 4.30277 7.46053 4.64576 7.46 5C7.46 6 5.96 6.5 5.96 6.5M6 8.5H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
              stroke="#8B8B92"
              strokeWidth="1.125"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="font-bold text-3xl md:text-4xl my-3">$20</p>
        <div className="flex text-[11px] sm:text-[12px] md:text-[14px] w-20 sm:w-24 md:w-32 h-8 md:h-10 items-center gap-x-1 border rounded-xl md:rounded-2xl justify-center shadow-lg hover:bg-[#e9e9ec] transition-all duration-300">
          <p>Withdraw</p>
          <svg
            className="w-2 md:w-3"
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.16602 7.50008H12.8327M12.8327 7.50008L6.99935 1.66675M12.8327 7.50008L6.99935 13.3334"
              stroke="#050505"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="border-r border-l p-2 sm:p-3 md:p-4">
        <div className=" flex items-center gap-x-1">
          <p className="text-xs md:text-[13px]">TODAY TOTAL SALES</p>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.545 4.5C4.66255 4.16583 4.89458 3.88405 5.19998 3.70457C5.50538 3.52508 5.86445 3.45947 6.21359 3.51936C6.56273 3.57924 6.87941 3.76076 7.10754 4.03176C7.33567 4.30277 7.46053 4.64576 7.46 5C7.46 6 5.96 6.5 5.96 6.5M6 8.5H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
              stroke="#8B8B92"
              strokeWidth="1.125"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="font-bold text-3xl md:text-4xl my-3">$50</p>
        <div className="flex justify-between">
          <div className="w-fit ">
            <p className="text-[10px] md:text-[12px] font-medium">
              Top Product
            </p>
            <p className="text-[8px] md:text-[11px]">How to Design Better UI</p>
          </div>
          <div className="border flex items-center text-[10px] sm:text-[12px] md:text-[14px] w-14 sm:w-16 md:w-20 h-8 md:h-10 justify-center rounded-lg bg-[#E8ECEC]">
            <p>5 Sales</p>
          </div>
        </div>
      </div>
      <div className=" p-2 sm:p-3 md:p-4">
        <div className=" flex items-center gap-x-1">
          <p className="text-xs md:text-[13px]">TOTAL SALES IN 7 DAYS</p>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.545 4.5C4.66255 4.16583 4.89458 3.88405 5.19998 3.70457C5.50538 3.52508 5.86445 3.45947 6.21359 3.51936C6.56273 3.57924 6.87941 3.76076 7.10754 4.03176C7.33567 4.30277 7.46053 4.64576 7.46 5C7.46 6 5.96 6.5 5.96 6.5M6 8.5H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
              stroke="#8B8B92"
              strokeWidth="1.125"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="font-bold text-3xl md:text-4xl my-3">$100</p>
        <div className="mt-8 text-[10px] md:text-[12px] flex gap-x-1 ">
          <p className="text-green-700">4%</p>
          <p> vs last month</p>
        </div>
      </div>
    </div>
  );
};

const TotalEarningsSection = () => {
  return (
    <div className="bg-white flex flex-col justify-between border mt-6 rounded-2xl h-36 p-4">
      <div className=" flex items-center gap-x-1">
        <p className="text-xs md:text-[13px]">TOTAL EARNINGS</p>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.545 4.5C4.66255 4.16583 4.89458 3.88405 5.19998 3.70457C5.50538 3.52508 5.86445 3.45947 6.21359 3.51936C6.56273 3.57924 6.87941 3.76076 7.10754 4.03176C7.33567 4.30277 7.46053 4.64576 7.46 5C7.46 6 5.96 6.5 5.96 6.5M6 8.5H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
            stroke="#8B8B92"
            strokeWidth="1.125"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="grid grid-cols-3 ">
        <div className="flex items-center gap-x-1">
          <p className="font-medium text-2xl">$</p>
          <p className="font-bold text-2xl sm:text-4xl lg:text-6xl">1240.00</p>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="relative">
            <Image className="w-8 sm:w-10" src={circlemedal} alt="" />
          </div>
          <p className="w-44 text-[10px] md:text-[14px] text-wrap">
            You&apos;ve reached $1500 in total sales!
          </p>
        </div>
        <div className="flex justify-end items-center">
          <div className="border shadow-lg h-10 rounded-xl w-20 sm:w-32 md:w-40 flex items-center gap-x-1 justify-center hover:bg-[#E8ECEC] transition-all duration-300">
            <p className="text-[11px] sm:text-sm">Analytics</p>
            <svg
              className="w-3 mt-1"
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.16602 7.50008H12.8327M12.8327 7.50008L6.99935 1.66675M12.8327 7.50008L6.99935 13.3334"
                stroke="#050505"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const CurrentRank = () => {
  return (
    <div className="mt-6">
      <p className="font-medium text-sm sm:text-lg md:text-xl mb-2">
        Your Path to Level 3
      </p>
      <div className="grid grid-cols-2 w-[100%]">
        <div className="py-2 gap-x-2 flex items-center ">
          <input type="checkbox" />
          <div className="">
            <p className="text-[11px] md:text-[13px]">
              Complete at least 10 sales
            </p>
            <p className="text-[9px] md:text-[11px] text-[#8B8B93]">
              7/10 sales completed
            </p>
          </div>
        </div>
        <div className="py-2 gap-x-2 flex items-center ">
          <input type="checkbox" />
          <div className="">
            <p className="text-[11px] md:text-[13px]">
              Total sales of $1,750 USD equivalent
            </p>
            <p className="text-[9px] md:text-[11px] text-[#8B8B93]">
              1500/1750
            </p>
          </div>
        </div>
        <div className="py-2 gap-x-2 flex items-center ">
          <input type="checkbox" />
          <div className="">
            <p className="text-[11px] md:text-[13px]">
              Maintain a 4.2/5.0 average rating
            </p>
            <p className="text-[9px] md:text-[11px] text-[#8B8B93]">
              Current 4.5
            </p>
          </div>
        </div>
        <div className="py-2 gap-x-2 flex items-center ">
          <input type="checkbox" />
          <div className="">
            <p className="text-[11px] md:text-[13px]">
              Maintain a 4.2/5.0 average rating
            </p>
            <p className="text-[9px] md:text-[11px] text-[#8B8B93]">
              Current 4.5
            </p>
          </div>
        </div>
        <ShareDepositStakeTnx />
        <ShareWithdrawStakeTnx />
      </div>
    </div>
  );
};

export const Sales = ({
  sellerWalletAddress,
}: {
  sellerWalletAddress: string;
}) => {
  const [sellerPurchases, setSellerPurchases] = useState<PurchasesInterface[]>(
    []
  );

  const [isLoading, setIsLoading] = useState(false);

  const fetchSellerPurchase = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_SWAGGER_URL}/fetch/purchases?seller_wallet_address=${sellerWalletAddress}`
      );
      setSellerPurchases(response.data);
      setIsLoading(false);
      // console.log(response.data);
    } catch (error) {
      console.log(`Error while fetching seller sales:${error}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sellerWalletAddress) {
      fetchSellerPurchase();
    }
  }, [sellerWalletAddress]);

  return (
    <div className="mt-6 border rounded-2xl p-5 h-80 bg-white">
      <div className=" flex items-center gap-x-1">
        <p className="text-xs md:text-[13px]">SALES</p>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.545 4.5C4.66255 4.16583 4.89458 3.88405 5.19998 3.70457C5.50538 3.52508 5.86445 3.45947 6.21359 3.51936C6.56273 3.57924 6.87941 3.76076 7.10754 4.03176C7.33567 4.30277 7.46053 4.64576 7.46 5C7.46 6 5.96 6.5 5.96 6.5M6 8.5H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
            stroke="#8B8B92"
            strokeWidth="1.125"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="px-2 mb-1 grid grid-cols-12 items-center mt-3 w-full h-7 rounded-lg shadow-[inset_0px_2px_10px_rgba(0,0,0,0.04)] bg-[#F7F7F7]">
        <p className="text-[10px] md:text-[13px] col-span-1">Date</p>
        <p className="text-[10px] md:text-[13px] col-span-3">Product Name</p>
        <p className="text-[10px] md:text-[13px] col-span-2">Buyer</p>
        <p className="text-[10px] md:text-[13px] col-span-1">Quantity</p>
        <p className="text-[10px] md:text-[13px] col-span-1">Price</p>
        <p className="text-[10px] md:text-[13px] col-span-1">Status</p>
        <p className="text-[10px] md:text-[13px] col-span-2">Hash</p>
        <p className="text-[10px] md:text-[13px] col-span-1">Claim</p>
      </div>
      <div className="relative overflow-y-auto hide-scrollbar scroll-smooth h-52">
        {isLoading && (
          <div className="flex justify-center mt-2">
            <Image className="w-10 lg:w-12" src={spinnerthree} alt="" />
          </div>
        )}
        {sellerPurchases &&
          sellerPurchases.map((elem, key) => {
            return (
              <SalesLabel
                key={key}
                date={elem.created_at}
                productName={elem.product_title}
                buyer={elem.buyer_wallet_address}
                quantity={12}
                price={elem.amount}
                status={elem.status}
                hash={elem.transaction_hash}
                claim="claim"
              />
            );
          })}
      </div>
    </div>
  );
};

export const SalesLabel = ({
  date,
  productName,
  buyer,
  quantity,
  price,
  status,
  hash,
  claim,
}: {
  date: string;
  productName: string;
  buyer: string;
  quantity: number;
  price: string | number;
  status: string;
  hash: string;
  claim: string;
}) => {
  const dateStr = date;
  const newDate = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const formattedDate = newDate.toLocaleString("en-US", options);

  const handleCopy = () => {
    if (hash) {
      navigator.clipboard
        .writeText(hash)
        .then(() => {
          toast.info("Copied Transaction Hash!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          toast.info("Failed to copy Tnx Hash!");
        });
    }
  };

  return (
    <div className="border-b px-2 grid grid-cols-12 items-center w-full h-10">
      <p className="text-[9px] md:text-[13px] col-span-1">{formattedDate}</p>
      <p className="text-[9px] md:text-[13px] col-span-3">{productName}</p>
      <p className="text-[9px] md:text-[13px] col-span-2">{`${buyer.slice(
        0,
        3
      )}…${buyer.slice(-3)}`}</p>
      <p className="text-[9px] md:text-[13px] col-span-1">{quantity}</p>
      <p className="text-[9px] md:text-[13px] col-span-1">{price}</p>
      <div className="text-[9px] md:text-[13px] flex items-center col-span-1">
        {status == "confirmed" ? (
          <div className="flex text-[9px] md:text-[13px] items-center bg-opacity-45 border border-green-600 rounded-md h-6 px-1 bg-green-400 ">
            <p>{status}</p>
          </div>
        ) : (
          <div className="flex text-[9px] md:text-[13px] items-center bg-opacity-45 border border-red-600 rounded-md h-6 px-1 bg-red-400 ">
            <p>{status.length > 2 ? status : "pending"}</p>
          </div>
        )}
      </div>
      <div
        onClick={handleCopy}
        className="text-[9px] md:text-[13px] col-span-2 flex items-center"
      >
        <p>{`${hash.slice(0, 3)}…${hash.slice(-3)}`}</p>
        <svg
          className="w-3 ml-1"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.66797 4.6665V3.03317C4.66797 2.37978 4.66797 2.05308 4.79513 1.80352C4.90698 1.58399 5.08546 1.40552 5.30498 1.29366C5.55454 1.1665 5.88124 1.1665 6.53464 1.1665H10.968C11.6214 1.1665 11.9481 1.1665 12.1976 1.29366C12.4171 1.40552 12.5956 1.58399 12.7075 1.80352C12.8346 2.05308 12.8346 2.37978 12.8346 3.03317V7.4665C12.8346 8.1199 12.8346 8.4466 12.7075 8.69616C12.5956 8.91568 12.4171 9.09416 12.1976 9.20601C11.9481 9.33317 11.6214 9.33317 10.968 9.33317H9.33464M3.03464 12.8332H7.46797C8.12136 12.8332 8.44806 12.8332 8.69762 12.706C8.91715 12.5942 9.09562 12.4157 9.20748 12.1962C9.33464 11.9466 9.33464 11.6199 9.33464 10.9665V6.53317C9.33464 5.87978 9.33464 5.55308 9.20748 5.30352C9.09562 5.08399 8.91715 4.90552 8.69762 4.79366C8.44806 4.6665 8.12136 4.6665 7.46797 4.6665H3.03464C2.38124 4.6665 2.05454 4.6665 1.80498 4.79366C1.58546 4.90552 1.40698 5.08399 1.29513 5.30352C1.16797 5.55308 1.16797 5.87978 1.16797 6.53317V10.9665C1.16797 11.6199 1.16797 11.9466 1.29513 12.1962C1.40698 12.4157 1.58546 12.5942 1.80498 12.706C2.05454 12.8332 2.38124 12.8332 3.03464 12.8332Z"
            stroke="#8B8B92"
            strokeWidth="1.1375"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {/* <button className="text-[9px] md:text-[13px] rounded-md h-6 bg-black text-white col-span-1 hover:bg-[#5a5c5d] transition-all duration-300">
        {claim}
      </button> */}
      <ShareClaimPurchase buyerWalletAddress={buyer} />
    </div>
  );
};

const MidSectionTwo = ({
  unitsSold,
  avgRating,
  totalViews,
}: {
  unitsSold: string | number;
  avgRating: string | number;
  totalViews: string | number;
}) => {
  return (
    <div className="grid grid-cols-3 mt-4 mb-5 border border-[#DEDEDE] rounded-xl bg-[#FFF]">
      <div className="p-4 border-r border-[#DEDEDE]">
        <div className=" flex items-center gap-x-1">
          <p className="text-xs md:text-[13px]">TOTAL UNITS SOLD</p>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.545 4.5C4.66255 4.16583 4.89458 3.88405 5.19998 3.70457C5.50538 3.52508 5.86445 3.45947 6.21359 3.51936C6.56273 3.57924 6.87941 3.76076 7.10754 4.03176C7.33567 4.30277 7.46053 4.64576 7.46 5C7.46 6 5.96 6.5 5.96 6.5M6 8.5H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
              stroke="#8B8B92"
              strokeWidth="1.125"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="font-bold text-3xl md:text-4xl my-3">
          {unitsSold ? unitsSold : 0}
        </p>
      </div>
      <div className=" p-4 border-r border-[#DEDEDE]">
        <div className=" flex items-center gap-x-1">
          <p className="text-xs md:text-[13px]">AVERAGE RATINGS</p>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.545 4.5C4.66255 4.16583 4.89458 3.88405 5.19998 3.70457C5.50538 3.52508 5.86445 3.45947 6.21359 3.51936C6.56273 3.57924 6.87941 3.76076 7.10754 4.03176C7.33567 4.30277 7.46053 4.64576 7.46 5C7.46 6 5.96 6.5 5.96 6.5M6 8.5H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
              stroke="#8B8B92"
              strokeWidth="1.125"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex my-3 items-center gap-x-2">
          <p className="font-bold text-3xl md:text-4xl">
            {avgRating ? avgRating : 0}
          </p>
          <div className="">
            <div className="flex">
              <svg
                className="w-[10px]"
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.90919 0.196866C6.94494 0.119379 7.05506 0.119379 7.09081 0.196866L8.95151 4.23087C8.96608 4.26245 8.99601 4.2842 9.03055 4.28829L13.4421 4.81135C13.5268 4.8214 13.5609 4.92614 13.4982 4.98408L10.2366 8.00029C10.2111 8.0239 10.1997 8.05909 10.2065 8.0932L11.0722 12.4505C11.0889 12.5342 10.9998 12.5989 10.9253 12.5572L7.04884 10.3873C7.0185 10.3704 6.9815 10.3704 6.95116 10.3873L3.07468 12.5572C3.00022 12.5989 2.91112 12.5342 2.92776 12.4505L3.79354 8.0932C3.80032 8.05909 3.78889 8.0239 3.76335 8.00029L0.501775 4.98408C0.439125 4.92614 0.473156 4.8214 0.557896 4.81135L4.96946 4.28829C5.00399 4.2842 5.03392 4.26245 5.04849 4.23087L6.90919 0.196866Z"
                  fill="#6B7D7F"
                />
              </svg>
              <svg
                className="w-[10px]"
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.90919 0.196866C6.94494 0.119379 7.05506 0.119379 7.09081 0.196866L8.95151 4.23087C8.96608 4.26245 8.99601 4.2842 9.03055 4.28829L13.4421 4.81135C13.5268 4.8214 13.5609 4.92614 13.4982 4.98408L10.2366 8.00029C10.2111 8.0239 10.1997 8.05909 10.2065 8.0932L11.0722 12.4505C11.0889 12.5342 10.9998 12.5989 10.9253 12.5572L7.04884 10.3873C7.0185 10.3704 6.9815 10.3704 6.95116 10.3873L3.07468 12.5572C3.00022 12.5989 2.91112 12.5342 2.92776 12.4505L3.79354 8.0932C3.80032 8.05909 3.78889 8.0239 3.76335 8.00029L0.501775 4.98408C0.439125 4.92614 0.473156 4.8214 0.557896 4.81135L4.96946 4.28829C5.00399 4.2842 5.03392 4.26245 5.04849 4.23087L6.90919 0.196866Z"
                  fill="#6B7D7F"
                />
              </svg>
              <svg
                className="w-[10px]"
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.90919 0.196866C6.94494 0.119379 7.05506 0.119379 7.09081 0.196866L8.95151 4.23087C8.96608 4.26245 8.99601 4.2842 9.03055 4.28829L13.4421 4.81135C13.5268 4.8214 13.5609 4.92614 13.4982 4.98408L10.2366 8.00029C10.2111 8.0239 10.1997 8.05909 10.2065 8.0932L11.0722 12.4505C11.0889 12.5342 10.9998 12.5989 10.9253 12.5572L7.04884 10.3873C7.0185 10.3704 6.9815 10.3704 6.95116 10.3873L3.07468 12.5572C3.00022 12.5989 2.91112 12.5342 2.92776 12.4505L3.79354 8.0932C3.80032 8.05909 3.78889 8.0239 3.76335 8.00029L0.501775 4.98408C0.439125 4.92614 0.473156 4.8214 0.557896 4.81135L4.96946 4.28829C5.00399 4.2842 5.03392 4.26245 5.04849 4.23087L6.90919 0.196866Z"
                  fill="#6B7D7F"
                />
              </svg>
              <svg
                className="w-[10px]"
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.90919 0.196866C6.94494 0.119379 7.05506 0.119379 7.09081 0.196866L8.95151 4.23087C8.96608 4.26245 8.99601 4.2842 9.03055 4.28829L13.4421 4.81135C13.5268 4.8214 13.5609 4.92614 13.4982 4.98408L10.2366 8.00029C10.2111 8.0239 10.1997 8.05909 10.2065 8.0932L11.0722 12.4505C11.0889 12.5342 10.9998 12.5989 10.9253 12.5572L7.04884 10.3873C7.0185 10.3704 6.9815 10.3704 6.95116 10.3873L3.07468 12.5572C3.00022 12.5989 2.91112 12.5342 2.92776 12.4505L3.79354 8.0932C3.80032 8.05909 3.78889 8.0239 3.76335 8.00029L0.501775 4.98408C0.439125 4.92614 0.473156 4.8214 0.557896 4.81135L4.96946 4.28829C5.00399 4.2842 5.03392 4.26245 5.04849 4.23087L6.90919 0.196866Z"
                  fill="#6B7D7F"
                />
              </svg>
              <svg
                className="w-[10px]"
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.90919 0.196866C6.94494 0.119379 7.05506 0.119379 7.09081 0.196866L8.95151 4.23087C8.96608 4.26245 8.99601 4.2842 9.03055 4.28829L13.4421 4.81135C13.5268 4.8214 13.5609 4.92614 13.4982 4.98408L10.2366 8.00029C10.2111 8.0239 10.1997 8.05909 10.2065 8.0932L11.0722 12.4505C11.0889 12.5342 10.9998 12.5989 10.9253 12.5572L7.04884 10.3873C7.0185 10.3704 6.9815 10.3704 6.95116 10.3873L3.07468 12.5572C3.00022 12.5989 2.91112 12.5342 2.92776 12.4505L3.79354 8.0932C3.80032 8.05909 3.78889 8.0239 3.76335 8.00029L0.501775 4.98408C0.439125 4.92614 0.473156 4.8214 0.557896 4.81135L4.96946 4.28829C5.00399 4.2842 5.03392 4.26245 5.04849 4.23087L6.90919 0.196866Z"
                  fill="#6B7D7F"
                />
              </svg>
            </div>
            <p className="text-[10px] md:text-[12px]">20 Reviews</p>
          </div>
        </div>
      </div>
      <div className=" p-4">
        <div className=" flex items-center gap-x-1">
          <p className="text-xs md:text-[13px]">TOTAL VIEWS</p>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.545 4.5C4.66255 4.16583 4.89458 3.88405 5.19998 3.70457C5.50538 3.52508 5.86445 3.45947 6.21359 3.51936C6.56273 3.57924 6.87941 3.76076 7.10754 4.03176C7.33567 4.30277 7.46053 4.64576 7.46 5C7.46 6 5.96 6.5 5.96 6.5M6 8.5H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
              stroke="#8B8B92"
              strokeWidth="1.125"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="font-bold text-3xl md:text-4xl my-3">
          {totalViews ? totalViews : 0}
        </p>
      </div>
    </div>
  );
};

export const GraphWindow = ({
  saleAmount,
}: {
  saleAmount: string | number;
}) => {
  return (
    <div className="border border-[#DEDEDE] rounded-xl h-72 bg-white p-4 grid grid-cols-12">
      <div className="col-span-3 sm:col-span-4 flex flex-col justify-between">
        <div className="flex items-center gap-x-1">
          <p className="text-xs md:text-[13px]">TOTAL SALES</p>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.545 4.5C4.66255 4.16583 4.89458 3.88405 5.19998 3.70457C5.50538 3.52508 5.86445 3.45947 6.21359 3.51936C6.56273 3.57924 6.87941 3.76076 7.10754 4.03176C7.33567 4.30277 7.46053 4.64576 7.46 5C7.46 6 5.96 6.5 5.96 6.5M6 8.5H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
              stroke="#8B8B92"
              strokeWidth="1.125"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex gap-x-1">
            <p className="font-medium flex justify-end flex-col text-2xl">$</p>
            <p className="font-medium text-4xl sm:text-5xl md:text-7xl">
              {saleAmount ? saleAmount : 0}
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="relative">
              <Image className="w-8" src={circlemedal} alt="" />
            </div>
            <p className="w-44 text-[10px] sm:text-[12px] text-wrap">
              You&apos;ve reached $1500 in total sales!
            </p>
          </div>
        </div>
      </div>

      <div className="col-span-9 sm:col-span-8 flex items-center justify-center h-full flex-col">
        {/* <div className="mb-2 flex items-center gap-x-4 w-full justify-end ">
          <p className="text-[#8B8B92] text-[11px] sm:text-[13px]">View</p>
          <div className="border h-8 w-16 rounded-md flex items-center justify-center gap-x-1 hover:bg-[#e2e2e4] transition-all duration-300">
            <p className=" text-[11px] sm:text-[13px]">YTD</p>
            <svg
              width="12"
              height="6"
              viewBox="0 0 12 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 0.75L6 5.25L10.5 0.75"
                stroke="#4B4B54"
                strokeWidth="1.35"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div> */}
        {/* <ResponsiveLinearChart /> */}
        <ResponsiveBarGraph
          className="h-64 w-full"
          graphData={[
            { month: "Sun", sales: 400 },
            { month: "Mon", sales: 300 },
            { month: "Tue", sales: 600 },
            { month: "Wed", sales: 800 },
            { month: "Thu", sales: 500 },
            { month: "Fri", sales: 700 },
            { month: "Sat", sales: 100 },
          ]}
        />
      </div>
    </div>
  );
};
