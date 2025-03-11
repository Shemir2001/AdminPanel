import React, { useState } from 'react';
import { firestore, app } from './Firebase.js';
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { message } from 'antd';
import { LuMessageSquarePlus } from "react-icons/lu";

const MeditationForm = () => {
  const [formData, setFormData] = useState({
    description: '',
    imageFile: null,
    title: ''
    ,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const seenBy=[]
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'imageFile') {
      const file = e.target.files[0];
      setFormData({ ...formData, imageFile: file });

      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [name]: value });
      console.log(formData);
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required.';
    if (!formData.description) newErrors.description = 'Description is required.';
    if (!formData.imageFile) newErrors.imageFile = 'Image file is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 const uploadImage = async (imageFile) => {
    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  };
  const addMeditationEntry = async (imageUrl) => {
    try {
      const docRef = await addDoc(collection(firestore, 'InAppMessaging'), {
        createdAt: serverTimestamp(),
        description: formData.description,
        imageLink: imageUrl,
        title: formData.title,
        seenBy: seenBy,
         });
      return docRef;
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  };
const updateMeditationEntry = async (docRef) => {
    try {
      await updateDoc(doc(firestore, 'InAppMessaging', docRef.id), {
        id: docRef.id,
      });
    } catch (error) {
      console.error("Error updating document ID: ", error);
      throw error;
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      description: '',
      imageFile: null,
      title: '',
    });
    setImagePreview(null);
    setErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const imageUrl = await uploadImage(formData.imageFile);
        const docRef = await addMeditationEntry(imageUrl);
        await updateMeditationEntry(docRef);
        message.success('Message Sent Successfully!');
        resetForm();
      } catch (error) {
        message.error('Error submitting the form. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full pt-5 pb-5">
      <form onSubmit={handleSubmit} className="w-full ml-72 mr-12 p-8 bg-gray-300 shadow-lg rounded-lg">
        <div className='flex'>
          <span className='pr-3 pt-1 text-3xl'>
            <LuMessageSquarePlus />
          </span>
          <h2 className="text-2xl font-semibold mb-6 text-left text-gray-800">Drop Your Messages Here</h2>
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Add Title"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter the description here..."
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            name="imageFile"
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.imageFile && <p className="text-red-500 text-xs mt-1">{errors.imageFile}</p>}
          {imagePreview && (
            <div className="mt-4 w-full max-w-xs overflow-hidden rounded-lg border">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto object-contain"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 mt-8 bg-gray-900 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default MeditationForm;
