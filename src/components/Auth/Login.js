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

export default function SignIn() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'Name') {
      setName(value);
      setUsernameError(value ? '' : 'Username is required');
    } else if (name === 'Password') {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nameError && !passwordError) {
      try {
        const formData = new FormData();
        formData.append('Name', name);
        formData.append('Password', password);

        const response = await apiClient.post("/api/Authentication/login", formData, {
          headers: {
            "Accept": "application/json",
          },
        });

        if (response.status === 200) {

          localStorage.setItem('token', response.data);
          navigate('/dashboard');
          
        }
      } catch (error) {
        toast.error("Invalid credentials", {
          position: toast.POSITION.BOTTOM_RIGHT
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
            Sign in
          </Typography>
          <form onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="Name"
              label="Name"
              name="Name"
              autoComplete="Name"
              value={name}
              onChange={handleInputChange}
              error={!!nameError}
              helperText={nameError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="Password"
              label="Password"
              type="password"
              id="Password"
              autoComplete="current-password"
              value={password}
              onChange={handleInputChange}
              error={!!passwordError}
              helperText={passwordError}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={!name || !password}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <NavLink href="#" variant="body2">
                  Forgot password?
                </NavLink>
              </Grid>
              <Grid item justifyContent="flex-end">
                <NavLink to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </NavLink>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
}
