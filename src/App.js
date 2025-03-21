import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Container, Box, TextField, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Equipments from "./Components/Equipments";
import Cart from "./Components/Cart";
import Myorders from "./Components/Myorders";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Check login status
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

  // Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItemCount(cartItems.length);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);

    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <Box sx={{ flexGrow: 1 }}>
      {!isLoginPage && !isRegisterPage && (
        <AppBar 
          position="sticky" 
          sx={{ 
            background: "#ffffff", 
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "10px 0",
            zIndex: 1100
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography 
              variant="h5" 
              component={Link} 
              to="/" 
              sx={{ 
                textDecoration: "none",
                color: "#333", 
                fontWeight: "bold",
                fontFamily: "Poppins, sans-serif",
                letterSpacing: "1px",
                "&:hover": { color: "#ff6f61" },
              }}
            >
              FIT F@CTORY 🏋️‍♂️
            </Typography>

            {location.pathname === "/equipments" && (
              <TextField
                variant="outlined"
                placeholder="Search for products..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: "250px",
                  backgroundColor: "#f1f1f1",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            )}

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button component={Link} to="/equipments" sx={navButtonStyle}>
                Equipments
              </Button>
              <Button component={Link} to="/myorders" sx={navButtonStyle}>
                My Orders
              </Button>
              <Button component={Link} to="/cart" sx={navButtonStyle}>
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCartIcon sx={{ fontSize: "24px" }} />
                </Badge>
              </Button>
              {isLoggedIn ? (
                <Button onClick={handleLogout} sx={logoutButtonStyle}>
                  Logout
                </Button>
              ) : (
                <Button component={Link} to="/login" sx={loginButtonStyle}>
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {isRegisterPage && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button 
            component={Link} 
            to="/login" 
            sx={loginButtonStyle}
          >
            Already have an account? Login
          </Button>
        </Box>
      )}

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/equipments" element={<Equipments searchQuery={searchQuery} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/myorders" element={<Myorders />} />
          
          {/* Redirect to Equipments first */}
          <Route path="/" element={<Navigate to="/equipments" />} />

          {/* Redirect to login only if cart has items */}
          <Route
            path="*"
            element={
              cartItemCount > 0 && !isLoggedIn ? <Navigate to="/login" replace /> : <Navigate to="/equipments" />
            }
          />
        </Routes>
      </Container>
    </Box>
  );
}

const navButtonStyle = {
  color: "#333",
  backgroundColor: "transparent",
  borderRadius: "8px",
  padding: "8px 16px",
  margin: "0 8px",
  fontWeight: "bold",
  fontSize: "16px",
  transition: "0.3s ease",
  "&:hover": { backgroundColor: "#ff6f61", color: "white" },
};

const logoutButtonStyle = {
  ...navButtonStyle,
  backgroundColor: "#ff4d4d",
  "&:hover": { backgroundColor: "#cc0000", color: "white" },
};

const loginButtonStyle = {
  fontSize: "18px",
  backgroundColor: "#1e3c72",
  color: "white",
  padding: "10px 20px",
  borderRadius: "10px",
  fontWeight: "bold",
  "&:hover": { backgroundColor: "#2a5298" },
};

export default App;
