import React from 'react'
interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.Canvas | undefined>;
}

export default function Layers(props:FabricCanvasProps) {
  return (
    <div style={{width:"200px", background:"grey"}}>layers</div>
  )
}
