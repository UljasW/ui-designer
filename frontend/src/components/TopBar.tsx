import React from "react";


export default function TopBar({children}: {children: React.ReactNode}) {
  return (
    <div
      style={{
        height: "50px",
        display: "flex",
        flexDirection: "row",
        background: "#F3F4F6", 
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        borderBottom: "1px solid #ced4da",
      }}
    >
        {children}
    </div>
  );
}
