import React, { useEffect, useRef, useState } from "react";
import { firestore, storage } from "./Firebase";
import {Spin } from "antd";
import {
  collection,
  getDoc,
  updateDoc,
  addDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { uploadBytesResumable } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { auth } from "./Firebase.js";
import { Modal, Button, Progress } from "antd";
import { onAuthStateChanged } from "firebase/auth";
import JoditEditor from "jodit-react";
import "jodit/es2021/jodit.min.css";
import { MdRemoveRedEye } from "react-icons/md";
import { FaEyeSlash } from "react-icons/fa";
import "./Load.css";

export default function TextEditor() {
  const { docId, sectionId } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);
  const [showPreview, setShowPreview] = useState(false); // State for preview toggle
  const [editorHtml, setEditorHtml] = useState("");
  const [videoUrl, setVideoUrl] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [isediting, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contentId, setContentId] = useState("");
  const [modalState, setModalState] = useState({ Title: "", SubTitle: "" });
  const [pictureFile, setPictureFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploadTask, setUploadTask] = useState(null); // Track the upload task
  const [progress, setProgress] = useState(0); // Track upload progress
  const [isUploading, setIsUploading] = useState(false); // Show dialog while uploading

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName);
        setEmail(user.email);
      }
    });

    const fetchCardData = async () => {
      try {
        if (docId) {
          const articleRef = collection(firestore, "Articles");
          const docSnapshot = await getDoc(doc(articleRef, docId));
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            console.log("Document data:", data);
            setContentId(data.sectionId);
            setEditorHtml(data.htmlContent);
            setVideoUrl(data.videoUrl);
            setModalState({
              Title: data.title || "",
              SubTitle: data.subTitle || "",
              pictureUrl: data.pictureUrl || "",
            });
            setPictureFile(data.pictureUrl);
            setIsEditing(true);
          }
        } else if (sectionId) {
          console.log("Section ID:", sectionId);
          setContentId(sectionId);
          setEditorHtml("");
          setImageUrl("");
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };
    fetchCardData();
  }, [docId, sectionId]);

  const imageUpload = async () => {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "image/*";
    inputElement.click();
    inputElement.onchange = async () => {
      const file = inputElement.files[0];
      const storageReference = ref(storage, "images/" + file.name);
      await uploadBytes(storageReference, file);
      const image = await getDownloadURL(storageReference);
      console.log(image);
      setImageUrl(image);
      setEditorHtml(
        (prev) =>
          prev +
          `<div className="w-full"><img src="${image}" alt="${file.name}" class=" rounded-md object-contain  " /></div><br/>`
      );
    };
  };

  const videoUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const storageReference = ref(storage, "videos/" + file.name);
        const uploadTaskInstance = uploadBytesResumable(storageReference, file);
        setUploadTask(uploadTaskInstance); // Store the task for canceling
        setIsUploading(true); // Show dialog

        uploadTaskInstance.on(
          "state_changed",
          (snapshot) => {
            // Update progress
            const progressValue =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(Math.round(progressValue));
          },
          (error) => {
            // Handle errors
            console.error("Error uploading video:", error);
            message.error("Failed to upload video.");
            setIsUploading(false);
          },
          async () => {
            // Handle successful upload
            const video = await getDownloadURL(uploadTaskInstance.snapshot.ref);
            setVideoUrl((prevVideoUrls) => [...prevVideoUrls, video]);
            setEditorHtml(
              (prev) =>
                prev +
                `<div className="video-container h-full">
                  <video src="${video}" controls alt="${file.name}" class="rounded-md h-full w-full"> </video>
                 </div><br />`
            );
            message.success("Video uploaded successfully!");
            setIsUploading(false); // Hide dialog
          }
        );
      }
    };
  };

  const cancelUpload = () => {
    if (uploadTask) {
      uploadTask.cancel(); // Cancel the upload
      setIsUploading(false); // Hide dialog
      message.info("Video upload canceled.");
    }
  };

  const pictureHandler = async (e) => {
    const picture = e.target.files[0];
    const reference = ref(storage, `images/${picture.name}`);
    await uploadBytes(reference, picture);
    const url = await getDownloadURL(reference);
    setPictureFile(url);
    setModalState({ ...modalState, pictureUrl: pictureFile });
  };

  const handleCreateOrUpdate = async () => {
    if (!editorHtml) return;
    setIsLoading(true); // Start the loading spinner
    const documentData = {
      htmlContent: editorHtml,
      sectionId: contentId,
      videoUrl: videoUrl,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      title: modalState.Title,
      subTitle: modalState.SubTitle,
      pictureUrl: pictureFile || modalState.pictureUrl,
    };
    try {
      if (isediting) {
        await updateDoc(doc(firestore, "Articles", docId), documentData);
        message.success("Content updated successfully!");
        navigate("/");
      } else {
        const ref = await addDoc(collection(firestore, "Articles"), documentData);
        await updateDoc(ref, { id: ref.id });
        message.success("Content uploaded successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error adding/updating document:", error);
      message.error("Failed to upload content.");
    } finally {
      setIsLoading(false); // Stop the loading spinner
    }
  };

  const editorConfiguration = {
    readonly: true,
    height: 700,
    toolbar: false,
    style: {
      backgroundColor: "#1f1838",
      color: "#ffffff",
    },
  };

  const editorConfig = {
    readonly: false,
    height: 700,
    style: {
      backgroundColor: "#1f1838",
      color: "#ffffff",
    },
    toolbarAdaptive: false,
    buttons: [
      "source",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "ul",
      "ol",
      "outdent",
      "indent",
      "font",
      "fontsize",
      "paragraph",
      "link",
      "align",
      "undo",
      "redo",
      "copyformat",
      "hr",
      "eraser",
      "table",
      "print",
      "preview",
      "brush",
      {
        name: "customImage",
        iconURL: "https://img.icons8.com/material-outlined/24/000000/image.png",
        exec: () => imageUpload(),
      },
      {
        name: "customVideo",
        iconURL: "https://img.icons8.com/material-outlined/24/000000/video.png",
        exec: () => videoUpload(),
      },
    ],
    toolbarButtonSize: "middle",
    controls: {
      paragraph: {
        list: [
          { value: "p", text: "Normal" },
          { value: "h1", text: "Heading 1" },
          { value: "h2", text: "Heading 2" },
          { value: "h3", text: "Heading 3" },
          { value: "h4", text: "Heading 4" },
          { value: "h5", text: "Heading 5" },
          { value: "h6", text: "Heading 6" },
        ],
      },
      fontsize: {
        list: ["8", "10", "12", "14", "16", "18", "24", "30", "36", "48", "60"],
      },
    },
    events: {
      paste: (event) => {
        event.preventDefault();
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedContent =
          clipboardData.getData("text/html") || clipboardData.getData("text/plain");
        if (pastedContent) {
          setEditorHtml((prev) => prev + pastedContent); // Merge pasted content into editor
        }
      },
    },
  };
  

  return (
    <>
      <div className="flex flex-col mr-10 mt-4 mb-16 rounded-lg ">
        <div className="flex">
          <div className="px-1 rounded-lg shadow-lg flex-grow-1 h-screen overflow-y-auto">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Headline for your Title & Subtitle
              </h2>
              <div>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="text-2xl text-white"
                >
                  {isCollapsed ? <FaCaretUp /> : <FaCaretDown />}
                </button>
              </div>
            </div>
            {!isCollapsed && (
              <div>
                <label className="text-white">Title:</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={modalState.Title}
                  onChange={(e) =>
                    setModalState({ ...modalState, Title: e.target.value })
                  }
                  className="w-full text-white mb-4 p-3 bg-[#1f1838] rounded-lg outline outline-2 outline-[#352f4c]"
                />
                <label className="text-white">Subtitle: </label>
                <input
                  type="text"
                  placeholder="Subtitle"
                  value={modalState.SubTitle}
                  onChange={(e) =>
                    setModalState({ ...modalState, SubTitle: e.target.value })
                  }
                  className="w-full text-white bg-[#1f1838] mb-4 p-3 outline outline-2 outline-[#352f4c] rounded-lg"
                />
                <label className="text-white">Picture: </label>
                <input
                  type="file"
                  onChange={pictureHandler}
                  className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
              </div>
            )}

            <div className="mt-4 flex flex-col ">
              <div className="mr-4 ">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Write your main content
              </h2></div>
              <div className="flex-1">
              <JoditEditor
                ref={editor}
                value={editorHtml}
                config={editorConfig}
                onBlur={(newContent) => setEditorHtml(newContent)}
              />
</div>

              <Modal
                title="Uploading Video"
                visible={isUploading}
                footer={null}
                closable={false}
              >
                <div>
                  <Progress percent={progress} status="active" />
                  <div className="mt-4 flex justify-end gap-2">
                    <Button danger onClick={cancelUpload}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setIsUploading(false)}
                      disabled={progress !== 100}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
{showPreview && (
            <div
              className={`p-6 rounded-lg shadow-lg w-1/2 flex-grow-0 h-screen overflow-y-auto`}
            >
              <div className="flex justify-between items-center">
                <h1 className="text-2xl pb-0 text-center font-serif text-[#8a8f9e]">
                  Preview
                </h1>
               
              </div>
              <div>
                <JoditEditor
                  ref={editor}
                  config={editorConfiguration}
                  value={editorHtml}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end"><button
        onClick={() => setShowPreview(!showPreview)}
        className=" bg-[#bd23ff] text-white mr-2  rounded-full shadow-lg hover:bg-[#9033DA] transition"
        title={showPreview ? "Hide Preview" : "Show Preview"}
      >
        {showPreview ? <FaEyeSlash size={24} /> : <MdRemoveRedEye size={24} />}
      </button></div>

       <div className="mt-6 flex justify-center w-full mr-8">
        <button
          onClick={handleCreateOrUpdate}
          className="bg-[#bd23ff] text-white w-full px-4 py-2 mb-4 rounded-lg shadow-md hover:bg-[#9033DA] transition duration-300"
        >
          {isLoading ? <Spin
          style={{
            color: "#ffffff", 
          }}
          size="large"
        /> : isediting ? "Update Content" : `Create Content`}
        </button>
      </div>
    </>
  );
}
// import React, { useEffect, useRef, useState } from "react";
// import { db, storage } from "./Firebase";
// import {Spin } from "antd";
// import {
//   collection,
//   getDoc,
//   updateDoc,
//   addDoc,
//   doc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
// import { uploadBytesResumable } from "firebase/storage";
// import { useParams, useNavigate } from "react-router-dom";
// import { message } from "antd";
// import { FaCaretUp, FaCaretDown } from "react-icons/fa";
// import { auth } from "./Firebase.js";
// import { Modal, Button, Progress } from "antd";
// import { onAuthStateChanged } from "firebase/auth";
// import JoditEditor from "jodit-react";
// import "jodit/es2021/jodit.min.css";
// import { MdRemoveRedEye } from "react-icons/md";
// import { FaEyeSlash } from "react-icons/fa";


// export default function TextEditor() {
//   const { docId, sectionId } = useParams();
//   const navigate = useNavigate();
//   const editor = useRef(null);
//   const [showPreview, setShowPreview] = useState(false); // State for preview toggle
//   const [editorHtml, setEditorHtml] = useState("");
//   const [videoUrl, setVideoUrl] = useState([]);
//   const [imageUrl, setImageUrl] = useState("");
//   const [isediting, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [contentId, setContentId] = useState("");
//   const [modalState, setModalState] = useState({ Title: "", SubTitle: "" });
//   const [pictureFile, setPictureFile] = useState(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [uploadTask, setUploadTask] = useState(null); // Track the upload task
//   const [progress, setProgress] = useState(0); // Track upload progress
//   const [isUploading, setIsUploading] = useState(false); // Show dialog while uploading

 

//   const imageUpload = async () => {
//     const inputElement = document.createElement("input");
//     inputElement.type = "file";
//     inputElement.accept = "image/*";
//     inputElement.click();
//     inputElement.onchange = async () => {
//       const file = inputElement.files[0];
//       const storageReference = ref(storage, "images/" + file.name);
//       await uploadBytes(storageReference, file);
//       const image = await getDownloadURL(storageReference);
//       console.log(image);
//       setImageUrl(image);
//       setEditorHtml(
//         (prev) =>
//           prev +
//           `<div className="w-full"><img src="${image}" alt="${file.name}" class=" rounded-md object-contain  " /></div><br/>`
//       );
//     };
//   };

//   const videoUpload = async () => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "video/*";
//     input.click();
//     input.onchange = async () => {
//       const file = input.files[0];
//       if (file) {
//         const storageReference = ref(storage, "videos/" + file.name);
//         const uploadTaskInstance = uploadBytesResumable(storageReference, file);
//         setUploadTask(uploadTaskInstance); // Store the task for canceling
//         setIsUploading(true); // Show dialog

//         uploadTaskInstance.on(
//           "state_changed",
//           (snapshot) => {
//             // Update progress
//             const progressValue =
//               (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             setProgress(Math.round(progressValue));
//           },
//           (error) => {
//             // Handle errors
//             console.error("Error uploading video:", error);
//             message.error("Failed to upload video.");
//             setIsUploading(false);
//           },
//           async () => {
//             // Handle successful upload
//             const video = await getDownloadURL(uploadTaskInstance.snapshot.ref);
//             setVideoUrl((prevVideoUrls) => [...prevVideoUrls, video]);
//             setEditorHtml(
//               (prev) =>
//                 prev +
//                 `<div className="video-container h-full">
//                   <video src="${video}" controls alt="${file.name}" class="rounded-md h-full w-full"> </video>
//                  </div><br />`
//             );
//             message.success("Video uploaded successfully!");
//             setIsUploading(false); // Hide dialog
//           }
//         );
//       }
//     };
//   };

//   const cancelUpload = () => {
//     if (uploadTask) {
//       uploadTask.cancel(); // Cancel the upload
//       setIsUploading(false); // Hide dialog
//       message.info("Video upload canceled.");
//     }
//   };

//   const pictureHandler = async (e) => {
//     const picture = e.target.files[0];
//     const reference = ref(storage, `images/${picture.name}`);
//     await uploadBytes(reference, picture);
//     const url = await getDownloadURL(reference);
//     setPictureFile(url);
//     setModalState({ ...modalState, pictureUrl: pictureFile });
//   };

//   const handleCreateOrUpdate = async () => {
//     if (!editorHtml) return;
//     setIsLoading(true); // Start the loading spinner
//     const documentData = {
//       htmlContent: editorHtml,
//       sectionId: contentId,
//       videoUrl: videoUrl,
//       createdAt: serverTimestamp(),
//       lastUpdated: serverTimestamp(),
//       title: modalState.Title,
//       subTitle: modalState.SubTitle,
//       pictureUrl: pictureFile || modalState.pictureUrl,
//     };
//     try {
//       if (isediting) {
//         await updateDoc(doc(db, "urbanGardening", docId), documentData);
//         message.success("Content updated successfully!");
//         navigate("/");
//       } else {
//         const ref = await addDoc(collection(firestore, "Articles"), documentData);
//         await updateDoc(ref, { id: ref.id });
//         message.success("Content uploaded successfully!");
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Error adding/updating document:", error);
//       message.error("Failed to upload content.");
//     } finally {
//       setIsLoading(false); // Stop the loading spinner
//     }
//   };

//   const editorConfiguration = {
//     readonly: true,
//     height: 700,
//     toolbar: false,
//     style: {
//       backgroundColor: "#1f1838",
//       color: "#ffffff",
//     },
//   };

//   const editorConfig = {
//     readonly: false,
//     height: 700,
//     style: {
//       backgroundColor: "#1f1838",
//       color: "#ffffff",
//     },
//     toolbarAdaptive: false,
//     buttons: [
//       "source",
//       "bold",
//       "italic",
//       "underline",
//       "strikethrough",
//       "ul",
//       "ol",
//       "outdent",
//       "indent",
//       "font",
//       "fontsize",
//       "paragraph",
//       "link",
//       "align",
//       "undo",
//       "redo",
//       "copyformat",
//       "hr",
//       "eraser",
//       "table",
//       "print",
//       "preview",
//       "brush",
//       {
//         name: "customImage",
//         iconURL: "https://img.icons8.com/material-outlined/24/000000/image.png",
//         exec: () => imageUpload(),
//       },
//       {
//         name: "customVideo",
//         iconURL: "https://img.icons8.com/material-outlined/24/000000/video.png",
//         exec: () => videoUpload(),
//       },
//     ],
//     toolbarButtonSize: "middle",
//     controls: {
//       paragraph: {
//         list: [
//           { value: "p", text: "Normal" },
//           { value: "h1", text: "Heading 1" },
//           { value: "h2", text: "Heading 2" },
//           { value: "h3", text: "Heading 3" },
//           { value: "h4", text: "Heading 4" },
//           { value: "h5", text: "Heading 5" },
//           { value: "h6", text: "Heading 6" },
//         ],
//       },
//       fontsize: {
//         list: ["8", "10", "12", "14", "16", "18", "24", "30", "36", "48", "60"],
//       },
//     },
//     events: {
//       paste: (event) => {
//         event.preventDefault();
//         const clipboardData = event.clipboardData || window.clipboardData;
//         const pastedContent =
//           clipboardData.getData("text/html") || clipboardData.getData("text/plain");
//         if (pastedContent) {
//           setEditorHtml((prev) => prev + pastedContent); // Merge pasted content into editor
//         }
//       },
//     },
//   };
  

//   return (
//     <>
//       <div className="flex flex-col mr-10 mt-4 mb-16 rounded-lg ">
//         <div className="flex">
//           <div className="px-1 rounded-lg shadow-lg flex-grow-1 h-screen overflow-y-auto">
//             <div className="mt-4 flex flex-col ">
//               <div className="mr-4 ">
//               <h2 className="text-xl font-semibold mb-4 text-white">
//                 Write your main content
//               </h2></div>
//               <div className="flex-1">
//               <JoditEditor
//                 ref={editor}
//                 value={editorHtml}
//                 config={editorConfig}
//                 onBlur={(newContent) => setEditorHtml(newContent)}
//               />
// </div>

//               <Modal
//                 title="Uploading Video"
//                 visible={isUploading}
//                 footer={null}
//                 closable={false}
//               >
//                 <div>
//                   <Progress percent={progress} status="active" />
//                   <div className="mt-4 flex justify-end gap-2">
//                     <Button danger onClick={cancelUpload}>
//                       Cancel
//                     </Button>
//                     <Button
//                       onClick={() => setIsUploading(false)}
//                       disabled={progress !== 100}
//                     >
//                       Close
//                     </Button>
//                   </div>
//                 </div>
//               </Modal>
//             </div>
//           </div>
// {showPreview && (
//             <div
//               className={`p-6 rounded-lg shadow-lg w-1/2 flex-grow-0 h-screen overflow-y-auto`}
//             >
//               <div className="flex justify-between items-center">
//                 <h1 className="text-2xl pb-0 text-center font-serif text-[#8a8f9e]">
//                   Preview
//                 </h1>
               
//               </div>
//               <div>
//                 <JoditEditor
//                   ref={editor}
//                   config={editorConfiguration}
//                   value={editorHtml}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="flex justify-end"><button
//         onClick={() => setShowPreview(!showPreview)}
//         className=" bg-[#bd23ff] text-white mr-2  rounded-full shadow-lg hover:bg-[#9033DA] transition"
//         title={showPreview ? "Hide Preview" : "Show Preview"}
//       >
//         {showPreview ? <FaEyeSlash size={24} /> : <MdRemoveRedEye size={24} />}
//       </button></div>

//        <div className="mt-6 flex justify-center w-full mr-8">
//         <button
//           onClick={handleCreateOrUpdate}
//           className="bg-[#bd23ff] text-white w-full px-4 py-2 mb-4 rounded-lg shadow-md hover:bg-[#9033DA] transition duration-300"
//         >
//           {isLoading ? <Spin
//           style={{
//             color: "#ffffff", 
//           }}
//           size="large"
//         /> : isediting ? "Update Content" : `Create Content`}
//         </button>
//       </div>
//     </>
//   );
// }
