"use client";

import { Button } from "@/components/ui/button";
import { cartState } from "@/store/atom/cartState";
import Image from "next/image";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export default function Cart() {
  const [cartVal, setCartVal] = useRecoilState(cartState);

  const setCartState = () => {
    setCartVal(false);
  };

  return (
    <div className="border pt-16 bg-black bg-opacity-20 h-screen flex justify-end">
      {cartVal && (
        <div className="relative w-96 bg-white">
          <div className="flex items-center justify-between p-2 px-3 mb-8 mt-3">
            <p className="font-medium text-xl">Your Cart</p>
            <button
              onClick={setCartState}
              className="border p-1 bg-[#EAEAE9] rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 15 15"
              >
                <path
                  fill="black"
                  d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27"
                />
              </svg>
            </button>
          </div>
          <div className="px-2">
            <ProductLabelCard
              productName="UX designs"
              productCategory="digital product"
              price="49"
              thumbnailUrl=""
            />
            <ProductLabelCard
              productName="UX designs"
              productCategory="digital product"
              price="49"
              thumbnailUrl=""
            />
          </div>

          <div className="border h-72 p-3 flex flex-col gap-y-2 bg-[#E9E8E1] absolute w-full bottom-0">
            <div className="flex justify-between">
              <p>Total Price</p>
              <p>price</p>
            </div>
            <p>Discounts will be calculated at the next step.</p>
            <button className="h-14 rounded-sm font-medium text-white bg-[#4E6465]">
              Go to Cart
            </button>
            <button className="h-14 rounded-sm font-medium text-white bg-[#223D40]">
              Continue to Checkout
            </button>

            <p>Secured Payments via Crypto</p>
          </div>
        </div>
      )}
    </div>
  );
}

const ProductLabelCard = ({
  productName,
  productCategory,
  price,
  thumbnailUrl,
}: {
  productName: string;
  productCategory: string;
  price: string;
  thumbnailUrl: string;
}) => {
  return (
    <div className="border-t border-b h-24 grid grid-cols-5 items-center px-2 gap-x-8">
      <div className="col-span-1 rounded-md w-16 h-16">
        <Image
          className="w-full h-full object-cover rounded-md"
          src={thumbnailUrl}
          width={200}
          height={200}
          alt=""
        />
      </div>
      <div className="col-span-4 ">
        <p>{productName}</p>
        <p>{productCategory}</p>
        <div className="flex justify-between">
          <p>${price}.00</p>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 1H13M1 4H19M17 4L16.2987 14.5193C16.1935 16.0975 16.1409 16.8867 15.8 17.485C15.4999 18.0118 15.0472 18.4353 14.5017 18.6997C13.882 19 13.0911 19 11.5093 19H8.49065C6.90891 19 6.11803 19 5.49834 18.6997C4.95276 18.4353 4.50009 18.0118 4.19998 17.485C3.85911 16.8867 3.8065 16.0975 3.70129 14.5193L3 4"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
