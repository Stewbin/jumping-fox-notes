import React, { useRef, useEffect, useLayoutEffect, useState, createElement, act } from 'react';
//install Rough.js library : npm install --save roughjs
//install perfectfreehand : npm install perfect-freehand
import rough from 'roughjs/bundled/rough.esm';
import getStroke from 'perfect-freehand';
import { saveDrawing, loadDrawing, auth } from "../lib/firebase";
//I will add comments later
import {
  FaPencil,FaTrashCan,

} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { NodeViewWrapper } from '@tiptap/react';
import "../styles/Editor.css";
const generator = rough.generator();

const DrawingEditor = ({ editor, node, getPos, updateAttributes }) => {
  
  const exitDrawing = () => {
    updateAttributes({ elements })
    const pos = getPos()
    editor
      .chain()
      .focus()
      .setTextSelection(pos + node.nodeSize)
      .run()
  }


  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState('none'); 
  const [tool, setTool] = useState("line");
  const [selectedElement, setSelectedElement] = useState(null);
  const [stroke,setStroke] = useState(1);
  const [eraserRadius, setEraserRadius] = useState(10);
  const navigate = useNavigate();
  const [drawingId, setDrawingId] = useState(null);
  const canvasRef = useRef(null);
  const isDrawingSelected = editor.isActive('drawing')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDrawingId(user.uid);
      } else {
        navigate("/login", { replace: true });
      }
    });
    return unsub;
  }, [navigate]);
  

  useEffect(() => {
    const undoRedoFunction = event => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z"){
        if (event.shiftKey){
          redo();
        }else{
          undo();
        }
      }
    };
    document.addEventListener("keydown", undoRedoFunction);
    return () =>{
      document.removeEventListener("keydown",undoRedoFunction);
    };
  }, [undo, redo]);

 


  useLayoutEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    context.clearRect(0,0, canvas.width, canvas.height);
    if (!Array.isArray(elements)) return;
    const roughCanvas = rough.canvas(canvas);
    
    elements
    .filter(el => !el.erased)
    .forEach(el => drawElement(roughCanvas, context, el, stroke));
    
  }, [elements,stroke]);

  const stop = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  if (!isDrawingSelected) {
    return null;
  }
  
  

  const updateElement = (id, x1,y1,x2,y2,type) => {
    const elementsCopy = [...elements];
    switch(type){
        case "line":
        case "rectangle":
          elementsCopy[id] = CreateElement(id, x1, y1, x2,y2,type,stroke);
          
          break;
          case "pencil":
            elementsCopy[id].points = [...elementsCopy[id].points, {x: x2, y:y2 }];
            break;
          default: 
            throw new Error(`Type not recognised:${type} `)
    }
    setElements(elementsCopy, true);


  }
  function getRelativeCoords(event) {
    const { left, top } = canvasRef.current.getBoundingClientRect();
    return {
      clientX: event.clientX - left,
      clientY: event.clientY - top,
    };
  }
  const handleSave = async () => {
     console.log("drawingId=", drawingId);

  if (!drawingId) {
    console.error("No drawingId not found");
    return;
  }

  
  const savedElements = elements.map(el => {
    const base = { id: el.id, type: el.type, strokeWidth: el.strokeWidth };
    if (el.type === "line" || el.type === "rectangle") {
      base.x1 = el.x1; base.y1 = el.y1;
      base.x2 = el.x2; base.y2 = el.y2;
    }
    if (el.points) base.points = el.points;
    if (el.erased !== undefined) base.erased = el.erased;
    return base;
  });

  console.log("savingElements:", savedElements);

  try {
    await saveDrawing(drawingId, savedElements);
    console.log("saveDrawing succeeded");
    alert("Drawing saved!");
  } catch (err) {
    console.error("saveDrawing failed", err);
    alert("Save failed—check console");
  }
};

    const handleLoad = async () => {
      const data = await loadDrawing(drawingId);
      if (!data?.elements) {
        alert("No saved drawing found.");
        return;
      }
      const restored = data.elements.map(el => {
        if (el.type === "line" || el.type === "rectangle") {
          // these recreate the roughElement internally
          return CreateElement(
            el.id, el.x1, el.y1, el.x2, el.y2, el.type, el.strokeWidth
          );
      }
      if (el.type === "pencil") {
        
        return { ...el };
      }
      return el;
      
  });
  setElements(restored, true);
}

  const handleExportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    // for PNG:
    const dataURL = canvas.toDataURL('image/png');
  
    // Trigger a download
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'drawing.png';   
    a.click();
  }


  const handleMouseDown = (event) =>{
    if (!isDrawingSelected) return 
    const {clientX,clientY } = getRelativeCoords(event);
      if (tool === "eraser") {
      setAction("erasing");
      setElements(elms => eraseAt(elms, clientX, clientY, eraserRadius), true);
      return;
  }
    if (tool == "Selection"){
    
      const element = getElementAtPosition(clientX,clientY,elements);
      if (element){
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        setSelectedElement({...element, offsetX, offsetY});
        setElements(prevState => prevState);

        if (element.position === "inside"){
          setAction("moving");
        } else {
          setAction("resizing");
        }
        
      }
    
    }
    
    
    else{
    const id = elements.length;
    const element = CreateElement(id, clientX,clientY,clientX,clientY, tool,stroke);
    setElements(prevState =>[...prevState,element]);

    setAction("drawing");
    }

  };



  const handleMouseMove = (event) =>{
    if (!isDrawingSelected) return 
    const{clientX, clientY} = getRelativeCoords(event);
    if (tool == "Selection"){
      const element = getElementAtPosition(clientX,clientY,elements);
      event.target.style.cursor = element
      ? cursorForPosition(element.position)
      : "default";
      
    }
   
      if (action === "erasing") {
        setElements(elms => eraseAt(elms, clientX, clientY, eraserRadius), true);
      }
    
    
    

    if (action == "drawing"){
    const index = elements.length - 1;
    const {x1,y1} = elements[index];
    updateElement(index,x1,y1,clientX,clientY,tool);
    }else if (action ==="moving"){
      const{id,x1,x2,y1,y2,type, offsetX, offsetY}  = selectedElement;
      const width = x2-x1;
      const height = y2-y1;
      const newx1 = clientX - offsetX;
      const newy1 = clientY - offsetY;
      updateElement(id,newx1,newy1,newx1+width,newy1+ height,type)
    } else if (action === "resizing"){
      const {id,type, position, ...coordinates} = selectedElement;
      const {x1,y1,x2,y2} = resizedCoordinates(clientX, clientY, position, coordinates);
      updateElement(id, x1, y1,x2, y2, type);

    }
  };




  const handleMouseUp = (event) =>{
    if (!isDrawingSelected) return 
    if (selectedElement){
    const index = elements.length -1;
    const {id, type} = elements[index];
    if ((action === "drawing" || action === "resizing") && adjustmentRequired(type)){

      const {x1,y1,x2,y2} =  adjustElementCoordinates(elements[index]);
      updateElement(id, x1, y1,x2,y2,type);
    }
  }
    setAction("none");
    setSelectedElement(null);
  };

  const SwitchToDrawingEditor = () => {
    navigate("/home")
  };

  const ClearPage = () => {
    setAction("none");
    setSelectedElement(null);
    setElements([], true);
  }


  return(
    <NodeViewWrapper
    className="drawing-node-view"
    contentEditable={false}    // make the whole node non‑editable
    draggable={false}
  >
     {/* intercepts before ProseMirror */}
     <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}

      onMouseDown={e => { stop(e); handleMouseDown(e); }}
      onMouseMove={e => { stop(e); handleMouseMove(e); }}
      onMouseUp  ={e => { stop(e); handleMouseUp(e); }}

      style={{
        position: 'relative',  
        zIndex: 0,
      }}
    />
 
  <button
    onMouseDown={stop}
    className={tool === "line" ? "is-active toolbar-button" : "toolbar-button"}
    onClick={() => setTool("line")}
  >
    Line
  </button>

  <button
    onMouseDown={stop}
    className={tool === "rectangle" ? "is-active toolbar-button" : "toolbar-button"}
    onClick={() => setTool("rectangle")}
  >
    Rect
  </button>

  <button
    onMouseDown={stop}
    
    className={tool === "pencil" ? "is-active toolbar-button" : "toolbar-button"}
    onClick={() => setTool("pencil")}
  >
    Pen
  </button>
  

  <button
    onMouseDown={stop}
    className="toolbar-button"
    onClick={handleSave}
  >
    Save
  </button>

  <button
    onMouseDown={stop}
    className="toolbar-button"
    onClick={handleLoad}
  >
    Load
  </button>

  <button
    onMouseDown={stop}
    className="toolbar-button"
    onClick={ClearPage}
  >
    <FaTrashCan/>
  </button>

  <button onMouseDown={stop} className="toolbar-button" onClick={handleExportImage}>
  Export Drawing
  </button>

  <button onMouseDown={e => e.preventDefault()} onClick={exitDrawing}>
          Exit
        </button>
 

   
  </NodeViewWrapper>

);};

