import React, { useRef, useEffect, useLayoutEffect, useState, createElement } from 'react';
//install Rough.js library : npm install --save roughjs
import rough from 'roughjs/bundled/rough.esm';

//I will add comments later

const generator = rough.generator();

function CreateElement(x1,y1, x2, y2, type){
  const roughElement = 
  type === "line"
    ? generator.line(x1,y1,x2,y2)
    : generator.rectangle(x1,y1,x2- x1,y2- y1);
  
  return{x1,y1, x2, y2, roughElement};
}


const DrawingEditor = () => {
  
  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false); 
  const [elementType, setElementType] = useState("line");


  //hook
  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0,0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);
    
    elements.forEach(({roughElement}) => roughCanvas.draw(roughElement));
    
  }, [elements]);

  const handleMouseDown = (event) =>{

    setDrawing(true);
    const {clientX,clientY } = event;
    const element = CreateElement(clientX,clientY,clientX,clientY, elementType);
    setElements(prevState =>[...prevState,element]);

  };
  const handleMouseMove = (event) =>{
  
  if (!drawing)return;
  const{clientX, clientY} = event;
  const index = elements.length - 1;
  const {x1,y1} = elements[index];
  const updatedElement = CreateElement(x1,y1,clientX,clientY, elementType);
  const elementCopy = [...elements];
  
  elementCopy[index] = updatedElement;
  setElements(elementCopy);
  
  };
  const handleMouseUp = (event) =>{
    setDrawing(false);
  };
  


  return(
  <div>
    <div style ={{position: "fixed"}}>
    <input 
    type ="radio"
    id = "Line"
    checked={elementType =="line"}
    onChange={() => setElementType("line")}
    />
    < label htmlFor ="Line">Line</label>
    <input
    type="radio"
    id="rectangle"
    checked={elementType =="rectangle"}
    onChange={()=>setElementType("rectangle")}
    />
    < label htmlFor ="rectangle">rectangle</label>
    </div>
    <canvas id = "canvas" 
  width = {window.innerWidth}
  height = {window.innerHeight}
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
  >

  </canvas>

    
  </div>
  
);};
export default DrawingEditor;