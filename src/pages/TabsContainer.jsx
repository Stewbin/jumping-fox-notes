import React, { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
// import { useNavigate } from "react-router-dom";
import Home from "./Home";
import MainEditor from "./Editor";
import "react-tabs/style/react-tabs.css";
import "../styles/TabsContainer.css";

export function TabsContainer() {
  const [tabs, setTabs] = useState([
    {
      id: "home",
      title: "Home",
      type: "home",
      noteId: "",
    },
  ]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0); // Selected tab's index
  // Dark Mode
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const addTab = () => openNewTab("", "home");
  const openNewTab = (noteId, type) => {
    setTabs([
      ...tabs.map((tab) => {
        return tab;
      }),
      {
        id: Date.now(),
        title: `Home`,
        type,
        noteId,
      },
    ]);
    setCurrentTabIndex(tabs.length); // Set current tab to right most
  };
  const closeTab = (tabId) => {
    setTabs(tabs.filter((tab) => tab.id !== tabId));
    setCurrentTabIndex(currentTabIndex === 0 ? 0 : currentTabIndex - 1);
  };

  /* Tab Content Changing */
  const openNote = (tabIdx, noteId) => {
    setTabs(
      tabs.map((tab, i) => {
        if (i === tabIdx) {
          tab.noteId = noteId;
          tab.type = "editor";
        }
        return tab;
      })
    );
  };
  const backToHome = (tabIdx) => {
    tabs[tabIdx].type = "home";
  };

  return (
    <>
      <Tabs
        className="overflow-hidden vh-100"
        selectedIndex={currentTabIndex}
        onSelect={(index) => setCurrentTabIndex(index)}
      >
        <TabList>
          {tabs.map((tab) => (
            <Tab key={tab.id}>
              {tab.title}
              <button className="btn" onClick={() => closeTab(tab.id)}>
                x
              </button>
            </Tab>
          ))}
          <button className="btn border-0" onClick={addTab}>
            +
          </button>
          <button onClick={toggleDarkMode}>
            {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </TabList>

        {/* Tab Contents */}
        <div className="position-relative overflow-scroll h-100">
          {tabs.map((tab, i) => (
            <TabPanel key={tab.id}>
              {tab.type === "home" && (
                <Home
                  onOpenNote={(nid) => openNote(i, nid)}
                  darkMode={darkMode}
                />
              )}
              {tab.type === "editor" && (
                <MainEditor
                  navigateToHome={() => backToHome(tab.id)}
                  id={tab.noteId}
                  darkMode={darkMode}
                  openNewNote={(noteId) => openNewTab(noteId, "editor")}
                />
              )}
            </TabPanel>
          ))}
        </div>
      </Tabs>
    </>
  );
}
