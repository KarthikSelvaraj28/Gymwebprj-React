import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Box,
  InputAdornment,
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

  const [message, setMessage] = useState(""); // State for success/error message
  const [error, setError] = useState(""); // State for input errors

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear previous error message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const formattedDob = new Date(formData.dob).toISOString(); // Convert date format

    try {
      // Check if email already exists before sending request
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

      // Proceed with registration if email is not found
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

      // Clear form after successful submission
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
    <Container maxWidth="sm">
      <Paper elevation={5} sx={{ padding: 4, borderRadius: 3, marginTop: 5 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Register
        </Typography>
        {message && (
          <Typography variant="subtitle1" color="success" textAlign="center">
            {message}
          </Typography>
        )}
        {error && (
          <Typography variant="subtitle1" color="error" textAlign="center">
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
            color="primary"
            fullWidth
            sx={{ padding: 1.5, fontSize: "1rem" }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
