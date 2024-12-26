"use client";
import { Progress } from "../ui/progress";

export default function ProductPageTopbar({ barValue }: { barValue: number }) {
  return (
    <div className="pt-6 pb-6  flex justify-between items-center w-full ">
      <div className=" w-fit">
        <div className="flex gap-x-2 items-center ">
          <p className="font-bold text-2xl italic">ADD PRODUCT</p>
        </div>
        <p className="text-sm">List your product in three easy steps.</p>
      </div>
      <div className="mt-5 w-[650px] flex flex-col justify-center ">
        <div className="h-5 relative flex  items-center">
          <div className="absolute z-10 grid grid-cols-3 w-full">
            <div className="w-5 border-2 rounded-full h-5 border-black bg-white text-black text-sm font-medium flex items-center justify-center">
              1
            </div>
            <div className="w-5 border-2 rounded-full h-5 border-black bg-white text-black text-sm font-medium flex items-center justify-center">
              2
            </div>
            <div className="w-5 border-2 rounded-full h-5 border-black bg-white text-black text-sm font-medium flex items-center justify-center">
              3
            </div>
          </div>
          <Progress className="h-2 border border-[#223D40]" value={barValue} />
        </div>

        <div className="w-full  grid grid-cols-3 mt-1e">
          <p className="text-[#223D40] text-[13px]">add product info</p>
          <p className="text-[#223D40] text-[13px]">select product</p>
          <p className="text-[#223D40] text-[13px]">list product</p>
        </div>
      </div>

      <a
        // href={`/product/preview?title=${title}&price=${price}&imgurl=${imageUrl}&compareprice=${comparePrice}&category=${categoryName}`}
        href=""
        target="_blank"
        className="flex justify-center shadow-md items-center gap-x-1 w-24 bg-white rounded-md border h-10"
      >
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
      </a>
    </div>
  );
}
