"use client";

import Image, { StaticImageData } from "next/image";
import ball from "@/public/ball.png";
import matrixcube from "@/public/matrixcube.png";
import cubeik from "@/public/cubeik.png";
import LinkIllu from "@/public/_static/illustrations/LinkIllu.png";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

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

function CategoryPageContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  return (
    <div className="pt-16 min-h-screen bg-[#FAF9F5] flex flex-col items-center w-full">
      <div className="w-[80%]">
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

const ProductCard = ({
  img,
  title,
  examples,
  redirectHref,
  isActive,
}: {
  img: string | StaticImageData;
  title: string;
  examples: string;
  redirectHref: string;
  isActive: boolean;
}) => {
  return (
    <Link
      href={redirectHref}
      className="border rounded-lg border-[#E5E5E5] bg-[#F5F5F5]  flex flex-col items-center justify-center aspect-square hover:bg-[#e5e5e5] transition-all duration-300 z-50"
    >
      <Image
        className={isActive ? tabActive.img : tabInactive.img}
        src={img}
        alt=""
      />
      <p className={isActive ? tabActive.title : tabInactive.title}>{title}</p>
      <p className={isActive ? tabActive.shortDes : tabInactive.shortDes}>
        {examples}
      </p>
    </Link>
  );
};
