"use client";

import Image from "next/image";
import hex from "@/public/hex.svg";
import randomstatic from "@/public/randomstatic.png";
import circlemedal from "@/public/circlemedal.svg";
import logodesign from "@/public/marqueeicons/logodesign.png";
import Link from "next/link";
import { CategoryInterface, ProductAnalytics } from "@/lib/models";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { phantomWallet } from "@/store/atom/phantomWallet";
import spinnerthree from "@/public/loaders/spinnerthree.svg";
import { toast } from "sonner";
import { Widget } from "@uploadcare/react-widget";

const uploadcarekey = process.env.NEXT_PUBLIC_UPLOADCARE_KEY || "";

const statusActive =
  "h-8 text-[#6C7E7F] border rounded-[6px] flex items-center justify-center bg-[#FFF] shadow-md";

const statusInactive =
  "h-8 text-[#6C7E7F] rounded-[6px] flex items-center justify-center";

export default function SellerProductPage() {
  const [productAnalytics, setProductsAnalytics] = useState<ProductAnalytics[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const sellerWalletAddress = useRecoilValue(phantomWallet);
  const [categoryId, setCategoryId] = useState<string | number | undefined>();
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allChecked, setAllChecked] = useState(false);
  const [searchKeysProducts, setSearchKeysProducts] = useState("");
  const [productStatusState, setProductStatusState] = useState(5);

  const filteredProducts = productAnalytics.filter((product) => {
    const matchesSearch = product.product.name
      .toLowerCase()
      .includes(searchKeysProducts.toLowerCase());
    const matchesCategory =
      categoryId === undefined || product.product.category_id === categoryId;

    if (productStatusState == 5) {
      return matchesSearch && matchesCategory;
    } else {
      const matchedStatus =
        product.product.status == productStatusState.toString();
      return matchesSearch && matchesCategory && matchedStatus;
    }
  });

  const handleChange = (event: any) => {
    const selectedCategoryId = event.target.value;
    if (categories) {
      const selectedCategory = categories.find(
        (category) => category.id === selectedCategoryId
      );
      // @ts-ignore
      setSelectedCategory(selectedCategory);
      setCategoryId(selectedCategory?.id);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SWAGGER_API_V2}/categories`
      );
      setCategories(response.data);
      return response.data;
    } catch (error) {
      console.log(`Error while fetching categories: ${error}`);
    }
  };

  useEffect(() => {
    if (sellerWalletAddress) {
      fetchCategories();
    }
  }, [sellerWalletAddress]);

  const fetchProductAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_SWAGGER_URL}/fetch/analytics/product?seller_wallet_address=${sellerWalletAddress}`
      );
      // console.log(response.data);
      setProductsAnalytics(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(`You got error while fetching product analytics: ${error}`);
    }
  };

  useEffect(() => {
    if (sellerWalletAddress) {
      fetchProductAnalytics();
    }
  }, [sellerWalletAddress]);

  return (
    <div className="w-[100%] pb-20 relative overflow-y-auto hide-scrollbar h-[90vh] scroll-smooth">
      <ProductTopLabel />
      <div className="px-[20px] sm:px-[20px] md:px-[40px] lg:px-[60px] xl:px-20 mt-8 ">
        <div className="">
          <div className="flex justify-between items-center">
            <p className="text-[14px] lg:text-lg font-medium">
              Listed Products
            </p>
            <Link
              href={"products/addproduct"}
              className="flex items-center justify-center gap-x-1 bg-[#4E6465] text-[12px] md:text-[14px] w-24 md:w-32 h-8 rounded-md hover:bg-[#bac3c4] transition-all duration-300"
            >
              <svg
                width="12"
                height="13"
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.99961 4.09998V8.89998M3.59961 6.49998H8.39961M3.47961 11.9H8.51961C9.5277 11.9 10.0318 11.9 10.4168 11.7038C10.7555 11.5312 11.0308 11.2559 11.2034 10.9172C11.3996 10.5321 11.3996 10.0281 11.3996 9.01998V3.97998C11.3996 2.97188 11.3996 2.46783 11.2034 2.08279C11.0308 1.7441 10.7555 1.46874 10.4168 1.29616C10.0318 1.09998 9.5277 1.09998 8.51961 1.09998H3.47961C2.47151 1.09998 1.96747 1.09998 1.58243 1.29616C1.24373 1.46874 0.96837 1.7441 0.795798 2.08279C0.599609 2.46783 0.599609 2.97188 0.599609 3.97998V9.01998C0.599609 10.0281 0.599609 10.5321 0.795798 10.9172C0.96837 11.2559 1.24373 11.5312 1.58243 11.7038C1.96747 11.9 2.47151 11.9 3.47961 11.9Z"
                  stroke="#FEFEFD"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className=" text-white">New Product</p>
            </Link>
          </div>
          <div className="grid grid-cols-12 gap-x-4 mt-3 gap-y-2 md:gap-y-0">
            <div className="h-10 border border-[#DEDEDE] p-[2px] rounded-[8px] col-span-12 md:col-span-5 grid grid-cols-5 items-center bg-[#EAEAEB] gap-x-1 text-xs md:text-[13px] lg:text-sm">
              <div
                onClick={() => {
                  setProductStatusState(5);
                }}
                className={
                  productStatusState == 5 ? statusActive : statusInactive
                }
              >
                All
              </div>
              <div
                onClick={() => {
                  setProductStatusState(1);
                }}
                className={
                  productStatusState == 1 ? statusActive : statusInactive
                }
              >
                Active
              </div>
              <div
                onClick={() => {
                  setProductStatusState(2);
                }}
                className={
                  productStatusState == 2 ? statusActive : statusInactive
                }
              >
                Inactive
              </div>
              <div
                onClick={() => {
                  setProductStatusState(3);
                }}
                className={
                  productStatusState == 3 ? statusActive : statusInactive
                }
              >
                Archived
              </div>
              <div
                onClick={() => {
                  setProductStatusState(0);
                }}
                className={
                  productStatusState == 0 ? statusActive : statusInactive
                }
              >
                Draft
              </div>
            </div>
            <div className="h-10 border border-[#DEDEDE] text-xs md:text-[13px] lg:text-sm rounded-md col-span-4 md:col-span-2 flex items-center justify-center gap-x-1">
              {/* <p>Digital Product</p> */}
              {categories && (
                <select
                  className=" outline-none"
                  id="category-select"
                  //@ts-ignore
                  value={selectedCategory?.id || ""}
                  onChange={handleChange}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="h-10 border border-[#DEDEDE] rounded-md col-span-8 md:col-span-5 flex items-center pl-2">
              <svg
                className="mr-2"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.49935 10.0602C10.5223 9.14471 11.166 7.81421 11.166 6.33337C11.166 3.57195 8.92743 1.33337 6.16602 1.33337C3.40459 1.33337 1.16602 3.57195 1.16602 6.33337C1.16602 9.09479 3.40459 11.3334 6.16602 11.3334C7.4466 11.3334 8.61477 10.852 9.49935 10.0602ZM9.49935 10.0602L13.2725 13.8334"
                  stroke="#8B8B92"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                className="h-full w-full outline-none rounded-r-lg"
                type="text"
                placeholder="Search"
                onChange={(e) => {
                  setSearchKeysProducts(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-x-1 items-center">
              <input
                type="checkbox"
                onChange={(e) => {
                  setAllChecked(e.target.checked);
                }}
              />
              <p>{allChecked ? `All Selected` : `Select All`}</p>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            filteredProducts.map((elem, key) => (
              <ProductSales
                key={key}
                productId={elem.product_id}
                productName={elem.product.name}
                productCategory={elem.product.category.name}
                productImage={elem.product.thumbnail_url}
                productSold={elem.sales}
                productViews={elem.views}
                productPrice={elem.product.price}
                productFile={elem.product.filename}
                productDescription={elem.product.description}
                productComparePrice={elem.product.compare_price}
                status={elem.product.status}
                dateCreated={elem.product.created_at}
                allChecked={allChecked}
                userId={elem.product.user_id}
                categoryId={elem.product.category_id}
              />
            ))
          ) : (
            <div className="mt-3 border border-[#DEDEDE] rounded-xl h-48 flex items-center justify-center">
              {isLoading ? (
                <Image className="w-10 lg:w-12" src={spinnerthree} alt="" />
              ) : (
                <p className="text-xl"> No Products with key</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ProductTopLabel = () => {
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
        <div className=" h-full flex items-center">
          <p className="text-sm lg:text-lg font-medium">Products</p>
        </div>
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
      </div>
    </div>
  );
};

const ProductSales = ({
  productId,
  productName,
  productCategory,
  productViews,
  productImage,
  productSold,
  dateCreated,
  productDescription,
  productFile,
  productPrice,
  productComparePrice,
  status,
  allChecked,
  userId,
  categoryId,
}: {
  productId: number;
  productName: string;
  productCategory: string;
  productViews: number;
  productDescription: string;
  productPrice: string;
  productComparePrice: string;
  productFile: string;
  productImage: string;
  productSold: number;
  dateCreated: string;
  status: string;
  allChecked: boolean;
  userId: number;
  categoryId: number;
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const [newProductName, setNewProductName] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newComparePrice, setNewComparePrice] = useState("");

  const editProduct = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_SWAGGER_URL}/product/${productId}`,
        {
          name: newProductName,
          description: newProductDescription,
          price: newPrice,
          compare_price: newComparePrice,
          user_id: userId,
          category_id: categoryId,
          thumbnail_url: imageUrl,
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsEditing(false);
      return response.data;
    } catch (error) {}
  };

  const toggleEditState = () => {
    setIsEditing(!isEditing);
    setIsPopupVisible(false);
  };

  const handleFileUpload = (fileInfo: any) => {
    if (fileInfo) {
      const url = fileInfo.cdnUrl;
      setImageUrl(url);
    } else {
      console.log("No files");
    }
  };
  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const dateStr = dateCreated;
  const date = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const deleteProduct = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_SWAGGER_URL}/product/${productId}`
      );
      console.log(response.data);
      toast.info("Product Deleted!");
    } catch (error) {
      console.log(`You got an error while making the delete call: ${error}`);
    }
  };

  const duplicateProduct = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_SWAGGER_URL}/product/${productId}/duplicate`
      );
      return response.data;
    } catch (error) {
      console.log(`You got an error while duplicating the product`);
      toast.error("Error while duplicating the product");
    }
  };

  const updateProductStatus = async (
    newStatus: number,
    successMessage: string
  ) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_SWAGGER_URL}/product/${productId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.info(successMessage);
      return response.data;
    } catch (error) {
      toast.error(`Got an error while updating the product status`);
    }
  };

  const formattedDate = date.toLocaleString("en-US", options);
  return (
    <div className="mt-3 border border-[#DEDEDE] rounded-xl ">
      <div className="flex rounded-t-xl justify-between items-center p-3 h-12 border-b border-[#DEDEDE] bg-[#F9F9FD]">
        {allChecked ? (
          <input type="checkbox" checked={allChecked} />
        ) : (
          <input type="checkbox" />
        )}
        <div className="flex gap-x-2">
          <a
            href={`https://dial.to/?action=solana-action%3Ahttps%3A%2F%2Fblinks.sendit.markets%2Fapi%2Factions%2Fmint-nft%2F${productId}&cluster=devnet`}
            target="_blank"
            className="flex items-center bg-opacity-65 border rounded-md h-6 px-1 bg-black text-white border-black"
          >
            <p>Mint as NFT</p>
          </a>
          <div className="flex items-center bg-opacity-45 border border-green-600 rounded-md h-6 px-1 bg-green-400">
            <p>{(status = 1 ? "Active" : "Inactive")}</p>
          </div>
          <div
            className="flex items-center w-fit cursor-pointer"
            onClick={togglePopup}
          >
            <svg
              className="w-4 hover:rotate-90 transition-all duration-200"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                fill="#767676"
                d="M10.001 7.8a2.2 2.2 0 1 0 0 4.402A2.2 2.2 0 0 0 10 7.8zm0-2.6A2.2 2.2 0 1 0 9.999.8a2.2 2.2 0 0 0 .002 4.4m0 9.6a2.2 2.2 0 1 0 0 4.402a2.2 2.2 0 0 0 0-4.402"
              />
            </svg>
          </div>

          {/* Popup Window */}
          {isPopupVisible && (
            <div className="absolute w-36 bg-white border rounded-md shadow-lg p-1">
              <ul>
                <Link href={`/seller/products/edit/${productId}`}>
                  <li className="px-2 rounded-sm py-1 flex items-center cursor-pointer hover:bg-[#EAEAEB] transition-all duration-200">
                    Edit
                  </li>
                </Link>
                <li
                  onClick={duplicateProduct}
                  className="px-2 rounded-sm py-1 flex items-center cursor-pointer hover:bg-[#EAEAEB] transition-all duration-200"
                >
                  Duplicate
                </li>
                <li
                  onClick={deleteProduct}
                  className="px-2 rounded-sm py-1 flex items-center cursor-pointer hover:bg-[#EAEAEB] transition-all duration-200"
                >
                  Delete
                </li>
                <li
                  onClick={() =>
                    updateProductStatus(0, "Product is in draft now!")
                  }
                  className="px-2 rounded-sm py-1 flex items-center cursor-pointer hover:bg-[#EAEAEB] transition-all duration-200"
                >
                  Draft
                </li>

                <li
                  onClick={() =>
                    updateProductStatus(2, "Product is now inactive!")
                  }
                  className="px-2 rounded-sm py-1 flex items-center cursor-pointer hover:bg-[#EAEAEB] transition-all duration-200"
                >
                  Inactive
                </li>

                <li
                  onClick={() =>
                    updateProductStatus(3, "Product has been archived!")
                  }
                  className="px-2 rounded-sm py-1 flex items-center cursor-pointer hover:bg-[#EAEAEB] transition-all duration-200"
                >
                  Archive
                </li>
              </ul>
              <button
                onClick={togglePopup}
                className="mt-1 w-full font-medium text-white bg-[#6a8688] border border-[#4E6465] hover:bg-[#223D40] transition-all duration-200 flex items-center justify-center rounded"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
      {isEditing ? (
        <div className="p-3 h-96 ">
          <p className="font-medium">Edit Product</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-4 mt-8">
            <div>
              <p className="text-sm">Product Name</p>
              <input
                onChange={(e) => {
                  setNewProductName(e.target.value);
                }}
                type="text"
                placeholder="Product Name"
                className="border h-12 rounded p-1 w-full"
              />
            </div>
            <div>
              <p className="text-sm">Description</p>
              <input
                onChange={(e) => {
                  setNewProductDescription(e.target.value);
                }}
                type="text"
                placeholder="Description"
                className="border h-12 rounded p-1 w-full"
              />
            </div>
            <div>
              <p className="text-sm">Price</p>
              <input
                onChange={(e) => {
                  setNewPrice(e.target.value);
                }}
                type="text"
                placeholder="Price"
                className="border h-12 rounded p-1 w-full"
              />
            </div>
            <div>
              <p className="text-sm">Compare Price</p>
              <input
                onChange={(e) => {
                  setNewComparePrice(e.target.value);
                }}
                type="text"
                placeholder="Product Name"
                className="border h-12 rounded p-1 w-full"
              />
            </div>
            <div className="border flex flex-col items-center justify-center p-1 text-white bg-[#e7e7e7] rounded h-32 relative">
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
            <div className="flex gap-x-1 justify-end items-end">
              <button
                onClick={editProduct}
                className="border bg-[#4E6465] font-medium text-white p-2 w-24 h-12 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={toggleEditState}
                className="border bg-red-700 text-white font-medium p-2 w-24 h-12 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-10 h-36 ">
          <div className="p-4 border-r border-[#DEDEDE] col-span-7  flex flex-col justify-between">
            <Link
              href={`/product/${productId}`}
              className="flex items-center gap-x-3"
            >
              <Image
                className="rounded-md w-10 h-10 border"
                src={productImage}
                alt=""
                width={100}
                height={100}
              />
              <div>
                <p className="font-medium text-xs md:text-[13px] lg:text-sm">
                  {productName}
                </p>
                <p className="text-[11px] md:text-[12px] lg:text-sm">
                  {productCategory}
                </p>
              </div>
            </Link>
            <div>
              <div className="flex gap-x-1 items-center">
                <svg
                  width="10"
                  height="12"
                  viewBox="0 0 10 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.5 5H0.5M7 1V3M3 1V3M2.9 11H7.1C7.94008 11 8.36012 11 8.68099 10.8365C8.96323 10.6927 9.1927 10.4632 9.33651 10.181C9.5 9.86012 9.5 9.44008 9.5 8.6V4.4C9.5 3.55992 9.5 3.13988 9.33651 2.81901C9.1927 2.53677 8.96323 2.3073 8.68099 2.16349C8.36012 2 7.94008 2 7.1 2H2.9C2.05992 2 1.63988 2 1.31901 2.16349C1.03677 2.3073 0.8073 2.53677 0.66349 2.81901C0.5 3.13988 0.5 3.55992 0.5 4.4V8.6C0.5 9.44008 0.5 9.86012 0.66349 10.181C0.8073 10.4632 1.03677 10.6927 1.31901 10.8365C1.63988 11 2.05992 11 2.9 11Z"
                    stroke="#B0AFA9"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <p className="text-xs md:text-[13px] lg:text-sm">Listed on</p>
              </div>
              <p className="text-xs md:text-[13px] lg:text-sm">
                {formattedDate}
              </p>
            </div>
          </div>
          <div className="col-span-3 grid grid-cols-1 text-xs md:text-[13px] lg:text-sm">
            <div className="flex flex-col justify-center px-3">
              <div className="flex gap-x-1 items-center">
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.21006 4.35659C1.14197 4.24877 1.10792 4.19486 1.08886 4.11171C1.07455 4.04925 1.07455 3.95075 1.08886 3.88829C1.10792 3.80514 1.14197 3.75123 1.21006 3.64341C1.77276 2.75242 3.4477 0.5 6.0002 0.5C8.5527 0.5 10.2276 2.75242 10.7903 3.64341C10.8584 3.75123 10.8925 3.80514 10.9115 3.88829C10.9259 3.95075 10.9259 4.04925 10.9115 4.11171C10.8925 4.19486 10.8584 4.24877 10.7903 4.35659C10.2276 5.24758 8.5527 7.5 6.0002 7.5C3.4477 7.5 1.77276 5.24758 1.21006 4.35659Z"
                    stroke="#B0AFA9"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.0002 5.5C6.82863 5.5 7.5002 4.82843 7.5002 4C7.5002 3.17157 6.82863 2.5 6.0002 2.5C5.17177 2.5 4.5002 3.17157 4.5002 4C4.5002 4.82843 5.17177 5.5 6.0002 5.5Z"
                    stroke="#B0AFA9"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <p>View</p>
              </div>
              <p>{productViews}</p>
            </div>
            <div className="flex flex-col justify-center px-3">
              <div className="flex gap-x-1 items-center">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.99735 2.99805C6.99735 3.52848 6.78664 4.03719 6.41157 4.41226C6.03649 4.78733 5.52779 4.99805 4.99735 4.99805C4.46692 4.99805 3.95821 4.78733 3.58314 4.41226C3.20807 4.03719 2.99735 3.52848 2.99735 2.99805M0.813962 2.69874L0.463962 6.89874C0.388773 7.801 0.351179 8.25213 0.503695 8.60014C0.637696 8.9059 0.869867 9.15823 1.16345 9.31716C1.49759 9.49805 1.95028 9.49805 2.85567 9.49805H7.13903C8.04442 9.49805 8.49712 9.49805 8.83126 9.31716C9.12484 9.15823 9.35701 8.9059 9.49101 8.60014C9.64353 8.25213 9.60593 7.801 9.53074 6.89873L9.18074 2.69874C9.11605 1.92242 9.0837 1.53426 8.91179 1.24048C8.7604 0.981768 8.53498 0.774348 8.2646 0.64497C7.95755 0.498047 7.56804 0.498047 6.78903 0.498047L3.20567 0.498047C2.42666 0.498047 2.03716 0.498047 1.73011 0.644969C1.45972 0.774347 1.2343 0.981767 1.08292 1.24047C0.911002 1.53426 0.878655 1.92242 0.813962 2.69874Z"
                    stroke="#B0AFA9"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>Sold</p>
              </div>
              <p>{productSold}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MidSection = () => {
  return (
    <div className="border rounded-2xl grid grid-cols-3 bg-white">
      <div className="p-4">
        <div className=" flex items-center gap-x-1">
          <p className="text-[13px]">AVAILABLE BALANCE</p>
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
        <p className="font-bold text-4xl my-3">$20</p>
        <div className="flex w-32 h-10 items-center gap-x-1 border rounded-2xl justify-center shadow-lg">
          <p>Withdraw</p>
          <svg
            width="14"
            height="15"
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
      <div className="border-r border-l p-4">
        <div className=" flex items-center gap-x-1">
          <p className="text-[13px]">TODAY TOTAL SALES</p>
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
        <p className="font-bold text-4xl my-3">$50</p>
        <div className="flex justify-between">
          <div className="w-fit ">
            <p className="text-[12px] font-medium">Top Product</p>
            <p className="text-[11px]">How to Design Better UI</p>
          </div>
          <div className="border flex items-center w-20 justify-center rounded-lg bg-[#E8ECEC]">
            <p>5 Sales</p>
          </div>
        </div>
      </div>
      <div className=" p-4">
        <div className=" flex items-center gap-x-1">
          <p className="text-[13px]">TOTAL SALES IN 7 DAYS</p>
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
        <p className="font-bold text-4xl my-3">$100</p>
        <div className="mt-8 text-[12px] flex gap-x-1 ">
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
        <p className="text-[13px]">TOTAL EARNINGS</p>
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
          <p className="font-bold text-6xl">1240.00</p>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="relative">
            <Image className="w-10" src={circlemedal} alt="" />
          </div>
          <p className="w-44 text-[14px] text-wrap">
            You&apos;ve reached $1500 in total sales!
          </p>
        </div>
        <div className="flex justify-end items-center">
          <div className="border shadow-lg h-10 rounded-xl w-40 flex items-center gap-x-1 justify-center hover:bg-[#E8ECEC] transition-all duration-300">
            <p>Analytics</p>
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
      <p className="font-medium text-xl">Your Path to Level 3</p>
      <div className="grid grid-cols-2  w-[70%]">
        <div className=" p-2 gap-x-2 flex items-center ">
          <input type="checkbox" />
          <div className="">
            <p className="text-[13px]">Complete at least 10 sales</p>
            <p className="text-[11px] text-[#8B8B93]">7/10 sales completed</p>
          </div>
        </div>
        <div className=" p-2 gap-x-2 flex items-center ">
          <input type="checkbox" />
          <div className="">
            <p className="text-[13px]">Total sales of $1,750 USD equivalent</p>
            <p className="text-[11px] text-[#8B8B93]">1500/1750</p>
          </div>
        </div>
        <div className=" p-2 gap-x-2 flex items-center ">
          <input type="checkbox" />
          <div className="">
            <p className="text-[13px]">Maintain a 4.2/5.0 average rating</p>
            <p className="text-[11px] text-[#8B8B93]">Current 4.5</p>
          </div>
        </div>
        <div className=" p-2 gap-x-2 flex items-center ">
          <input type="checkbox" />
          <div className="">
            <p className="text-[13px]">Maintain a 4.2/5.0 average rating</p>
            <p className="text-[11px] text-[#8B8B93]">Current 4.5</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sales = () => {
  return (
    <div className="mt-6 border rounded-2xl p-5 h-80 bg-white">
      <div className=" flex items-center gap-x-1">
        <p className="text-[15px]">SALES</p>
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
        <p className="text-[13px] col-span-1">Date</p>
        <p className="text-[13px] col-span-3">Product Name</p>
        <p className="text-[13px] col-span-3">Buyer</p>
        <p className="text-[13px] col-span-1">Quantity</p>
        <p className="text-[13px] col-span-1">Price</p>
        <p className="text-[13px] col-span-1">Status</p>
        <p className="text-[13px] col-span-2">Hash</p>
      </div>
      <div className="relative overflow-y-auto hide-scrollbar scroll-smooth h-52">
        <SalesLabel
          date="10/10/24"
          productName="How to Design Better UI"
          buyer="johndoe@sendit.zone"
          quantity={12}
          price="$32"
          status="confirmed"
          hash="0b3fe99b745ba2079"
        />
        <SalesLabel
          date="10/10/24"
          productName="How to Design Better UI"
          buyer="johndoe@xsy.com"
          quantity={12}
          price="$32"
          status="pending"
          hash="0b3fe99b745ba2079"
        />
        <SalesLabel
          date="10/10/24"
          productName="How to Design Better UI"
          buyer="johndoe@sendit.zone"
          quantity={12}
          price="$32"
          status="confirmed"
          hash="0b3fe99b745ba2079"
        />
        <SalesLabel
          date="10/10/24"
          productName="How to Design Better UI"
          buyer="johndoe@sendit.zone"
          quantity={12}
          price="$32"
          status="confirmed"
          hash="0b3fe99b745ba2079"
        />
        <SalesLabel
          date="10/10/24"
          productName="How to Design Better UI"
          buyer="johndoe@sendit.zone"
          quantity={12}
          price="$32"
          status="confirmed"
          hash="0b3fe99b745ba2079"
        />
        <SalesLabel
          date="10/10/24"
          productName="How to Design Better UI"
          buyer="johndoe@sendit.zone"
          quantity={12}
          price="$32"
          status="confirmed"
          hash="0b3fe99b745ba2079"
        />
        <SalesLabel
          date="10/10/24"
          productName="How to Design Better UI"
          buyer="johndoe@sendit.zone"
          quantity={12}
          price="$32"
          status="confirmed"
          hash="0b3fe99b745ba2079"
        />
        <SalesLabel
          date="10/10/24"
          productName="How to Design Better UI"
          buyer="johndoe@sendit.zone"
          quantity={12}
          price="$32"
          status="confirmed"
          hash="0b3fe99b745ba2079"
        />
        <SalesLabel
          date="10/10/24"
          productName="How to Design Better UI"
          buyer="johndoe@sendit.zone"
          quantity={12}
          price="$32"
          status="confirmed"
          hash="0b3fe99b745ba2079"
        />
        <SalesLabel
          date="10/10/24"
          productName="How to Design Better UI"
          buyer="johndoe@sendit.zone"
          quantity={12}
          price="$32"
          status="confirmed"
          hash="0b3fe99b745ba2079"
        />
      </div>
    </div>
  );
};

const SalesLabel = ({
  date,
  productName,
  buyer,
  quantity,
  price,
  status,
  hash,
}: {
  date: string;
  productName: string;
  buyer: string;
  quantity: number;
  price: string;
  status: string;
  hash: string;
}) => {
  return (
    <div className="border-b px-2 grid grid-cols-12 items-center w-full h-10">
      <p className="text-[13px] col-span-1">{date}</p>
      <p className="text-[13px] col-span-3">{productName}</p>
      <p className="text-[13px] col-span-3">{buyer}</p>
      <p className="text-[13px] col-span-1">{quantity}</p>
      <p className="text-[13px] col-span-1">{price}</p>
      <div className="text-[13px] flex items-center col-span-1">
        {status == "confirmed" ? (
          <div className="flex items-center bg-opacity-45 border border-green-600 rounded-md h-6 px-1 bg-green-400 ">
            <p>{status}</p>
          </div>
        ) : (
          <div className="flex items-center bg-opacity-45 border border-red-600 rounded-md h-6 px-1 bg-red-400 ">
            <p>{status}</p>
          </div>
        )}
      </div>
      <div className="text-[13px] col-span-2 flex items-center">
        <p>{hash}</p>
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
    </div>
  );
};