function CreateElement(id,x1,y1, x2, y2, type,strokeSize){

    switch(type){
      case "line":
        case "rectangle":
          const roughElement = type ==="line"
          ? generator.line(x1,y1,x2,y2,{strokeWidth: strokeSize})
          : generator.rectangle(x1,y1,x2-x1,y2-y1,{strokeWidth: strokeSize});
          return { id, x1, y1, x2, y2, type, roughElement, strokeWidth: strokeSize };
          case "pencil":
          return{id,type,points: [{ x: x1, y: y1 }], strokeWidth: strokeSize };
          default: 
            throw new Error(`Type not recognised:${type}`)
    }

}


const nearPoint = (x,y,x1,y1,name) =>{
  return Math.abs(x-x1) < 5 && Math.abs(y-y1) < 5 ? name: null;
}
//
const PositionWithinElement = (x,y,element) =>{
  const {type, x1 , x2 , y1, y2} = element;
  if (type === "rectangle"){
    const topLeft = nearPoint(x,y,x1,y1, "tl");
    const topRight = nearPoint(x,y,x2,y1, "tr");
    const bottomLeft = nearPoint(x,y,x1,y2, "bl");
    const bottomRight = nearPoint(x,y,x2,y2, "br");
    const inside =  x >= x1 && x <=x2 && y >= y1 && y <= y2 ? "inside" : null;
    return topLeft || topRight || bottomLeft || bottomRight || inside;
  }else{
    const a = {x:x1, y:y1};
    const b = {x:x2, y:y2};
    const c = {x,y};
    const offset = distance(a,b) - (distance(a,c) + distance(b,c));
    const start = nearPoint(x,y,x1,y1, "start");
    const end = nearPoint(x,y,x2,y2, "end");
    const inside = Math.abs(offset) < 1 ? "inside" : null;
    return start || end || inside;

  }
}

