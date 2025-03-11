import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import {app} from './Firebase.js';
import { firestore } from './Firebase.js';
import { addDoc, collection } from 'firebase/firestore';
const KidsCoachForm = () => {
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    duration: '',
    ageGroup: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <Container 
      // maxWidth="md" 
      height="100%"
      sx={{ 
        mt: { xs: 4, md: 4 }, // Margin top for mobile and desktop
        mb: 4,
    
        ml: { xs:'250px', md: '300px' }, // Space from the sidebar on larger screens
        pr: { xs: 0, md: 2 }, // Padding for the right margin
        width: {md: '75%'},
        height: '100%',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: '#1F1838',
          p: { xs: 2, sm: 4 }, // Adjust padding for mobile/tablets
          borderRadius: 2,
          boxShadow: 2,
          width: {md: '100%'},
        }}
      >
        <Typography className='text-white' variant="h5" gutterBottom>
          Kids Coach - Mindfulness Topic Form
        </Typography>

        <TextField
  fullWidth
  label="Topic"
  name="topic" 
  value={formData.topic}
  onChange={handleChange}
  sx={{ my: 2, '& .MuiInputBase-input': { color: 'white' } }} // Set text color to white
  InputLabelProps={{
    style: { color: 'white' }, // Set label color to white
  }}
  required
/>


        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          InputLabelProps={{
            style: { color: 'white' }, // Set label color to white
          }}
          sx={{ my: 2 }}
          required
        />

        <TextField
          fullWidth
          label="Recommended Duration (in minutes)"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          type="number"
          sx={{ my: 2, '& .MuiInputBase-input': { color: 'white' }  }}
          InputLabelProps={{
            style: { color: 'white' }, // Set label color to white
          }}
        />

        <TextField
          fullWidth
          label="Recommended Age Group"
          name="ageGroup"
          value={formData.ageGroup}
          onChange={handleChange}
          sx={{ my: 2 }}
          InputLabelProps={{
            style: { color: 'white' }, // Set label color to white
          }}
        />

<Button 
  variant="contained" 
  type="submit" 
  sx={{ 
    mt: 3, 
    width: '100%', 
    backgroundColor: '#BD23FF',
    color: 'white', 
    '&:hover': {
      backgroundColor: '#9F1D9C', 
    }
  }}
>
  Submit Topic
</Button>

      </Box>
    </Container>
  );
};

export default KidsCoachForm;
