import React, { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
// import { useNavigate } from "react-router-dom";
import Home from "./Home";
import MainEditor from "./Editor";
import "react-tabs/style/react-tabs.css";
import "../styles/TabsContainer.css";

export default function TabsContainer() {
  const [tabs, setTabs] = useState([
    {
      id: Date.now(),
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

  const addHomeTab = () => openNewTab("", "Home", "home");
  const openNewTab = (noteId, title, type) => {
    setTabs([
      ...tabs.map((tab) => {
        return tab;
      }),
      {
        id: Date.now(),
        title,
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
  const openNote = (tabIdx, id, name) => {
    // Replace `tabs` with whole new array to trigger hook
    setTabs(
      tabs.map((tab, i) => {
        if (i === tabIdx) {
          tab.noteId = id;
          tab.type = "editor";
          tab.title = name;
        }
        return tab;
      })
    );
  };
  const backToHome = (tabId) => {
    console.log(`deleting tab ${tabId}`);

    setTabs(
      tabs.map((tab) => {
        if (tab.id === tabId) {
          tab.type = "home";
          tab.title = "Home";
          tab.noteId = "";
        }
        return tab;
      })
    );
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
          <button className="btn border-0" onClick={addHomeTab}>
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
                  onOpenNote={(nid, name) => openNote(i, nid, name)}
                  darkMode={darkMode}
                />
              )}
              {tab.type === "editor" && (
                <MainEditor
                  navigateToHome={() => backToHome(tab.id)}
                  id={tab.noteId}
                  darkMode={darkMode}
                  openNewNote={(noteId, title) =>
                    openNewTab(noteId, title, "editor")
                  }
                />
              )}
            </TabPanel>
          ))}
        </div>
      </Tabs>
    </>
  );
}
