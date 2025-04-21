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
import { FaCircleStop, FaMicrophone } from 'react-icons/fa6'
import 'react-tabs/style/react-tabs.css'; // Import default styling
// for dark mode
import '@sinm/react-chrome-tabs/css/chrome-tabs-dark-theme.css';

import "../styles/Editor.css";

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tags, setTags] = useState([])
  const [allNotes, setAllNotes] = useState([]);

  const [darkMode, setDarkMode] = useState(false);
  const [note, setNote] = useState(null);

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
      Image,
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
  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

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
    <button onClick={addImage}>Set image</button>
    {isRecording ? <button onClick={stopRecording} >
            <FaCircleStop />
        </button> : 
            <button onClick={startRecording} >
                <FaMicrophone />
            </button>
        }
      </div>
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