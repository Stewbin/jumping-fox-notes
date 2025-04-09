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
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Import default styling

import "../styles/Editor.css";

const Editor = () => {
  const [darkMode, setDarkMode] = useState(false);

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
    content: '<p>content goes here</p>'
  });
 

  const [isFileMenuOpen, setFileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleFileMenu = () => {
    setFileMenuOpen(prev => !prev);
  };

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
  <div className="dropdown"ref={dropdownRef}>
    <button className="dropbtn" onClick={toggleFileMenu}>File</button>
    {isFileMenuOpen && (
      <div className="dropdown-content">
        <table>
          <tbody>
            <tr><td><button>New</button></td></tr>
            <tr><td><button>Open</button></td></tr>
            <tr><td><button>Save</button></td></tr>
            <tr><td><button>Export</button></td></tr>
          </tbody>
        </table>
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
      </div>
      <div className="editor-content">
      <EditorContent editor={editor} />
    </div>
    </div>
  );
};

export default Editor;
