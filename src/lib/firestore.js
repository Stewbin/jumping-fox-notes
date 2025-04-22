import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  limit,
  where,
} from "firebase/firestore";

const notesRootPromise = new Promise((resolve, reject) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      reject(new Error("No user logged in."));
      console.warn("No user logged in.");
    }
    const ref = collection(db, "users", user.uid, "notesRoot");
    resolve(ref);
    unsubscribe(); // stop listening after first resolution
  });
});

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
 * @param {Object} newNote { content: string, tags: string[], lastModified: string }
 */
export async function pushNote(cwd, id, newNote) {
  try {
    const notesRoot = await notesRootPromise;
    setDoc(doc(notesRoot, cwd, id), newNote, {
      merge: true,
    });
  } catch (error) {
    console.warn(error);
  }
}

export async function pullNote(cwd, id) {
  try {
    const notesRoot = await notesRootPromise;
    return getDoc(doc(notesRoot, cwd, id));
  } catch (error) {
    console.warn(error);
    return null;
  }
}

export async function pullNotes(path) {
  try {
    const notesRoot = await notesRootPromise;
    const notes = query(
      collection(notesRoot, path),
      where("type", "==", "Note")
    );
    return getDocs(notes).then((snapshot) =>
      snapshot.docs.map((doc) => doc.data)
    );
  } catch (error) {
    console.warn(error);
    return [];
  }
}

export async function pullNotebooks(path) {
  try {
    const notesRoot = await notesRootPromise;
    const notebookDetails = query(
      collection(notesRoot, path),
      where("type", "==", "Notebook"),
      limit(1)
    );
    return getDocs(notebookDetails).then((snapshot) =>
      snapshot.docs.map((doc) => doc.data)
    );
  } catch (error) {
    console.warn(error);
    return [];
  }
}

/**
 * Modify the corresponding Notebook-Details document of a notebook.
 * If no document exists, one will be created.
 * @param {string} cwd (must end in a collection)
 * @param {string} name Name of Notebook
 * @param {*} newDetails `{type: 'notebook', name: string, tags: Id[]}`
 */
export async function pushNotebook(cwd, name, newNotebook) {
  try {
    const notesRoot = await notesRootPromise;
    setDoc(doc(notesRoot, cwd, name), newNotebook, { merge: true });
  } catch (error) {
    console.warn(error);
  }
}

// export async function setNotebookDetails(cwd, name, newDetails) {
//   const notebookDetails = query(
//     collection(notesRoot, cwd, name),
//     // where("name", "==", name),
//     where("type", "==", "Notebook"),
//     limit(1)
//   );
//   const detailsRef = await getDocs(notebookDetails)
//     .then((snapshot) => snapshot.docs)
//     .then((docs) => (docs.empty ? doc(notesRoot, cwd) : docs[0].ref))
//     .catch((error) => console.error(error));

//   setDoc(detailsRef, newDetails);
// }

/**
 * Returns array of all documents in the Notebook `/cwd/name`
 * @param {string} cwd Current working directory
 * @param {string} name _Name_ of Notebook
 * @returns
 */
// export async function getNotebookContents(cwd, name) {
//   if (!user) {
//     alert("No user logged in.");
//     return null;
//   }
//   // Get notebook id from dupe file
//   const notebookDetails = query(
//     collection(notesRoot, cwd),
//     where("name", "==", name),
//     where("type", "==", "Notebook"),
//     limit(1)
//   );
//   try {
//     const notebookIds = (await getDocs(notebookDetails)).docs.map(
//       (doc) => doc.id
//     );
//     if (!notebookIds) {
//       return [];
//     }
//     // Query collection `notebookId`
//     return getDocs(collection(notesRoot, cwd, notebookIds[0])).then(
//       (querySnapShot) => querySnapShot.docs.map((doc) => doc.data)
//     );
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }
