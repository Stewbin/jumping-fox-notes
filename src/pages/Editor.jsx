import React, { useState,useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import { Bold } from '@tiptap/extension-bold';
import { Italic } from '@tiptap/extension-italic';
import { Strike } from '@tiptap/extension-strike';
import TextStyle from '@tiptap/extension-text-style';
import BulletList from '@tiptap/extension-bullet-list';
import { MdFormatListBulleted } from "react-icons/md";
import { FontFamily } from '@tiptap/extension-font-family';
import Image from '@tiptap/extension-image';
import { Tab,Tabs, TabList, TabPanel } from 'react-tabs';
import { Link,useParams,useNavigate } from 'react-router-dom';
import { FaCircleStop, FaMicrophone, FaImage, FaCompressArrowsAlt, FaExpandArrowsAlt } from 'react-icons/fa6'
import 'react-tabs/style/react-tabs.css'; // Import default styling
// for dark mode
import '@sinm/react-chrome-tabs/css/chrome-tabs-dark-theme.css';

import "../styles/Editor.css";

// Handle resizable images
const ResizableImage = Image.extend({
 addAttributes() {
   return {
     ...Image.config.addAttributes(),
     width: {
       default: 'auto',
       parseHTML: element => element.getAttribute('width') || 'auto',
       renderHTML: attributes => {
         if (!attributes.width) {
           return {};
         }
         return { width: attributes.width };
       },
     },
     height: {
       default: 'auto',
       parseHTML: element => element.getAttribute('height') || 'auto',
       renderHTML: attributes => {
         if (!attributes.height) {
           return {};
         }
         return { height: attributes.height };
       },
     },
     dataId: {
       default: null,
       parseHTML: element => element.getAttribute('data-id'),
       renderHTML: attributes => {
         if (!attributes.dataId) {
           return {};
         }
         return { 'data-id': attributes.dataId };
       },
     },
   };
 },
});

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tags, setTags] = useState([])
  const [allNotes, setAllNotes] = useState([]);

  const [darkMode, setDarkMode] = useState(false);
  const [note, setNote] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageWidth, setImageWidth] = useState(300); // Default width
  const [imageHeight, setImageHeight] = useState(200); // Default height
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [selectedImageId, setSelectedImageId] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef(null);
  const imageIdCounter = useRef(0);

  const [openTabs, setOpenTabs] = useState([
    { id: "home", name: "Home", type: "home" }
  ]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);


