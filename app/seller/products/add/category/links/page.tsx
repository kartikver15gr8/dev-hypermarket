"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Links() {
  const [title, setTitle] = useState("");

  return (
    <div className="pt-16 pb-20 px-[15px] sm:px-[20px] md:px-[40px] min-h-screen lg:px-[60px] xl:px-20 bg-[#FAF9F5] w-full relative overflow-y-auto hide-scrollbar h-[90vh] scroll-smooth ">
      <div className="mt-5  flex justify-between items-center">
        <div className="mt-5 w-fit">
          <div className="flex gap-x-2 items-center ">
            <p className="font-bold text-3xl italic">ADD PRODUCT BUY LINK</p>
          </div>
          <p>List your product on Sendit here.</p>
        </div>
      </div>
      {/* <ProductDescription /> */}
      <div className="border mt-6 rounded-xl p-4 bg-white">
        <p className="font-medium text-lg">Share the product link below</p>
        <div className="grid grid-cols-1 gap-x-5 mt-4">
          <div className="">
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
      </div>
      <div className=" mt-5 flex justify-end">
        <Button className="rounded w-36 bg-black text-white">
          LIST PRODUCT
        </Button>
      </div>
    </div>
  );
}
