"use client";
import React from "react";
import dynamic from "next/dynamic";

const Maps = dynamic(() => import("../app/components/Maps"), {
  ssr: false,
});

const page = () => {
  return <Maps />;
};

export default page;
