import React, { useState, useEffect } from 'react';
import { Modal, message, Spin, Empty } from 'antd';
import { FiBell, FiMessageSquare } from 'react-icons/fi';
import { MdHistory, MdEdit, MdDelete } from 'react-icons/md';
import { FaEdit } from "react-icons/fa";
import { FaEye } from 'react-icons/fa';
import {
  firestore,
  storage,
  functions
} from './Firebase.js';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';

const NotificationPanel = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([]);
  const [image, setImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    description: '',
    imageFile: null,
    imageLink: null, // To store existing image URL
  });

  const [expanded, setExpanded] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const collectionName = activeTab === 'push' ? 'Notifications' : 'InAppMessaging';
      const docRef = collection(firestore, collectionName);
      const querySnapshot = await getDocs(docRef);
      const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab) fetchData();
    else setHistory([]);
  }, [activeTab]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const previewUrl = URL.createObjectURL(file); // Generate a preview URL for the selected image
        setImage(file);
        setFormData({ 
            ...formData, 
            imageFile: file, 
            imageLink: previewUrl // Update the preview URL for the imageLink field
        });
    }
};

const handleData = async (isEdit = false) => {
  try {
    setSubmitting(true);
    const collectionName = activeTab === 'push' ? 'Notifications' : 'InAppMessaging';
    const referenceDoc = collection(firestore, collectionName);

    if (isEdit) {
      const docRef = doc(firestore, collectionName, editingItem.id);

      if (activeTab === 'push') {
        // Update Push Notification
        await updateDoc(docRef, {
          title: formData.title,
          body: formData.body,
        });
      } else {
        // Update In-App Messaging
        let imageUrl = formData.imageLink; // Use existing URL if no new image uploaded
        if (image) {
          const imageRef = ref(storage, `images/${image.name}`);
          await uploadBytes(imageRef, image);
          imageUrl = await getDownloadURL(imageRef);
        }

        // Reset `seenBy` array and update the document
        await updateDoc(docRef, {
          title: formData.title,
          description: formData.description,
          imageLink: imageUrl,
          seenBy: [], // Clear seenBy array
        });
      }

      message.success('Notification Updated Successfully!');
    } else {
      if (activeTab === 'push') {
        // Create new Push Notification
        const sendNotification = httpsCallable(functions, 'sendNotificationAdmin2');
        await sendNotification({
          title: formData.title,
          body: formData.body,
          topic: 'all',
        });

        const newDocRef = await addDoc(referenceDoc, {
          title: formData.title,
          body: formData.body,
          createdAt: serverTimestamp(),
        });

        // Store the document ID in the document
        await updateDoc(newDocRef, { id: newDocRef.id });

        message.success('Push Notification Sent Successfully!');
      } else {
        // Create new In-App Messaging
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);

        const newDocRef = await addDoc(referenceDoc, {
          title: formData.title,
          description: formData.description,
          imageLink: imageUrl,
          seenBy: [], // Initialize seenBy to an empty array
          createdAt: serverTimestamp(),
        });

        // Store the document ID in the document
        await updateDoc(newDocRef, { id: newDocRef.id });

        message.success('In-App Notification Sent Successfully!');
      }
    }

    fetchData();
    resetForm();
  } catch (error) {
    console.error('Error handling data:', error);
    message.error('Failed to process notification');
  } finally {
    setSubmitting(false);
  }
};



  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this notification?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          const collectionName = activeTab === 'push' ? 'Notifications' : 'InAppMessaging';
          const docRef = doc(firestore, collectionName, id);
          await deleteDoc(docRef);
          message.success('Notification Deleted Successfully!');
          fetchData();
        } catch (error) {
          console.error('Error deleting notification:', error);
          message.error('Failed to delete notification');
        }
      },
    });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      body: item.body || '',
      description: item.description || '',
      imageFile: null, // This remains null because no new file is uploaded yet
      imageLink: item.imageLink || null, // Pre-fill with the existing image URL
    });
    setImage(null); // Clear any previously selected image file
    setIsModalOpen(true);
  };
  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      body: '',
      description: '',
      imageFile: null,
      imageLink: null,
    });
    setImage(null);
    setEditingItem(null);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-[#130e26] rounded-lg shadow-lg h-screen flex gap-6">
      <div className="w-1/3 bg-[#1f1838] p-4 rounded-lg overflow-auto">
        <div className="flex items-center mb-4">
          <MdHistory className="text-white text-2xl mr-2" />
          <h2 className="text-white text-xl font-semibold">History</h2>
        </div>

        {loading ? (
          <Spin tip="Loading..." />
        ) : history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="bg-[#130e26] p-3 rounded-md shadow-md">
                {activeTab === 'in-app' && item.imageLink && (
                  <img
                    src={item.imageLink}
                    alt="In-App"
                    className="w-full h-32 rounded-md"
                  />
                )}
                <h3 className="text-white font-bold mt-2">{item.title}</h3>
                <p className="text-white mt-2">
                  {expanded[item.id]
                    ? activeTab === 'push'
                      ? item.body
                      : item.description
                    : (activeTab === 'push' ? item.body : item.description)?.substring(0, 100)}
                  {((activeTab === 'push' && item.body?.length > 100) ||
                    (activeTab === 'in-app' && item.description?.length > 100)) && (
                    <span
                      onClick={() => toggleExpand(item.id)}
                      className="text-blue-400 cursor-pointer ml-2"
                    >
                      {expanded[item.id] ? 'Show Less' : 'Show More'}
                    </span>
                  )}
                </p>
                {activeTab === 'in-app' && item.seenBy && (
                  <div className="flex items-center justify-end mt-2 space-x-2">
                    <span className="font-bold text-white">{item.seenBy.length}</span>
                    <FaEye size={20} className="text-white" />
                  </div>
                )}
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-500 hover:underline"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:underline"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            description={
              <span className="text-white">History not found</span>
            }
            imageStyle={{ height: 60 }}
          />
        )}
      </div>

      <div className="w-2/3">
        <div className="flex justify-center gap-6 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'push' ? 'bg-[#bd23ff]' : 'bg-[#1f1838]'
            } text-white`}
            onClick={() => setActiveTab('push')}
          >
            <FiBell className="mr-2" />
            Push Notifications
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'in-app' ? 'bg-[#bd23ff]' : 'bg-[#1f1838]'
            } text-white`}
            onClick={() => setActiveTab('in-app')}
          >
            <FiMessageSquare className="mr-2" />
            In-App Messages
          </button>
        </div>

        {activeTab && (
          <form onSubmit={(e) => { e.preventDefault(); handleData(editingItem !== null); }} className="space-y-4">
            <div>
              <label className="block text-white">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 text-white bg-[#1f1838] rounded-md"
                required
              />
            </div>

            {activeTab === 'push' && (
              <div>
                <label className="block text-white">Body</label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  className="w-full p-2 text-white bg-[#1f1838] rounded-md"
                  required
                />
              </div>
            )}

            {activeTab === 'in-app' && (
              <>
                <div>
                  <label className="block text-white">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 text-white bg-[#1f1838] rounded-md"
                    required
                  />
                </div>
                <div>
  <label className="block text-gray-700">Image</label>
  <input
    type="file"
    onChange={handleImageChange}
    className="w-full p-2 border rounded-md"
    accept="image/*"
  />
  {/* Show preview of the image: either the existing URL or a newly selected image */}
  {formData.imageLink && (
    <img
      src={formData.imageLink} // Use the existing image URL or new file's preview URL
      alt="Existing or New"
      className="mt-2 h-32 rounded-md"
    />
  )}
</div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-[#bd23ff] p-2 text-white rounded-md"
            >
              {submitting ? <Spin /> : editingItem ? 'Update' : 'Submit'}
            </button>
          </form>
        )}
      </div>

      <Modal
        visible={isModalOpen}
        title="Edit Notification"
        onCancel={resetForm}
        footer={null}
        centered
      >
        <form onSubmit={(e) => { e.preventDefault(); handleData(true); }} className="space-y-4">
          <div>
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          {activeTab === 'push' && (
            <div>
              <label className="block text-gray-700">Body</label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          )}
          {activeTab === 'in-app' && (
            <>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Image</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full p-2 border rounded-md"
                  accept="image/*"
                />
                {formData.imageLink && (
                  <img
                    src={formData.imageLink}
                    alt="Existing"
                    className="mt-2 h-32 rounded-md"
                  />
                )}
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-[#bd23ff] p-2 text-white rounded-md"
          >
            {submitting ? <Spin /> : 'Update'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default NotificationPanel;