const distance = (a,b) => Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2));

const getElementAtPosition = (x,y,element)=>{
  return element
  .filter(el => !el.erased)
  .map(element => ({...element, position: PositionWithinElement(x,y,element)}))
  .find(element => element.position != null);

}


const adjustElementCoordinates = element => {
  const{type,x1,y1,x2,y2} = element;
  if (type === "rectangle"){
    const minX = Math.min(x1,x2);
    const maxX = Math.max(x1,x2);
    const minY = Math.min(y1,y2);
    const maxY = Math.max(y1,y2);
    return {x1:minX, y1:minY,x2:maxX, y2:maxY}
  }else{
    if (x1 < x2 || (x1 === x2 && y1 <y2)){
      return{x1,y1,x2,y2};
    }else{
      return{x1:x2,y1:y2,x2:x1,y2:y1}
    }
  }
};

const cursorForPosition = position => {
  switch(position){
    case "tl":
    case "br":
    case "start":
    case "end":
      return "nwse-resize";
    case "tr":
    case "bl":
      return "nesw-resize";
    default:
      return "move";
  }
};


const resizedCoordinates = (clientX, clientY, position, coordinates) =>{
const {x1,y1,x2,y2} = coordinates;
  switch(position){
    case "tl":
    case "start":
      return {x1:clientX, y1: clientY, x2, y2};
    case "tr":
      return {x1,y1:clientY, x2 : clientX, y2};
      case "bl":
        return {x1:clientX, y1, x2, y2:clientY};
      case "br":
      case "end":
        return {x1, y1, x2: clientX, y2 : clientY};
            default:
        return null;

  }
}

const useHistory = initialState => {
  const [index,setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action, overwrite = false) => {
    const newState = typeof action === "function" ? action(history[index]): action;
    if (overwrite){
      const historyCopy = [...history];
      historyCopy[index] = newState
      setHistory(historyCopy);
    }else{
      const updatedState = [...history].slice(0,index +1);
    setHistory([...updatedState, newState]);
    setIndex(prevState => prevState +1);
    }
  };
  

  const undo = () => index > 0 && setIndex(prevState => prevState -1);
  const redo = () => index < history.length -1 && setIndex(prevState => prevState +1);
  return [history[index], setState, undo, redo];

};

const drawElement = (roughCanvas, context, element,size) =>{
  switch(element.type){
      case "line":
      case "rectangle":
      roughCanvas.draw(element.roughElement)
        break;
        case "pencil":
          const rawStroke = getStroke(element.points);
          const stroke = getSvgPathFromStroke(rawStroke);
          context.fill(new Path2D(stroke))
          break;
        case "eraser":
          
        default: 
          throw new Error(`Type not recognised:${element.type}`)
          
}
}

const getSvgPathFromStroke = stroke => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};

function shouldErase(element, x, y, radius = 2) {
  if (element.type === "pencil") {
    // any stroke point within radius
    return element.points.some(p => 
      Math.hypot(p.x - x, p.y - y) < radius
    );
  }
  // for lines & rects, reuse PositionWithinElement:
  return PositionWithinElement(x, y, element) === "inside";
}

function eraseAt(elements, x, y, radius) {
  return elements.map(el =>
    shouldErase(el, x, y, radius)
      ? { ...el, erased: true }
      : el
  );
}



const adjustmentRequired = type => ['line', 'rectangle'].includes(type);



export default DrawingEditor;