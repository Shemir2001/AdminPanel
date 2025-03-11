import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from './Firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { message } from 'antd';
import { Popconfirm } from 'antd';

const List = () => {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  const fetchCards = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'Articles'));
    const cardData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCards(cardData);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const deleteCard = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'Articles', id));
      fetchCards();
      message.success('Card deleted successfully!');
    } catch (error) {
      console.error('Error deleting card:', error);
      message.error('Failed to delete card!');
    }
  };

  const editCard = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <>
    <div className="ml-[300px] mt-[20px]">
  <div className="bg-purple-900 w-[97%] p-[20px] rounded-lg mb-[20px] mr-[20px] text-center shadow-md">
    <h1 className="m-0 text-white text-[24px]">Guided Meditation</h1>
    <p className="mt-[10px] mb-0 text-white text-[16px]">
      Here you can view the articles you added and update them too!
    </p>
  </div>
</div>
      <div className="cards-container ml-[300px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-0 mt-0 mr-7 mb-7">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col bg-[#2b263c] shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            style={{ width: '100%', height: '400px' }}  // Fix the height and width for consistency
          >
            {/* Image Section */}
            <div className="w-full h-48 bg-gray-700">
              {card.pictureUrl ? (
                <img
                  src={card.pictureUrl}
                  alt={card.title || 'Card image'}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  No Image Available
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                {/* Title displayed on a single line */}
                <h2 className="text-lg font-bold text-white truncate">{card.title}</h2>

                {/* Subtitle displayed on a single line */}
                <p className="text-sm text-gray-300 truncate">{card.subTitle}</p>
              </div>

              {/* Buttons Section */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => editCard(card.id)}
                  className="bg-[#BD23FF] text-white px-4 py-2 rounded hover:bg-[#9b1fd6] transition-colors"
                >
                  Edit
                </button>

                <Popconfirm
                  title="Are you sure you want to delete this card?"
                  onConfirm={() => deleteCard(card.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                    Delete
                  </button>
                </Popconfirm>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
