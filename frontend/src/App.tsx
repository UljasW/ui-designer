// App.js
import React, { useCallback, useContext } from "react";
import TestPage from "./pages/TestPage";
import WrapperComponent from "./pages/WrapperComponentTest";

export default function App() {
  return (
    <div className="App">
      <WrapperComponent></WrapperComponent>
    </div>
  );
  
}
