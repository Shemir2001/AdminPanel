import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from './Firebase'; // Your Firebase configuration
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { message } from 'antd';

const List = () => {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  // Fetch data from Firestore
  useEffect(() => {
    const fetchCards = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'EditorContent'));
      const cardData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCards(cardData);
    };
    fetchCards();
  }, []);

  // Delete card function
  const deleteCard = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'EditorContent', id));
      setCards(cards.filter((card) => card.id !== id));
      message.success('Card deleted successfully!');
    } catch (error) {
      console.error('Error deleting card:', error);
      message.error('Failed to delete card!');
    }
  };

  // Navigate to the editor with card's id for updating
  const editCard = (id) => {
    navigate(`/edit/${id}`);
  };

  // Function to remove <img> tags from HTML content
  const stripImagesFromHtml = (htmlContent) => {
    return htmlContent.replace(/<img[^>]*>/g, '');
  };

  return (
    <>    
    <div style={{ marginLeft: '300px', marginTop: '20px' }}>
      <div style={{
        backgroundColor: '#1F1838',
        width: '97%',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        marginRight: '20px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}>
        <h1 style={{ margin: '0', color: '#ffff', fontSize: '24px' }}>Guided Meditation</h1>
        <p style={{ margin: '10px 0 0 0', color: '#ffff', fontSize: '16px' }}>Here you can view the articles you added and update them too!</p>
      </div>
</div>
    <div className="cards-container ml-[300px] grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-8 p-0 mt-0 mr-7 mb-7">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-[#2b263c] shadow-lg rounded-lg overflow-hidden sm:overflow-x-auto transition-transform transform hover:scale-105 duration-300"
        >
          {/* Display the image from the separate imageUrl field */}
          {card.imageUrl && (
            <img
              src={card.imageUrl}
              alt={card.title || 'Card image'}
              className="w-full h-40 object-cover"
            />
          )}

          <div className="p-4">
            {/* Display the rest of the HTML content, excluding images */}
            <div
              className="text-white text-sm overflow-hidden overflow-ellipsis h-16"
              dangerouslySetInnerHTML={{ __html: stripImagesFromHtml(card.htmlContent) }}
            />

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => editCard(card.id)}
                className="bg-[#BD23FF] text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCard(card.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    </>

  );
};

export default List;
