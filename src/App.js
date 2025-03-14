import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Container, Box } from "@mui/material";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Equipments from "./Components/Equipments";
import Cart from "./Components/Cart";
import Myorders from "./Components/Myorders";

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const userName = localStorage.getItem("userName");
      const userEmail = localStorage.getItem("userEmail");
      setIsLoggedIn(!!userName && !!userEmail);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Hide navbar if on login or register page
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Show Navbar only if NOT on login or register page */}
      {!isLoginPage && !isRegisterPage && isLoggedIn && (
        <AppBar 
          position="static" 
          sx={{ 
            background: "linear-gradient(135deg, #1e3c72, #2a5298)",
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography 
              variant="h5" 
              component={Link} 
              to="/" 
              sx={{ 
                textDecoration: "none",
                color: "white", 
                fontWeight: "bold",
                "&:hover": { color: "#f8c471" },
              }}
            >
              FIT F@CTORY 🏋️‍♂️
            </Typography>

            <Box>
              <Button component={Link} to="/equipments" sx={navButtonStyle}>
                Equipments
              </Button>
              <Button component={Link} to="/cart" sx={navButtonStyle}>
                Cart
              </Button>
              <Button component={Link} to="/myorders" sx={navButtonStyle}>
                My Orders
              </Button>
              <Button onClick={handleLogout} sx={logoutButtonStyle}>
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Show only the Login button on Register Page */}
      {isRegisterPage && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button 
            component={Link} 
            to="/login" 
            sx={{
              fontSize: "18px",
              backgroundColor: "#1e3c72",
              color: "white",
              padding: "10px 20px",
              borderRadius: "10px",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#2a5298" },
            }}
          >
            Already have an account? Login
          </Button>
        </Box>
      )}

      {/* Page Content */}
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

          {isLoggedIn ? (
            <>
              <Route path="/equipments" element={<Equipments />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/myorders" element={<Myorders />} />
              <Route path="/" element={<Navigate to="/equipments" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </Container>
    </Box>
  );
}

/* Reusable Button Styles */
const navButtonStyle = {
  color: "white",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  borderRadius: "20px",
  padding: "6px 16px",
  margin: "0 8px",
  fontWeight: "bold",
  transition: "0.3s ease",
  "&:hover": { backgroundColor: "#f8c471", color: "#333" },
};

const logoutButtonStyle = {
  ...navButtonStyle,
  backgroundColor: "#ff4d4d",
  "&:hover": { backgroundColor: "#cc0000", color: "white" },
};

export default App;
