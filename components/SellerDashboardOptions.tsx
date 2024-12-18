"use client";
import Image from "next/image";
import senditLogo from "@/public/sendit_logo.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import walletdp from "@/public/walletdp.png";
import shinegradient from "@/public/_static/background/shinegradient.png";
import { useCallback } from "react";
import { toast } from "sonner";
import portfolio_ape from "@/public/_static/illustrations/portfolio_ape.png";
import randomstatic from "@/public/randomstatic.png";
import RegisterSeller from "./RegisterSeller";
import ShareRegisterSeller from "./ShareRegisterSeller";
import { useRecoilValue } from "recoil";
import { phantomWallet } from "@/store/atom/phantomWallet";

const isActiveTab =
  "flex  text-black hover:text-black transition-all duration-300 backdrop-blur-lg border border-[#dbdad8] py-2 mb-[4px] w-full rounded-md pl-5 bg-[#ececef] ";
const isInactiveTab =
  "flex  text-[#9b9898] hover:text-black transition-all duration-300 backdrop-blur-lg py-2 mb-[4px] w-full rounded-md pl-5 ";

export default function SellerDashboardOptions({
  portfolio,
  walletAddress,
}: {
  portfolio: string;
  walletAddress: string;
}) {
  const pathname = usePathname();
  const sellerWalletAddress = useRecoilValue(phantomWallet);
  // console.log(pathname);
  const copyToClipboard = useCallback(() => {
    navigator.clipboard
      .writeText(walletAddress)
      .then(() => {
        toast.success("Wallet address copied to clipboard");
      })
      .catch((err) => {
        toast.error("Failed to copy wallet address");
      });
  }, [walletAddress]);

  return (
    <div className="relative z-10 pt-16 border border-[#E5E5E5] min-h-screen">
      <Link
        href={`/product/seller/${sellerWalletAddress}`}
        className="relative flex items-center px-3 gap-x-2 border-b border-[#E5E5E5] h-20"
      >
        <Image
          src={randomstatic}
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="opacity-[4%]"
        />

        <Image
          className="w-12 h-12 border border-black rounded-full"
          src={portfolio_ape}
          alt="Seller"
          width={200}
          height={200}
        />

        <div>
          <p className="font-medium text-[15px]">SELLER PROFILE</p>
          <p className="text-[11px]">
            {`${sellerWalletAddress.slice(0, 3)}…${sellerWalletAddress.slice(
              -3
            )}
            `}
          </p>
        </div>
      </Link>
      <div className="flex flex-col my-2 px-2 h-[400px]">
        <div className="flex gap-x-3 w-[198px]">
          <ul className="flex flex-col font-normal py-2 mb-[4px] w-full rounded-md px-1">
            <Link href="/seller/dashboard">
              <li
                className={
                  pathname.includes("/seller/dashboard")
                    ? isActiveTab
                    : isInactiveTab
                }
              >
                <p className="text-[18px]">Dashboard</p>
              </li>
            </Link>
            <Link href="/seller/products">
              <li
                className={
                  pathname.includes("/seller/products")
                    ? isActiveTab
                    : isInactiveTab
                }
              >
                <p className="text-[18px] ">Products</p>
              </li>
            </Link>
            <Link href="/seller/transactions">
              <li
                className={
                  pathname.includes("/seller/transactions")
                    ? isActiveTab
                    : isInactiveTab
                }
              >
                <p className="text-[18px] ">Transactions</p>
              </li>
            </Link>
            <Link href="/seller/ap">
              <li
                className={
                  pathname.includes("/seller/ap") ? isActiveTab : isInactiveTab
                }
              >
                <p className="text-[18px] ">Apps</p>
              </li>
            </Link>

            <Link href="/seller/analytics">
              <li
                className={
                  pathname == "/seller/analytics" ? isActiveTab : isInactiveTab
                }
              >
                <p className="text-[18px]">Analytics</p>
              </li>
            </Link>

            <Link href="/seller/earnings">
              <li
                className={
                  pathname == "/seller/earnings" ? isActiveTab : isInactiveTab
                }
              >
                <p className="text-[18px] ">Earnings</p>
              </li>
            </Link>
            <Link href="">
              <li
                onClick={() => {
                  toast.info("Services will be available soon!");
                }}
                className={
                  pathname == "/seller/services" ? isActiveTab : isInactiveTab
                }
              >
                <p className="text-[18px] ">Services</p>
              </li>
            </Link>
          </ul>
        </div>
        {/* <RegisterSeller /> */}
        <div className="mt-10">
          <ShareRegisterSeller />
        </div>
      </div>
    </div>
  );
}
