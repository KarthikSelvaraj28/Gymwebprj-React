import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Box,
  InputAdornment,
  Link,
} from "@mui/material";
import { Person, Email, Lock, CalendarToday, Home } from "@mui/icons-material";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    dob: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const formattedDob = new Date(formData.dob).toISOString();

    try {
      const checkResponse = await fetch(
        `https://localhost:7092/api/User/CheckEmail?email=${formData.email}`
      );

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        if (checkData.exists) {
          setError("Email already registered! Use a different email.");
          return;
        }
      }

      const response = await fetch("https://localhost:7092/api/User/Register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: formData.fullname,
          email: formData.email,
          password: formData.password,
          dob: formattedDob,
          address: formData.address,
        }),
      });

      if (response.status === 409) {
        setError("Email already registered! Use a different email.");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json().catch(() => null);
      setMessage("User registered successfully!");
      console.log("Registration successful:", data);

      setFormData({
        fullname: "",
        email: "",
        password: "",
        dob: "",
        address: "",
      });
    } catch (error) {
      console.error("Error:", error);
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="md" sx={{
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      background: "linear-gradient(to right, #ff6f61, #de425b)",
    }}>
      <Paper elevation={5} sx={{ padding: 4, borderRadius: 3, maxWidth: 500, width: "100%", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          Create an Account
        </Typography>
        {message && (
          <Typography variant="subtitle1" color="success" gutterBottom>
            {message}
          </Typography>
        )}
        {error && (
          <Typography variant="subtitle1" color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              error={Boolean(error)}
              helperText={error}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box mb={3}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Home />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#ff6f61",
              color: "white",
              padding: "12px 20px",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "8px",
              width: "100%",
              "&:hover": { backgroundColor: "#de425b" },
            }}
          >
            Sign Up
          </Button>
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            Already have an account?{' '}
            <Link href="/login" sx={{ color: "#ff6f61", fontWeight: "bold", textDecoration: "none", '&:hover': { textDecoration: "underline" } }}>
              Sign in here
            </Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;