const toggleDarkMode = () => {
  setDarkMode(prev => !prev);
};


  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Color,
      ResizableImage.configure({
        inline: true,
        allowBase64: true,
      }),
      BulletList,
      Underline,
      TextStyle,
      Italic,
      Strike,
      FontFamily.configure({
        types: ['textStyle'],
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      // Called whenever the editor's content changes
      const editorElement = document.querySelector('.ProseMirror');
      if (editorElement) {
        // Add click handlers to all images
        editorElement.querySelectorAll('img').forEach(img => {
          if (!img.getAttribute('data-has-listeners')) {
            img.setAttribute('data-has-listeners', 'true');
           
            // Double-click to open resize modal
            img.addEventListener('dblclick', (e) => {
              e.preventDefault();
              e.stopPropagation();
             
              const imgId = img.getAttribute('data-id');
              if (imgId) {
                setSelectedImageId(imgId);
                setSelectedImage(img.src);
                setImageWidth(parseInt(img.style.width) || parseInt(img.width) || 300);
                setImageHeight(parseInt(img.style.height) || parseInt(img.height) || 200);
                setShowImageModal(true);
                setIsResizing(true);
              }
            });
           
            // Add resize handles through CSS
            img.classList.add('resizable-image');
          }
        });
      }
    },
  });
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudios, setRecordedAudios] = useState([]);
    const [seconds, setSeconds] = useState(0)

    const mediaStream = useRef(null)
    const mediaRecorder = useRef(null)
    const chunks = useRef([])
    const handleDeleteAudio = (indexToDelete) => {
      setRecordedAudios(prev => prev.filter((_, i) => i !== indexToDelete));
    };
    const openNewTab = (noteOrType) => {
      if (noteOrType === "home") {
        if (!openTabs.some(tab => tab.id === "home")) {
          const newTabs = [...openTabs, { id: "home", title: "Home", type: "home" }];
          setOpenTabs(newTabs);
          setCurrentTabIndex(newTabs.length - 1);
        } else {
          const index = openTabs.findIndex(tab => tab.id === "home");
          setCurrentTabIndex(index);
        }
        navigate("/home");
        return;
      }
    
      const alreadyOpenIndex = openTabs.findIndex(tab => tab.id === noteOrType.id);
      if (alreadyOpenIndex !== -1) {
        setCurrentTabIndex(alreadyOpenIndex);
        navigate(`/Editor/${noteOrType.id}`);
      } else {
        const newTabs = [...openTabs, { ...noteOrType, type: "note" }];
        setOpenTabs(newTabs);
        setCurrentTabIndex(newTabs.length - 1);
        navigate(`/Editor/${noteOrType.id}`);
      }
    };

    // Handle file selection
    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.includes('image/')) {
        alert('Please select an image file');
        return;
      }

      // Save the file reference
      setSelectedImageFile(file);

      // Read the file as data URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setShowImageModal(true);
        setIsResizing(false);
      };
      reader.readAsDataURL(file);
    };

    // Function to insert image with custom size
    const insertImage = async () => {
      if (!selectedImage || !editor) return;
     
      try {
        let imageUrl = selectedImage;
       
        let styleAttr = { style: 'display: block; margin: 0 auto;' };
       
        if (isResizing && selectedImageId) {
         
          const editorElement = document.querySelector('.ProseMirror');
          const imgElement = editorElement.querySelector(`img[data-id="${selectedImageId}"]`);
         
          if (imgElement) {
            // Update through the editor's commands
            const pos = editor.view.posAtDOM(imgElement, 0);
           
            editor.chain().focus().setNodeSelection(pos).run();
            editor.chain().focus().updateAttributes('image', {
              width: `${imageWidth}px`,
              height: `${imageHeight}px`,
              ...styleAttr
            }).run();
          }
        } else {
          // Generate a unique ID for the image
          const imgId = `img-${Date.now()}-${imageIdCounter.current++}`;
         
          // Insert new image
          editor.chain().focus().setImage({
            src: imageUrl,
            width: `${imageWidth}px`,
            height: `${imageHeight}px`,
            dataId: imgId,
            ...styleAttr
          }).run();
        }
       
        // Reset after insertion
        setSelectedImage(null);
        setSelectedImageFile(null);
        setShowImageModal(false);
        setIsResizing(false);
        setSelectedImageId(null);
       
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error("Error inserting image:", error);
        alert("Failed to insert image. Please try again.");
      }
    };

    const handleImageButtonClick = () => {
      fileInputRef.current.click();
    };

    // Helper function to find and resize an image
    const resizeExistingImage = (imgId, width, height) => {
      if (!editor) return;
     
      // Find the image with the given ID
      const imageNode = document.querySelector(`.ProseMirror img[data-id="${imgId}"]`);
     
      if (imageNode) {
        imageNode.style.width = `${width}px`;
        imageNode.style.height = `${height}px`;
      }
    };

    const startRecording = async() => {
        setIsRecording(true)
        try{
            setSeconds(0)
            const stream = await navigator.mediaDevices.getUserMedia({audio: true})
            mediaStream.current = stream
            mediaRecorder.current = new MediaRecorder(stream)
            mediaRecorder.current.ondataavailable = (e) => {
                if (e.data.size > 0){
                    chunks.current.push(e.data)
                }
            }
            const timer = setInterval(() => {
                setSeconds(prev => prev + 1)
            }, 1000)

            mediaRecorder.current.onstop = () => {
              const recordedBlob = new Blob(chunks.current, { type: 'audio/mp3' });
  
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64Audio = reader.result;
                setRecordedAudios(prev => [...prev, base64Audio]);
              };
              reader.readAsDataURL(recordedBlob); // converts to base64
            
              chunks.current = [];
              clearTimeout(timer);
            };

            mediaRecorder.current.start()

        }catch(error){
            console.log(error);
        }
    }

    const stopRecording = () => {
        setIsRecording(false)
        if(mediaRecorder.current){
            mediaRecorder.current.stop()
            mediaStream.current.getTracks().forEach(track => track.stop())
        }
    }
  const handleDeleteNote = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;
  
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes = savedNotes.filter((n) => String(n.id) !== String(id));
  
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    navigate("/home");
  };
  const dropdownRef = useRef(null);

  const [isFileMenuOpen, setFileMenuOpen] = useState(false);
  
  const toggleFileMenu = () => {
    setFileMenuOpen(prev => !prev);
  };
  const[isOpenMenuOpen, setOpenMenuOpen] = useState(false);
  const toggleOpenMenu = ()=>{
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    setAllNotes(savedNotes);
    setOpenMenuOpen(prev => !prev);
  }

  // Adding menu for image resizing
  useEffect(() => {
    const handleContextMenu = (e) => {
      // Check if clicked element is an image
      if (e.target.tagName === 'IMG' && e.target.closest('.ProseMirror')) {
        e.preventDefault(); // Prevent default context menu
       
        // Get image details
        const imgId = e.target.getAttribute('data-id');
        if (imgId) {
          setSelectedImageId(imgId);
          setSelectedImage(e.target.src);
          setImageWidth(parseInt(e.target.style.width) || parseInt(e.target.width) || 300);
          setImageHeight(parseInt(e.target.style.height) || parseInt(e.target.height) || 200);
          setShowImageModal(true);
          setIsResizing(true);
        }
      }
    };
   
    document.addEventListener('contextmenu', handleContextMenu);
   
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [editor]);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const currentNote = savedNotes.find((n) => String(n.id) === String(id));
    setRecordedAudios(currentNote.audios || []);
  
    if (!currentNote) {
      alert("Note not found");
      navigate("/home");
      return;
    }
  
    setNote(currentNote);
    setOpenTabs((prevTabs) => {
      const alreadyOpen = prevTabs.some((tab) => tab.id === currentNote.id);
      if (!alreadyOpen) {
        return [...prevTabs, currentNote];
      }
      return prevTabs;
    });
    // Set active tab
  const tabIndex = openTabs.findIndex((tab) => tab.id === currentNote.id);
  setCurrentTabIndex(tabIndex === -1 ? openTabs.length : tabIndex);
    if (editor) {
      editor.commands.setContent(currentNote.content || "");
    }
  }, [id, editor, navigate]);
  
  useEffect(() => {
    if (!editor || !note) return;
  
    const updateContent = () => {
      const updatedContent = editor.getHTML();
      const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    
      const updatedNotes = savedNotes.map((n) =>
        String(n.id) === String(id)
          ? {
              ...n,
              content: updatedContent,
              lastModified: new Date().toISOString(),
              audios: recordedAudios, 
            }
          : n
      );
    
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    };
  
    editor.on("update", updateContent);
    return () => editor.off("update", updateContent);
  }, [editor, note, id, recordedAudios]);

  const handleNewNote = () => {
    const name = prompt("Enter note name:");
    if (!name) return;
    const newId = Date.now().toString() 
  const newNote = {
    id: newId,
    name ,
    content: "",
    lastModified: new Date().toISOString(),
    tags: [],
    audios: []
  };

  const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
  savedNotes.push(newNote);
  localStorage.setItem("notes", JSON.stringify(savedNotes));

  openNewTab(newNote); // new tab
}
  
  
  const handleManualSave = () => {
    if (!editor || !note) return;
  
    const updatedContent = editor.getHTML();
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
  
    const updatedNotes = savedNotes.map((n) =>
      String(n.id) === String(note.id)
        ? {
            ...n,
            content: updatedContent,
            lastModified: new Date().toISOString(),
            audios: recordedAudios,
          }
        : n
    );
  
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    alert("Note saved!");
  };
  

  // Handle click outside for file dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    
  }, []
  
);
  // Toolbar button handlers
  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  const toggleUnderline = () => {
    editor?.chain().focus().toggleUnderline().run();
  };

  const toggleStrike = () => {
    editor?.chain().focus().toggleStrike().run();
  };

  if (!editor) {
    return null
  }
  const fonts = ['Arial', 'Georgia', 'Courier New', 'Times New Roman'];

  return (
<div className={`editor-container ${darkMode ? 'dark-mode' : ''}`}> 
      {/* Top Navigation Bar */}
      
      <nav className="top-bar">
        <button classname="home-btn">
        <Link to="/home" className="nav-link">Home</Link>
        </button>
     
  <div className="dropdown"ref={dropdownRef}>
    <button className="dropbtn" onClick={toggleFileMenu}>File</button>
    {isFileMenuOpen && (
  <div className="dropdown-content">
     <button> n/a</button>
    <button onClick={handleNewNote}>New</button>
    <button onClick={toggleOpenMenu}>Open</button>
    {isOpenMenuOpen && (
  <div className="open-dropdown">
    {allNotes.length === 0 ? (
      <div className="note-item">No saved notes</div>
    ) : (
      allNotes.map(note => (
        <div
          key={note.id}
          className="note-item"
          onClick={() => {
            openNewTab(note);
            setOpenMenuOpen(false);
            setFileMenuOpen(false);
          }}
        >
          {note.name}
        </div>
      ))
    )}
  </div>
)}
    <button onClick={handleManualSave}>Save</button>
    <button onClick={handleDeleteNote}>Delete</button>
  </div>
)}
  </div>
  <div className="dropdown">
    <button className="dropbtn">Edit</button>
  </div>
  <button onClick={toggleDarkMode}>
  {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
</button>
</nav>
      <div className="toolbar">
      <input
            type="color"
            onInput={event => editor.chain().focus().setColor(event.target.value).run()}
            value={editor.getAttributes('textStyle').color}
            data-testid="setColor"
          />
        <button onClick={toggleBold} className="toolbar-button">
        B
        </button>
        <button onClick={toggleItalic} className="toolbar-button">
          I
        </button>
        <button onClick={toggleUnderline} className="toolbar-button">
          U
        </button>
        <button onClick={toggleStrike} className="toolbar-button">
          S
        </button>
        <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
          >
            <MdFormatListBulleted />
          </button>
          <select
          type="font"
      onChange={(event) => editor.chain().focus().setFontFamily(event.target.value).run()}
    >
      {fonts.map((font) => (
        <option key={font} value={font}>
          {font}
        </option>
      ))}
    </select>

    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      accept="image/*"
      style={{ display: 'none' }}
    />
   
    <button onClick={handleImageButtonClick} className="toolbar-button" title="Upload Image">
      <FaImage/>
    </button>

    {isRecording ? <button onClick={stopRecording} >
            <FaCircleStop />
        </button> : 
            <button onClick={startRecording} >
                <FaMicrophone />
            </button>
        }
      </div>

      {showImageModal && (
        <div className="image-modal-overlay">
          <div className="image-modal">
            <h3>{isResizing ? 'Resize Image' : 'Upload & Adjust Image'}</h3>
            <div className="image-preview">
              <img
                src={selectedImage}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  width: `${imageWidth}px`,
                  height: `${imageHeight}px`
                }}
              />
            </div>
            <div className="image-controls">
              <div className="size-control">
                <label>Width:</label>
                <input
                  type="number"
                  value={imageWidth}
                  onChange={(e) => setImageWidth(Number(e.target.value))}
                  min="50"
                  max="1000"
                />
                <span>px</span>
              </div>
              <div className="size-control">
                <label>Height:</label>
                <input
                  type="number"
                  value={imageHeight}
                  onChange={(e) => setImageHeight(Number(e.target.value))}
                  min="50"
                  max="1000"
                />
                <span>px</span>
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={() => {
                setShowImageModal(false);
                setIsResizing(false);
                setSelectedImageId(null);
                setSelectedImage(null);
              }}>Cancel</button>
              <button
                onClick={insertImage}
                className="btn-primary"
              >
                {isResizing ? 'Apply Changes' : 'Insert Image'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Tabs className="note-tabs"selectedIndex={currentTabIndex} onSelect={index => {
  setCurrentTabIndex(index);
  const tab = openTabs[index];
  if (tab.type === "home") {
    navigate("/home");
  } else {
    navigate(`/editor/${tab.id}`);
  }
}}>
  <TabList className="note-tabs">
    {openTabs.map((tab, index) => (
      <Tab key={tab.id}>
        {tab.name}
        
      </Tab>
    ))}
  </TabList>
</Tabs>
      <div className="editor-content">
      <EditorContent editor={editor} />
      <div className="audio-stack">
      {recordedAudios.map((audioData, index) => (
  <div key={index} >
    <audio controls src={audioData}></audio>
    <button onClick={() => handleDeleteAudio(index)}>Delete</button>
  </div>
))}
</div>
    </div>
 
    </div>
  );
};

export default Editor;