import React, { useCallback, useContext } from 'react'
import { fabric } from 'fabric';
import FabricCanvas from '../features/canvas/FabricCanvas';
import { Canvas } from 'fabric/fabric-impl';

type TestPageProps = {
    canvas: Canvas | null;
  };

  
const TestPage : React.FC<TestPageProps> = ({ canvas }) => {
    
    console.log("Canvas in TestPage.tsx:", canvas); // Add this log

    function addCircle() {
        console.log("Hello")

        if (canvas) {
          const circle = new fabric.Circle({
            top: 150,
            left: 150,
            radius: 50,
            fill: "blue",
          });

          const rect = new fabric.Rect({
            top: 100,
            left: 100,
            width: 60,
            height: 70,
            fill: 'red',
            selectable: true, // Ensure the object is selectable
            hasControls: true, // Display controls for scaling/rotating
          });
          
          canvas.add(rect);
          


          
        }
    }
      
    
      return (
        <div className="App">
          {canvas && <button onClick={addCircle}>Add Circle</button>}
        </div>
      );
};

export default TestPage;

