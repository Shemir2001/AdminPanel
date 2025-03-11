// import React, { useEffect, useState } from 'react';
// import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';
// import { firestore } from './Firebase.js';
// import { FaEdit } from "react-icons/fa";
// import { message, Popconfirm, Spin } from 'antd'; // Use Spin for the loading spinner
// import { MdFormatListBulletedAdd } from "react-icons/md";
// import { RiDeleteBin5Line } from "react-icons/ri";
// import { GiArtilleryShell } from "react-icons/gi";
// import { CiSearch } from "react-icons/ci";
// import { IoMdArrowBack } from "react-icons/io";

// const Mindfulness = () => {
//   const [articlesBySection, setArticlesBySection] = useState({});
//   const [activeTab, setActiveTab] = useState("Mindfulness Activities");
//   const [selectedSection, setSelectedSection] = useState(null);
//   const [filterText, setFilterText] = useState(''); // Filter text for sections
//   const [loading, setLoading] = useState(false); // State for loading spinner
//   const navigate = useNavigate();

//   const sectionsData = {
//     "Mindfulness Activities": [
//       "Guided Meditations",
//       "Breathing Exercises",
//       "Tapping Exercises (EFT)",
//       "Yoga or Mindful Walking",
//     ],
//     "Visualization Exercises": [
//       "Visualization Meditation",
//       "Visualization Music",
//       "Creating Vision Boards",
//       "Mind Mapping Exercise",
//     ],
//   };

//   useEffect(() => {
//     const fetchArticles = async (sectionName) => {
//       setLoading(true); // Start loading when fetching data
//       try {
//         const articlesCollection = collection(firestore, 'Articles');
//         const articlesQuery = query(articlesCollection, where('sectionId', '==', sectionName));
//         const articlesSnapshot = await getDocs(articlesQuery);
//         const articlesData = articlesSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setArticlesBySection(prevState => ({
//           ...prevState,
//           [sectionName]: articlesData,
//         }));
//       } catch (error) {
//         console.error('Error fetching articles:', error);
//       } finally {
//         setLoading(false); // Stop loading after data is fetched
//       }
//     };

//     // Fetch articles only for the selected section when it changes
//     if (selectedSection) {
//       fetchArticles(selectedSection);
//     }
//   }, [selectedSection]);

//   const handleNavigateToEditor = (articleId) => {
//     navigate(`/edit/${articleId}`);
//   };

//   const handleNewContent = (sectionId) => {
//     navigate(`/newContent/${sectionId}`);
//   };

//   const handleDelete = async (id) => {
//     try {
//       const articleRef = doc(firestore, 'Articles', id);
//       await deleteDoc(articleRef);
//       message.success('Article deleted successfully!');
//       window.location.reload();
//     } catch (error) {
//       console.error('Error deleting article:', error);
//     }
//   };

