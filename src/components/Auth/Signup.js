import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../Api';
import { useNavigate,NavLink } from 'react-router-dom';

const defaultTheme = createTheme();

export default function SignUp() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'name') {
      setName(value);
      if (!value) {
        setNameError('Name is required');
      } 
      else if (value.length < 10 || value.length > 50) {
        setNameError('Name must be between 10 and 50 characters');
      } else {
        setNameError('');
      }
    }
    else if (name === 'email'){
      setEmail(value);
      setEmailError(value ? '' : 'Email is required');
      setEmailError(value ? (validateEmail(value) ? '' : 'Email invalid') : 'Email is required');
    }
    else if (name === 'password') {
      setPassword(value);
      if (!value) {
        setPasswordError('Password is required');
      } else if (value.length < 6) {
        setPasswordError('Password must be at least 6 characters');
      } else if (value.length > 20) {
        setPasswordError('Password cannot exceed 20 characters');
      } else {
        setPasswordError('');
      }
    }

  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!nameError  && !emailError && !passwordError) {
      let response;
      try {
        const userData = {
          name: name,
          // lastName: lastName,
          email: email,
          password: password,
          type: "1"
        };

        response = await apiClient.post("/api/Users/register", userData, {
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json-patch+json"
          },
        });
        if (response.status === 201) {
           // Reset the form fields
          setName('');
          setEmail('');
          setPassword('');
          toast.success('Sign up successful!', {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          const formData = new FormData();
          formData.append('Name', userData.name);
          formData.append('Password', userData.password);
          const response = await apiClient.post("/api/Authentication/login", formData, {
            headers: {
              "Accept": "application/json",
            },

          });
          if (response.status === 200) {

            localStorage.setItem('token', response.data);
            navigate('/dashboard');
            
          }
        } else if (response.status === 400 || response.status === 409) {
          const errorMessage = response.data;
          toast.error(errorMessage, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        } else {
          toast.error('Error signing up', {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }
       
      } catch (error) {
        toast.error(error.response.data, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  value={name}
                  onChange={handleInputChange}
                  error={!!nameError}
                  helperText={nameError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleInputChange}
                  error={!!emailError}
                  helperText={emailError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={handleInputChange}
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!name || !email || ! password}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <NavLink to="/" variant="body2">
                  Already have an account? Sign in
                </NavLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
}
