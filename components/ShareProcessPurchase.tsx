import dynamic from "next/dynamic";
import React from "react";

const ProcessPurchaseClient = dynamic(() => import("./ProcessPurchaseClient"), {
  ssr: false,
});

const ShareProcessPurchase = ({ productId }: { productId: string }) => {
  return <ProcessPurchaseClient productId={productId} />;
};

export default ShareProcessPurchase;
