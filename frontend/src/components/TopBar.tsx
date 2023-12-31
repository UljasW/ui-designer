import React from "react";

interface Props {
  width?: string;
  height?: string;
  background?: string;
  boxShadow?: string;
  borderBottom?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
}

export default function TopBar({
  children,
  width,
  height,
  background,
  boxShadow,
  borderBottom,
  padding,
  margin,
  borderRadius,
}: Props & { children: React.ReactNode }) {
  return (
    <div
      style={{
        height: height || "50px",
        width: width || "100%",
        display: "flex",
        flexDirection: "row",
        backgroundColor: background || "#F3F4F6",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        borderBottom: "1px solid #ced4da",
      }}
    >
      {children}
    </div>
  );
}
