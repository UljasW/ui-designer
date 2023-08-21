import React, { useRef } from "react";
import Canvas from "./features/canvas/Canvas";
import { fabric } from "fabric"; // Import the fabric object from the Fabric.js library

export default function App() {
  const editorRef = useRef<any>(null); // To store the editor instance

  const handleEditorReady = (editor : any) => {
    editorRef.current = editor; // Store the editor instance for manipulation
    
  };
  
  return (
    <div className="App">
      <h1>FabricJS React Sample</h1>
      <Canvas onReady={handleEditorReady} />
    </div>
  );
}
