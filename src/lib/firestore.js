import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";

const notesRootPromise = new Promise((resolve, reject) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      // reject(new Error("No user logged in."));
      console.warn("No user logged in.");
      return;
    }
    const ref = collection(db, "users", user.uid, "notesRoot");
    resolve(ref);
    unsubscribe(); // stop listening after first resolution
  });
});

/**
 * Writes to the document at `notesRoot/id`. If no document exists, one will be created.
 *
 * If `id` is an empty string, then an ID will be auto-generated.
 * @param {string} id ID of Note
 * @param {Object} newNote `{ name: string, content: string, tags: string[], timestamp: Date }`
 * @returns {string} The (possibly auto-generated) id of the pushed document
 */
export async function pushNote(newNote, id) {
  try {
    const notesRoot = await notesRootPromise;
    const noteRef = id ? doc(notesRoot, id) : doc(notesRoot);
    setDoc(noteRef, newNote, {
      merge: true,
    });
    return noteRef.id;
  } catch (error) {
    console.warn(error);
    return "";
  }
}

/**
 * Returns the note `id` if it exists in the User's collection.
 * Else, it returns `null`.
 * @param {string} id ID of Note (Equivalent to name)
 * @returns Promise<DocumentSnapshot | null>
 */
export async function pullNote(id) {
  try {
    const notesRoot = await notesRootPromise;
    return getDoc(doc(notesRoot, id));
  } catch (error) {
    console.warn(error);
    return null;
  }
}

/**
 * Retrieves an array of all Notes the User has. The array may be empty.
 * @returns Promise<QueryDocumentSnapshot[]>
 */
async function pullNotes() {
  try {
    const notesRoot = await notesRootPromise;
    return getDocs(notesRoot).then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(data);
      return data;
    });
  } catch (error) {
    console.warn(error);
    return [];
  }
}

async function pullNotebooks(path) {
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
async function pushNotebook(cwd, name, newNotebook) {
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
