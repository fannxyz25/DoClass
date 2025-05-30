import React, { useState } from 'react';
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled
} from '@mui/material';
import axios from 'axios';

// Membuat komponen TextField custom dengan styling rounded
const RoundedTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#1976d2',
      },
    },
  },
});

// Membuat komponen Select custom dengan styling rounded
const RoundedSelect = styled(Select)({
  borderRadius: '10px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: '10px',
  },
});

// Membuat komponen Button custom dengan animasi hover dan warna biru
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  padding: '10px 20px',
  fontSize: '1rem',
  textTransform: 'none',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: '#1976d2',
  color: 'white',
  '&:hover': {
    backgroundColor: '#2196f3',
    transform: 'scale(1.02)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  '&:active': {
    backgroundColor: '#1565c0',
  },
}));

const Login = () => {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
    // Reset form data when switching tabs
    setFormData({
      email: '',
      username: '',
      password: '',
      role: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = tab === 0 ? '/api/signin' : '/api/signup';
      const dataToSend = tab === 0 
        ? { email: formData.email, password: formData.password }
        : formData;
      
      const response = await axios.post(`http://localhost:5000${endpoint}`, dataToSend);
      console.log(response.data);
      // Handle successful login/signup here
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          width: '45%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            width: '90%',
            height: '90%',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
            bgcolor: 'white',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '400px',
              mt: 4,
            }}
          >
            <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>

            <form onSubmit={handleSubmit}>
              {tab === 1 && (
                <>
                  <RoundedTextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel id="role-label">Role</InputLabel>
                    <RoundedSelect
                      labelId="role-label"
                      id="role"
                      name="role"
                      value={formData.role}
                      label="Role"
                      onChange={handleChange}
                    >
                      <MenuItem value="guru">Guru</MenuItem>
                      <MenuItem value="siswa">Siswa</MenuItem>
                    </RoundedSelect>
                  </FormControl>
                </>
              )}
              <RoundedTextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
              />
              <RoundedTextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete={tab === 0 ? "current-password" : "new-password"}
                value={formData.password}
                onChange={handleChange}
              />
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
              <StyledButton
                type="submit"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
              >
                {tab === 0 ? 'Sign In' : 'Sign Up'}
              </StyledButton>
            </form>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login; 