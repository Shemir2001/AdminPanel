import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { firestore } from './Firebase.js';
import { collection, doc, getDoc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage'; 
import { storage } from './Firebase.js'; 
import { useParams, useNavigate } from 'react-router-dom';


export default function TextEditor() {
  const editorRef = useRef(null);
  const { id } = useParams();  
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);  
  const [initialContent, setInitialContent] = useState('');  
  const [typing, setTyping] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    if (id) {
      const fetchCardData = async () => {
        try {
          const docRef = doc(firestore, 'EditorContent', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setInitialContent(data.htmlContent);  
            setVideoUrl(data.videoUrl || '');
            setImageUrl(data.imageUrl || '');
            setIsUpdating(true);  
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching document:', error);
        }
      };
      fetchCardData();
    }
  }, [id]);

 
  const handleVideoUpload = (editor) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'video/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      const storageRef = ref(storage, `videos/${file.name}`);
try {
        await uploadBytes(storageRef, file);
        const videoURL = await getDownloadURL(storageRef);

        editor.insertContent(`
          <div>
            <video width="100%" controls style="margin-bottom: 20px;"
            poster="https://firebasestorage.googleapis.com/v0/b/rbb-app-46ada.appspot.com/o/images%2Fplaceholder.jpeg?alt=media&token=d83e053e-e2eb-48cf-9ffb-c2ed5a629c04"
         
              <source src="${videoURL}" type="video/mp4">
            </video>
          </div>
        `);

        setVideoUrl(videoURL);
      } catch (error) {
        console.error('Error uploading video:', error);
        alert('Video upload failed!');
      }
    };
  };


  const handleImageUpload = (editor) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const storageRef = ref(storage, `images/${file.name}`);

      try {
        await uploadBytes(storageRef, file);
        const imageURL = await getDownloadURL(storageRef);

        editor.insertContent(`
          <div  style= "  
          width: 100%;
          border-radius: 8px;
          margin: 0 auto; text-align: center; position: relative; ">
            <img src="${imageURL}" alt="${file.name}" style="width: 100%; object-fit: contain;"  />
          </div>
        `);
        
        setImageUrl(imageURL);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Image upload failed!');
      }
    };
  };
   const uploadContentToFirebase = async () => {
    const editorContent = editorRef.current.getContent();
if (!editorContent) {
      alert('No content to upload!');
      return;
    }
 const documentData = {
      htmlContent: editorContent,
      createdAt: isUpdating ? undefined: serverTimestamp(),
      videoUrl: videoUrl,
      imageUrl: imageUrl,
      lastUpdated: serverTimestamp(),
    };
    try {
      if (isUpdating) {
        
        const docRef = doc(firestore, 'EditorContent', id);
        await updateDoc(docRef, documentData);
        alert('Content updated successfully!');
      } else {
       
        await addDoc(collection(firestore, 'EditorContent'), documentData);
        alert('Content uploaded to Firestore successfully!');
      }

      
      navigate('/');
    } catch (error) {
      console.error('Error adding/updating document in Firestore:', error);
      alert('Failed to upload content to Firestore.');
    }
  };
 return (
    <div className='top' style={{ marginLeft: '300px', marginTop: '20px' }}>
      <div style={{
        backgroundColor: '#1F1838',
        width: '95%',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        marginRight: '20px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}>
        <h1 style={{ margin: '0', color: '#ffff', fontSize: '24px' }}>
          {isUpdating ? 'Edit Content' : 'Content Editor'}
        </h1>
        <p style={{ margin: '10px 0 0 0', color: '#ffff', fontSize: '16px' }}>
          {isUpdating ? 'Update your content here' : 'Create new content with ease!'}
        </p>
      </div>
<div className='editor'>
      <Editor onChange={()=>setTyping(false)}
        apiKey="lvfb63grznvkxekhjjmnwcdmr3mm1m7hdpls0kog0fen6njz"
        onInit={(evt, editor) => editorRef.current = editor}
        init={{
          height: '400px',
          width: '1000px',

          backgroundColor:'#a5a3af',
          text:'white',
          plugins: [
            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
            'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste',
            'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown'
          ],
          content_style: `
      body {
        background-color: #352f4c;  /* Editor background color */
        color: white;               /* Text color */
      }
      p, h1, h2, h3, h4, h5, h6 {
        color: white;               /* Text color for headings and paragraphs */
      }
      a {
        color: #FFBD23;             /* Custom link color */
      }

       /* Media content styles */
  .media-content img, 
  .media-content video {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 0 auto 20px auto;
  }
@media (max-width :375 px){
          .top{
          height:100%;
          width: 50%;
          }
          
}
  /* Video player to fill width */
  video {
    width: 100% !important;
    height: auto !important;
  }
    .media-content {
        
    }
  /* Styles specifically for screens with 384px width */
  @media (width: 400px ) {
    /* Ensure images and videos are full width */
    .media-content img, 
    .media-content video {
      max-width: 100%;
      height: auto;
    }


    /* Adjust text size for this screen size */
    p, h1, h2, h3, h4, h5, h6 {
      font-size: 50px;  /* Increase font size for 384px screens */
      color: pink !important;  /* Keep text white */
    }

    /* Force links to have a lighter color */
    a {
      color: #FFBD23;
    }

  }
    
    `,
          toolbar: 'customUploadVideoButton customUploadImageButton | undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
          images_upload_handler: handleImageUpload,
          file_picker_types: 'image media',
          image_title: true,
          automatic_uploads: true,
          media_live_embeds: true,
          setup: (editor) => {
            editor.ui.registry.addButton('customUploadVideoButton', {
              text: 'Upload Video',
              icon: 'video',
              onAction: () => handleVideoUpload(editor),
            });
            editor.ui.registry.addButton('customUploadImageButton', {
              text: 'Upload Image',
              icon: 'image',
              onAction: () => handleImageUpload(editor),
            });
          },
        }}
        initialValue={initialContent || typing ? 'Write your content here...!' : ''} 
      />
</div>
      <div className="flex justify-center mb-4">
        <button onClick={uploadContentToFirebase} className="mt-4 p-2 bg-[#BD23FF] text-white rounded">
          {isUpdating ? 'Update Content' : 'Upload Edited Content'}
        </button>
      </div>
    </div>
  );
}
