import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, getDocs, query, where, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { firestore } from './Firebase.js';
import { FaEdit } from "react-icons/fa";
import {message, Popconfirm} from 'antd';
import { MdFormatListBulletedAdd } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
const SectionsWithArticles = () => {
  const [sections, setSections] = useState([]);
  const [articlesBySection, setArticlesBySection] = useState({});
  const navigate = useNavigate();
useEffect(() => {
  const fetchSectionsAndArticles = async () => {
      try {
        const sectionsCollection = collection(firestore, 'Sections');
        const sectionsSnapshot = await getDocs(sectionsCollection);
        const sectionsData = sectionsSnapshot.docs.map(doc => ({
          id: doc.id,
          sectionId: doc.data().sectionId
        }));
        setSections(sectionsData)
         sectionsData.forEach(async (section) => {
          const articlesCollection = collection(firestore, 'Articles');
          const articlesQuery = query(articlesCollection, where('sectionId', '==', section.sectionId));
          const articlesSnapshot = await getDocs(articlesQuery);
          const articlesData = articlesSnapshot.docs.map(articleDoc => ({
            id: articleDoc.id,
            ...articleDoc.data(),
          }));
          setArticlesBySection(prevState => ({
            ...prevState,
            [section.sectionId]: articlesData,
          }));
        });
      } catch (error) {
        console.error('Error fetching sections or articles:', error);
      }
    };
    fetchSectionsAndArticles();
  }, []);
   const handleNavigateToEditor = (articleId) => {
    navigate(`/edit/${articleId}`);
  };
 const handleNewChange = (sectionId) => {
    navigate(`/newContent/${sectionId}`);
  };
  const handleDelete=async (id)=>{
    try{

      const articleRef=doc(firestore, 'Articles', id)
      await deleteDoc(articleRef)
      message.success('Article deleted successfully!')
      fetchSectionsAndArticles();
    }catch(error){
      console.error('Error deleting article:', error);
    }
    }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center ml-64">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Sections and Articles 
      </h1>
      {sections.map((section) => (
        <div
          key={section.sectionId}
          className="w-full mb-12 pb-8 border-gray-200"
        >
          <div className="flex justify-between bg-slate-200 rounded-lg px-2 py-1">
            <h2 className="text-2xl font-semibold text-gray-700 ">
              {section.sectionId}
            </h2>
            <div className="flex justify-end">
              <button
                onClick={() => handleNewChange(section.sectionId)}
                className="px-2 text-gray-900 rounded-lg  transition-colors flex items-center space-x-2"
              >
                <MdFormatListBulletedAdd className="text-3xl" />
              </button>
            </div>
          </div>
          <div className="grid pt-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlesBySection[section.sectionId]?.length > 0 ? (
              articlesBySection[section.sectionId].map((article) => (
                <div
                  key={article.id}
                  className="bg-white shadow-md rounded-lg p-4 pl-2 pr-2 pt-2 w-64 flex flex-col justify-between h-72" // Set a fixed height for the card
                >
                  <img
                    src={article.pictureUrl}
                    alt={article.title}
                    className="w-full h-32 object-cover mb-4 rounded-lg"
                  />
                  <h3 className="text-lg font-bold text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap"> 
                    {/* Adjust text overflow handling */}
                    {article.title}
                  </h3>
                  <p className="text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                    {/* Adjust text overflow handling */}
                    {article.subTitle}
                  </p>
                  <div className="flex justify-between mt-0">
                    <div>
                      <Popconfirm
                      title="Are you sure you want to delete this article?"
                      onConfirm={() => handleDelete(article.id)}
                      okText="Yes"
                      cancelText="No"
                      >
                    <button
                   
                    >
                     <RiDeleteBin5Line className='text-2xl text-gray-900' />
                    </button>
                    </Popconfirm>
                    </div>
                    <div>
                    <button
                      onClick={() => handleNavigateToEditor(article.id)}
                      className="px-2 text-blue-700 rounded-lg hover:text-white transition-colors flex items-center space-x-2"
                    >
                      <FaEdit className="text-2xl text-gray-800 hover:bg-none" />
                    </button>
                    </div>
                  </div>
                  
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center p-5">
                <p className="text-gray-500">No articles available for this section.</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
  
};

export default SectionsWithArticles;