//   const currentSections = sectionsData[activeTab];
//   const filteredSections = currentSections.filter((sectionName) =>
//     sectionName.toLowerCase().includes(filterText.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 mt-8 flex flex-col items-center ">
//       <div className="flex justify-start bg-gray-300 p-4 rounded-lg shadow-lg w-full">
//         <span className='text-3xl pt-1 pr-2 text-black font-bold transition duration-300 hover:text-gray-900 transform hover:scale-105'>
//           <GiArtilleryShell />
//         </span>
//         <h1 className="text-3xl  text-gray-900">Mindfulness</h1>
//         <div className="flex-grow mx-6">
//           <div className="relative rounded-lg">
//             <span className="absolute left-3 top-4 text-gray-900 bg-gray-200 rounded-full font-bold text-1xl">
//               <CiSearch />
//             </span>
//             <div className='w-1/2'>
//               <input
//                 type="search"
//                 className="block w-full p-3 pl-8 text-sm rounded-lg text-gray-900 border border-gray-300 bg-gray-100 focus:ring-gray-500 focus:border-gray-500"
//                 placeholder="Search sections..."
//                 value={filterText}
//                 onChange={(e) => setFilterText(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-center  w-full p-5">
//         <button
//           onClick={() => {
//             setActiveTab("Mindfulness Activities");
//             setSelectedSection(null); // Reset selected section when tab changes
//             setFilterText('');
//           }}
//           className={`transition-colors duration-300 ease-in-out px-6 py-3 rounded-t-md 
//             ${activeTab === "Mindfulness Activities"
//               ? "bg-white text-gray-800 border-b-4 border-gray-500 shadow-sm"
//               : "bg-gray-200 text-gray-500 hover:bg-white hover:text-gray-800"}`}
//         >
//           Mindfulness Activities
//         </button>
//         <button
//           onClick={() => {
//             setActiveTab("Visualization Exercises");
//             setSelectedSection(null); // Reset selected section when tab changes
//             setFilterText('');
//           }}
//           className={`transition-colors duration-300 ease-in-out px-6 py-3 rounded-t-md ml-4 
//             ${activeTab === "Visualization Exercises"
//               ? "bg-white text-gray-800 border-b-4 border-gray-500 shadow-sm"
//               : "bg-gray-200 text-gray-500 hover:bg-white hover:text-gray-800"}`}
//         >
//           Visualization Exercises
//         </button>
//       </div>
//       {selectedSection === null && (
//         <div className="w-full">
//           {filteredSections.map((sectionName) => (
//             <div
//               key={sectionName}
//               className="flex justify-between items-center mb-6 p-5 bg-gray-200  hover:bg-gray-400 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
//             >
//               <div className='flex flex-grow cursor-pointer hover:text-white'
//                 onClick={() => setSelectedSection(sectionName)}>
//                 <h2 className="text-2xl font-semibold text-gray-900">{sectionName}</h2>
//               </div>
//               <button
//                 onClick={() => handleNewContent(sectionName)}
//                 className="flex items-center space-x-2 px-6 text-gray-900 rounded-lg transition-colors"
//               >
//                 <MdFormatListBulletedAdd className="text-3xl" />
//               </button>
//             </div>
//           ))}
//           {filteredSections.length === 0 && (
//             <div className="flex items-center justify-center p-6">
//               <p className="text-gray-500">No sections match your search.</p>
//             </div>
//           )}
//         </div>
//       )}
//       {selectedSection !== null && (
//         <div className="w-full">
//           <button
//             onClick={() => setSelectedSection(null)}
//             className="mb-4 text-gray-900 underline text-3xl"
//           >
//             <IoMdArrowBack className="text-10xl" />
//           </button>
//           <h2 className="text-2xl font-semibold text-gray-800 mb-6">{selectedSection}</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {loading ? (
//               <div className="flex justify-center items-center w-full h-64">
//                 <Spin size="large" /> {/* Use Spin for loading */}
//               </div>
//             ) : articlesBySection[selectedSection]?.length > 0 ? (
//               articlesBySection[selectedSection].map((article) => (
//                 <div
//                   key={article.id}
//                   className="bg-white shadow-md rounded-lg p-5 w-64 flex flex-col justify-between h-72 hover:shadow-xl transition-shadow duration-300"
//                 >
//                   <img
//                     src={article.pictureUrl}
//                     alt={article.title}
//                     className="w-full h-32 object-cover mb-4 rounded-lg"
//                   />
//                   <h3 className="text-lg font-bold text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
//                     {article.title}
//                   </h3>
//                   <p className="text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
//                     {article.subTitle}
//                   </p>
//                   <div className="flex justify-between mt-2">
//                     <Popconfirm
//                       title="Are you sure you want to delete this article?"
//                       onConfirm={() => handleDelete(article.id)}
//                       okText="Yes"
//                       cancelText="No"
//                     >
//                       <button className="text-red-600">
//                         <RiDeleteBin5Line className="text-2xl" />
//                       </button>
//                     </Popconfirm>
//                     <button
//                       onClick={() => handleNavigateToEditor(article.id)}
//                       className="text-blue-500"
//                     >
//                       <FaEdit className="text-2xl" />
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="flex justify-center items-center w-full h-64">
//                 <p className="text-gray-500">No articles found for this section.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Mindfulness;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaPlus } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoMdArrowBack } from "react-icons/io";
import { Popconfirm, message } from "antd";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "./Firebase.js";
import {Spin} from 'antd';
import guided1 from '../assets/guidedmeditations.svg';
import boards from '../assets/creatingvisionboards.svg';
import taping from '../assets/tapingexercise.svg';
import mindwalking from '../assets/yogaormindful.svg'; 
import visualizationmusic1 from '../assets/visualizationmusic.svg';
import breathing from '../assets/breathingexercise.svg';
import visualmeditation from '../assets/visualizationmeditation.svg';
import mindmapping from '../assets/mindmapingexercises.svg';
const Mindfulness = () => {
  const [activeTab, setActiveTab] = useState("Mindfulness");
  const [currentGallery, setCurrentGallery] = useState(null);
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const sectionsData = {
    Mindfulness: [
      { name: "Guided Meditations", subTitle: "Focus on the colors and design, and let your creativity flow", color: "bg-red-500", icon: <img src={guided1} alt="icon" className="w32 h32" />  },
      { name: "Tapping Exercises", subTitle: "Notice the shapes, textures, and colors of the bubbles as they float and pop", color: "bg-yellow-500", icon:  <img src={taping} alt="icon" className="w32 h32" />  },
      { name: "Breathing Exercises", subTitle: "Choose one instrument and focus on its sound throughout", color: "bg-green-500", icon:  <img src={breathing} alt="icon" className="w32 h32" />  },
      { name: "Yoga or Mindful Walking", subTitle: "Choose one instrument and focus on its sound throughout", color: "bg-green-500", icon:  <img src={mindwalking} alt="icon" className="w32 h32" />  },
    ],
    Visualization: [
      { name: "Visualization Meditation", subTitle: "Practice mindfulness through visual imagery", color: "bg-indigo-500", icon: <img src={visualmeditation} alt="icon" className="w32 h32" />  },
      { name: "Visualization Music", subTitle: "Enhance focus with calming visualization-based music", color: "bg-purple-500", icon: <img src={visualizationmusic1} alt="icon" className="w32 h32" />  },
      { name: "Creating Vision Boards", subTitle: "Craft inspiring visual boards for motivation", color: "bg-blue-500", icon: <img src={boards} alt="icon" className="w32 h32" />  },
      { name: "Mind Mapping Exercise", subTitle: "Organize your thoughts with mind maps", color: "bg-orange-500", icon: <img src={mindmapping} alt="icon" className="w32 h32" />  },
    ],
  };
  const fetchGalleryData = async (sectionName) => {
    setLoading(true);
    try {
      const articlesCollection = collection(firestore, "Articles");
      const articlesQuery = query(articlesCollection, where("sectionId", "==", sectionName));
      const articlesSnapshot = await getDocs(articlesQuery);
      const articlesData = articlesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGalleryData(articlesData);
    } catch (error) {
      console.error("Error fetching gallery data:", error);
    } finally {
      setLoading(false);
    }
  };const handleSectionClick = (sectionName) => {
    setCurrentGallery(sectionName);
    fetchGalleryData(sectionName);
  };
const handleBackToSections = () => {
    setCurrentGallery(null);
  };
const handleNavigateToEditor = (articleId) => {
    navigate(`/edit/${articleId}`);
  };const handleNewContent = (sectionId) => {
    navigate(`/newContent/${sectionId}`);
  };
const handleDelete = async (id) => {
    try {
      const articleRef = doc(firestore, "Articles", id);
      await deleteDoc(articleRef);
      message.success("Item deleted successfully!");
      setGalleryData(galleryData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
return (
    <div className="min-h-screen bg-[#130e26] p-10">
      {currentGallery ? (
        <div>
          <button
            onClick={handleBackToSections}
            className="flex items-center space-x-2 mb-6 text-white hover:text-gray-300"
          >
            <IoMdArrowBack className="text-lg" />
            <span>Back to Sections</span>
          </button>
          <h2 className="text-3xl font-bold text-white mb-6">{currentGallery} Gallery</h2>
          {loading ? (
            <Spin size="large" tip="Loading..."/>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryData.length > 0 ? (
                galleryData.map((item) => (
                  <div key={item.id} className="bg-white shadow-md rounded-lg p-5">
                    <img src={item.pictureUrl} alt={item.title} className="w-full h-32 object-cover mb-4 rounded" />
                    <h3 className="text-lg font-semibold text-black">{item.title}</h3>
                    <div className="flex justify-between mt-2">
                      <button onClick={() => handleNavigateToEditor(item.id)} className="text-blue-500 hover:text-blue-700">
                        <FaEdit className="text-xl" />
                      </button>
                      <Popconfirm
                        title="Are you sure you want to delete this item?"
                        onConfirm={() => handleDelete(item.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <button className="text-red-500 hover:text-red-700">
                          <RiDeleteBin5Line className="text-xl" />
                        </button>
                      </Popconfirm>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No items available in this gallery.</p>
              )}
            </div>
          )}
          <div className="mt-6">
            <button
              onClick={() => handleNewContent(currentGallery)}
              className="py-2 px-4 bg-[#bd23ff] text-white rounded-full shadow-md hover:bg-[#a11ad4] flex items-center"
            >
              <FaPlus className="mr-2" />
              Add New Content
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setActiveTab("Mindfulness")}
              className={`w-64 h-11 rounded-lg text-xl font-medium transition duration-300 ${
                activeTab === "Mindfulness" ? "bg-[#bd23ff] text-[#321951] shadow-lg" : "bg-[#1f1838] text-[#7e8a8c]"}`
              }
            >
              Mindfulness Activities
            </button>
            <button
              onClick={() => setActiveTab("Visualization")}
              className={`w-64 h-11 rounded-lg text-xl font-medium transition duration-300 ${
                activeTab === "Visualization" ? "bg-[#bd23ff] text-[#321951] shadow-lg" : "bg-[#1f1838] text-[#7e8a8c]"}`
              }
            >
              Visualization Exercises
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {sectionsData[activeTab].map(({ name, subTitle, color, icon }) => (
              <div
                key={name}
                onClick={() => handleSectionClick(name)}
                className="flex items-center p-2 bg-[#1f1838] text-white shadow-lg rounded-lg outline outline-2 outline-[#352f4c] cursor-pointer transform transition duration-300 hover:scale-105"
              >
                <div className={`w-32 h-32 flex-shrink-0 ${color} shadow-lg flex items-center justify-center rounded-md`}>
                  <span className="text-3xl">{icon}</span>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold">{name}</h2>
                  <p className="text-sm text-[#727c81]">{subTitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Mindfulness;
