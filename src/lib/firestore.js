import { limit, where } from "firebase/firestore";
import { db, auth } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
} from "firebase/firestore/lite";

const user = auth.currentUser;
const notesRoot = collection(db, "users", user.uid, "notesRoot");

/* Tentative Note 'Schema' */
/* 
{ 
  id: string // Equivalent to name
  type: 'Notebook' | 'Note'
  content: JSON or String
  tags: string[]
}
*/

/* Tentative Notebook 'Schema' */
/*
{
  id: string // Must match actual subcollection id
  type: 'Notebook' | 'Note'
  tags: string[]
}
*/

/**
 * Writes to the document at `/cwd/id`. If no document exists, one will be created.
 * @param {string} cwd Current working directory (must end in a document)
 * @param {string} id ID of Note
 * @param {Object} newNote Map of fields & data to be written
 */
export async function setNote(cwd, id, newNote) {
  setDoc(doc(notesRoot, cwd, id), newNote, {
    merge: true,
  });
}

export async function getNote(cwd, id) {
  if (user) {
    return getDoc(doc(notesRoot, cwd, id));
  } else {
    alert("No user logged in.");
    return null;
  }
}

/**
 * Modify the corresponding Notebook-Details document of a notebook.
 * If no document exists, one will be created.
 * @param {string} cwd (must end in a collection)
 * @param {string} name Name of Notebook
 * @param {*} newDetails `{type: 'notebook', name: string, tags: Id[]}`
 */
async function setNotebookDetails(cwd, name, newDetails) {
  const notebookDetails = query(
    collection(notesRoot, cwd),
    where("name", "==", name),
    where("type", "==", "Notebook"),
    limit(1)
  );
  const detailsRef = await getDocs(notebookDetails)
    .then((snapshot) => snapshot.docs)
    .then((docs) => (docs.empty ? doc(notesRoot, cwd) : docs[0].ref))
    .catch((error) => console.error(error));

  setDoc(detailsRef, newDetails);
}

/**
 * Returns array of all documents in the Notebook `/cwd/name`
 * @param {string} cwd Current working directory
 * @param {string} name _Name_ of Notebook
 * @returns
 */
export async function getNotebookContents(cwd, name) {
  if (!user) {
    alert("No user logged in.");
    return null;
  }
  // Get notebook id from dupe file
  // const notebookDetails = query(
  //   collection(notesRoot, cwd),
  //   where("name", "==", name),
  //   where("type", "==", "Notebook"),
  //   limit(1)
  // );
  try {
    // const notebookIds = (await getDocs(notebookDetails)).docs.map(
    //   (doc) => doc.id
    // );
    // if (!notebookIds) {
    //   return [];
    // }
    // // Query collection `notebookId`
    // return getDocs(collection(notesRoot, cwd, notebookIds[0])).then(
    //   (querySnapShot) => querySnapShot.docs.map((doc) => doc.data)
    // );
    return getDocs(collection(notesRoot, cwd, name));
  } catch (error) {
    console.error(error);
    return [];
  }
}
