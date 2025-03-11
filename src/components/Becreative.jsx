// import React, { useEffect, useState } from 'react';
// import { collection, deleteDoc, getDocs, query, where, doc } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';
// import { firestore } from './Firebase.js';
// import { FaEdit } from "react-icons/fa";
// import { message, Popconfirm } from 'antd';
// import { MdFormatListBulletedAdd } from "react-icons/md";
// import { RiDeleteBin5Line } from "react-icons/ri";
// import { IoMdArrowBack } from "react-icons/io";
// import { MdLocalActivity } from "react-icons/md";
// import { GiArtilleryShell } from "react-icons/gi";
// import { VscFolderActive } from "react-icons/vsc";
// const Sections = () => {
//   const [articlesBySection, setArticlesBySection] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("Creative"); 
//   const [selectedSection, setSelectedSection] = useState(null); 
//   const navigate = useNavigate();
//   const [search, setSearch] = useState('');
//   const [filteredArticles, setFilteredArticles] = useState({});
//   const [sectionSearch, setSectionSearch] = useState(''); // Added state for section filtering
// const sectionsData = {
//     Creative: [
//       "Color Something",
//       "Blowing Bubbles",
//       "Listening to Music",
//       "Nature Walk Creations",
//       "Rock Painting",
//       "Make a Picture",
//     ],
//     Active: [
//       "Squeezing Muscles",
//       "Star Jumps or Skipping",
//       "Yoga Poses",
//       "Ride a Bike or Go for a Run",
//       "Freestyle Dance",
//     ],
//   };
//  useEffect(() => {
//   const fetchArticlesBySection = async () => {
//       const allArticles = {};
//       try {
//         for (const sectionName of [...sectionsData.Creative, ...sectionsData.Active]) {
//           const articlesCollection = collection(firestore, 'Articles');
//           const articlesQuery = query(articlesCollection, where('sectionId', '==', sectionName));
//           const articlesSnapshot = await getDocs(articlesQuery);
//           const articlesData = articlesSnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           allArticles[sectionName] = articlesData;
//         }
//         setArticlesBySection(allArticles);
//         setFilteredArticles(allArticles);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching articles:', error);
//       }
//     };
//     fetchArticlesBySection();
//   }, []);
// const handleNavigateToEditor = (articleId) => {
//     navigate(`/edit/${articleId}`);
//   };
// const handleNewContent = (sectionId) => {
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
//   const handleFilter = (e) => {
//     const searchTerm = e.target.value.toLowerCase();
//     setSearch(searchTerm);
//     if (selectedSection) {
//       const filtered = articlesBySection[selectedSection]?.filter(article =>
//         article.title.toLowerCase().includes(searchTerm) || 
//         article.subTitle.toLowerCase().includes(searchTerm)
//       );
//       setFilteredArticles({ [selectedSection]: filtered || [] });
//     } else {
//       setFilteredArticles(articlesBySection);
//     }
//   };
//   const filteredSections = Object.keys(sectionsData).reduce((acc, key) => {
//     acc[key] = sectionsData[key].filter(sectionName =>
//       sectionName.toLowerCase().includes(sectionSearch.toLowerCase())
//     );
//     return acc;
//   }, {});
// const currentSections = activeTab === "Creative" ? filteredSections.Creative : filteredSections.Active;
// const renderSectionContent = () => {
//     if (loading) {
//       return <div className="flex items-center justify-center p-6"><p className="text-gray-500">Loading....</p></div>;
//     }
//     if (!filteredArticles[selectedSection] || filteredArticles[selectedSection].length === 0) {
//       return <div className="flex items-center justify-center p-6"><p className="text-gray-500">No articles found.</p></div>;
//     }
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredArticles[selectedSection].map((article) => (
//           <div
//             key={article.id}
//             className="bg-white shadow-md rounded-lg p-5 w-64 flex flex-col justify-between h-72 hover:shadow-xl transition-shadow duration-300"
//           >
//             <img
//               src={article.pictureUrl}
//               alt={article.title}
//               className="w-full h-32 object-cover mb-4 rounded-lg"
//             />
//             <h3 className="text-lg font-bold text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
//               {article.title}
//             </h3>
//             <p className="text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
//               {article.subTitle}
//             </p>
//             <div className="flex justify-between mt-2">
//               <Popconfirm
//                 title="Are you sure you want to delete this article?"
//                 onConfirm={() => handleDelete(article.id)}
//                 okText="Yes"
//                 cancelText="No"
//               >
//                 <button>
//                   <RiDeleteBin5Line className="text-2xl text-gray-700 hover:text-red-500" />
//                 </button>
//               </Popconfirm>
//               <button
//                 onClick={() => handleNavigateToEditor(article.id)}
//                 className="px-2 text-gray-600  rounded-lg transition-colors flex items-center"
//               >
//                 <FaEdit className="text-2xl" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };
// return (
//     <div className="min-h-screen bg-gray-50 pl-6 pt-0 flex flex-col items-center ml-64">
//       <div className="flex justify-start bg-gray-300 p-1 rounded-lg shadow-lg w-full">
//         <span className='text-3xl pt-3 pr-2 text-black font-bold transition duration-300 hover:text-gray-900 transform hover:scale-105'>
//           <GiArtilleryShell />
//         </span>
//         <h1 className="text-3xl text-gray-900 pt-2">Be Creative</h1>
//         <div className="relative mb-4 w-1/2 pl-10 pt-2">
//         <input
//           onChange={(e) => setSectionSearch(e.target.value)}
//           type="search"
//           className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-100 focus:ring-gray-500 focus:border-gray-500"
//           placeholder="Search Sections..."
//         />
//       </div>
//       </div>
//       <div className="flex justify-center w-full p-3">
//         <button
//           onClick={() => { setActiveTab("Creative"); setSelectedSection(null); }}
//           className={`flex items-center transition-colors duration-300 ease-in-out px-6 py-3 rounded-t-md ${activeTab === "Creative" ? "bg-white text-gray-800 border-b-4 border-gray-500 shadow-sm" : "bg-gray-200 text-gray-500 hover:bg-white hover:text-gray-800"}`}
//         >
//           <MdLocalActivity className='mr-2 text-3xl' />
//           Creative Activities
//         </button>
//         <button
//           onClick={() => { setActiveTab("Active"); setSelectedSection(null); }}
//           className={`flex items-center transition-colors duration-300 ease-in-out px-6 py-3 rounded-t-md ml-4 ${activeTab === "Active" ? "bg-white text-gray-800 border-b-4 border-gray-500 shadow-sm" : "bg-gray-200 text-gray-500 hover:bg-white hover:text-gray-800"}`}
//         >
//           <VscFolderActive className='mr-2 text-3xl' />
//           Active Activities
//         </button>
//       </div>
      
//       {selectedSection === null ? (
//         <div className="w-full">
//           {currentSections.map((sectionName) => (
//             <div
//               key={sectionName}
//               className="flex justify-between items-center mb-6 p-5 bg-gray-200 hover:bg-gray-400 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
//             >
//               <div className='flex-grow cursor-pointer ' onClick={() => setSelectedSection(sectionName)}>
//                 <h2 className="text-2xl font-semibold text-gray-900  hover:text-white">{sectionName}</h2>
//               </div>
//               <button
//                 onClick={() => handleNewContent(sectionName)}
//                 className="flex items-center space-x-2 px-6 text-gray-900 rounded-lg transition-colors"
//               >
//                 <MdFormatListBulletedAdd className="text-3xl" />
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="w-full">
//           <div className="flex justify-start mb-4">
//             <button
//               onClick={() => setSelectedSection(null)}
//               className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 flex items-center"
//             >
//               <IoMdArrowBack className="mr-2 text-xl" /> Back to Sections
//             </button>
//           </div>
//           <div className="p-6 bg-gray-200 rounded-lg shadow-md">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4">{selectedSection}</h2>
//             {renderSectionContent()}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// export default Sections;
import React, { useEffect, useState } from 'react';
import { firestore } from './Firebase.js';
import { collection, deleteDoc, getDocs, query, where, doc } from 'firebase/firestore';
import { IoMdArrowBack } from 'react-icons/io';
import { FaEdit, FaPlus } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { message, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import {Spin} from 'antd';
import some from '../assets/colorsomething.svg'
import bubbles from '../assets/blowingbubbles.svg'
import naturewalk from '../assets/naturewalkcreation.svg'
import picture from '../assets/makepicture.svg'
import playmusic from '../assets/listeningtomusic.svg'
import rock from '../assets/rockpainting.svg'
import sequeeze from '../assets/sequeezingmuscle.svg'
import yoga from '../assets/yoga.svg'
import jump from '../assets/jump.svg'
import cycle1 from '../assets/rideabike.svg'
import dance from '../assets/freedance.svg'
import martial from '../assets/martialarts.svg'
const Sections = () => {
  const [activeTab, setActiveTab] = useState("Creative");
  const [currentGallery, setCurrentGallery] = useState(null);
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sectionsData = {
    Creative: [
      { name: "Color Something", subTitle: 'Focus on the colors and design, and let your creativity flow', color: 'bg-red-500',   icon: <img src={some} alt="icon" className="w32 h32" />,},
      { name: "Blowing Bubbles", subTitle: 'Notice the shapes, textures, and colors of the bubbles as they float and pop', color: 'bg-yellow-500', icon: <img src={bubbles} alt="icon" className="w32 h32" /> },
      { name: "Listening to Music", subTitle: 'Choose one instrument and focus on its sound throughout', color: 'bg-green-500', icon: <img src={playmusic} alt="icon" className="w32 h32" /> },
      { name: "Nature Walk Creations", subTitle: 'Go on a nature walk and collect items to create something unique', color: 'bg-blue-500', icon: <img src={naturewalk} alt="icon" className="w32 h32" /> },
      { name: "Rock Painting", subTitle: 'Find smooth rocks and paint them with designs or images', color: 'bg-purple-500', icon: <img src={rock} alt="icon" className="w32 h32" /> },
      { name: "Make a Picture", subTitle: 'Use materials from around the house to make a collage or picture', color: 'bg-indigo-500', icon: <img src={picture} alt="icon" className="w32 h32" /> },
    ],
    Active: [
      { name: "Squeezing Muscles",subTitle: 'Engage in energetic, playful exercises to squeeze your muscles', color: 'bg-pink-500', icon: <img src={sequeeze} alt="icon" className="w32 h32" /> },
      { name: "Star Jumps", color: 'bg-yellow-400',subTitle: 'Jump with your feet, arms, and head', icon: <img src={jump} alt="icon" className="w32 h32" />  },
      { name: "Yoga Poses",subTitle: 'Engage in yoga poses to stretch your body and mind', color: 'bg-green-500', icon: <img src={yoga} alt="icon" className="w32 h32" />  },
      { name: "Ride a Bike",subTitle: 'Get out and go for a bike ride', color: 'bg-blue-400', icon: <img src={cycle1} alt="icon" className="w32 h32" />  },
      { name: "Freestyle Dance", subTitle: 'Dance to your heart’s content', color: 'bg-purple-500', icon: <img src={dance} alt="icon" className="w32 h32" />  },
      { name: "Martial Arts/Boxing/Tai Chi", subTitle: 'Engage in a creative, active adventure by riding your bike or running in a fun pattern or direction.', color: 'bg-purple-500', icon: <img src={martial} alt="icon" className="w32 h32" />  },

    ],
  };

  const fetchGalleryData = async (sectionName) => {
    setLoading(true);
    try {
      const articlesCollection = collection(firestore, 'Articles');
      const articlesQuery = query(articlesCollection, where('sectionId', '==', sectionName));
      const articlesSnapshot = await getDocs(articlesQuery);
      const articlesData = articlesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGalleryData(articlesData);
    } catch (error) {
      console.error('Error fetching gallery data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionClick = (sectionName) => {
    setCurrentGallery(sectionName);
    fetchGalleryData(sectionName);
  };
  
  const handleBackToSections = () => {
    setCurrentGallery(null);
  };

  const handleNavigateToEditor = (articleId) => {
    navigate(`/edit/${articleId}`);
  };

  const handleNewContent = (sectionId) => {
    navigate(`/newContent/${sectionId}`);
  };

  const handleDelete = async (id) => {
    try {
      const articleRef = doc(firestore, 'Articles', id);
      await deleteDoc(articleRef);
      message.success('Item deleted successfully!');
      setGalleryData(galleryData.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#130e26] p-10">
      {currentGallery ? (
        // Gallery View
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
            <>
            <div className='fex justify-center items-center w-full'>
           <Spin size='large' tip='Loading...' /></div></>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryData.length > 0 ? (
                galleryData.map(item => (
                  <div key={item.id} className="bg-white shadow-md rounded-lg p-5">
                    <img src={item.pictureUrl} alt={item.title} className="w-full h-32 object-cover mb-4 rounded" />
                    <h3 className="text-lg font-semibold text-black">{item.title}</h3>
                    <div className="flex justify-between mt-2">
                      <button onClick={() => handleNavigateToEditor(item.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
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
            <button onClick={() => handleNewContent(currentGallery)}
              className="py-2 px-4 bg-[#bd23ff] text-white rounded-full shadow-md hover:bg-[#a11ad4] flex items-center"
            >              <FaPlus className="mr-2" />
            Add New Content
          </button>
        </div>
      </div>
    ) : (
      // Sections View
      <div>
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab("Creative")}
            className={`w-64 h-11 rounded-lg text-xl font-medium transition duration-300 ${
              activeTab === "Creative"
                ? "bg-[#bd23ff] text-[#321951] shadow-lg"
                : "bg-[#1f1838] text-[#7e8a8c]"
            }`}
          >
            Creative Activities
          </button>
          <button
            onClick={() => setActiveTab("Active")}
            className={`w-64 h-11 rounded-lg text-xl font-medium transition duration-300 ${
              activeTab === "Active"
                ? "bg-[#bd23ff] text-[#321951] shadow-lg"
                : "bg-[#1f1838] text-[#7e8a8c]"
            }`}
          >
            Active Activities
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {sectionsData[activeTab].map((section) => (
            <div
              key={section.name}
              onClick={() => handleSectionClick(section.name)}
              className="flex items-center p-2 bg-[#1f1838] text-white shadow-lg rounded-lg outline outline-2 outline-[#352f4c]  cursor-pointer transform transition duration-300 hover:scale-105"
            >
              {/* Left Icon Box */}
              <div className={`w-32 h-32 flex-shrink-0 ${section.color} shaodow-lg flex items-center  justify-center rounded-md`}>
                <span className="text-3xl">{section.icon}</span>
              </div>
                            <div className="ml-4">
                <h2 className="text-xl font-semibold">{section.name}</h2>
                <p className="text-sm text-[#727c81]">{section.subTitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
};

export default Sections;

