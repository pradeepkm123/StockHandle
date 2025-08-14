import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Fav from '../assets/img/fav.png';

const defaultTheme = createTheme();
const API = 'https://stockhandle.onrender.com/api';

function Login() {
  const { login } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });

  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // Load DISTINCT roles from SignUp data on mount
  useEffect(() => {
    const loadAllRolesFromSignup = async () => {
      setRolesLoading(true);
      try {
        const res = await fetch(`${API}/users/roles`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data?.error || 'Failed to load roles');
          setRoles([]);
          return;
        }
        const list = Array.isArray(data.roles) ? data.roles : [];
        setRoles(list);
      } catch (e) {
        toast.error('Unable to load roles. Check server.');
        setRoles([]);
      } finally {
        setRolesLoading(false);
      }
    };
    loadAllRolesFromSignup();
  }, []);

  const emailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let temp = {};
    temp.email = emailValid(formData.email) ? '' : 'Email is not valid';
    temp.password = formData.password ? '' : 'Password is required';
    temp.role = formData.role ? '' : 'Role is required';
    setErrors(temp);
    return Object.values(temp).every((x) => x === '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch(`${API}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || 'Login failed');
        return;
      }
      toast.success('Login successful!');
      login({
        id: data?.user?.id,
        name: data?.user?.name,
        email: data?.user?.email,
        role: data?.user?.role,
        token: data?.token || '',
      });
      navigate('/');
    } catch (e) {
      toast.error('Server unreachable. Is backend running?');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            p: 3,
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            bgcolor: '#fff',
          }}
        >
          <img src={Fav} alt="Logo" style={{ height: 50, marginBottom: 16 }} />
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 3 }}>
            <TextField
              variant="outlined"
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
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPwd ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPwd((s) => !s)} edge="end">
                      {showPwd ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              label="Role"
              required
              fullWidth
              variant="outlined"
              margin="normal"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={rolesLoading}
              error={!!errors.role}
              helperText={errors.role || (rolesLoading ? 'Loading roles...' : 'Select your role')}
              SelectProps={{ displayEmpty: true }}
            >
              {roles.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </TextField>

            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
      <ToastContainer position="top-right" autoClose={3500} newestOnTop />
    </ThemeProvider>
  );
}

export default Login;
