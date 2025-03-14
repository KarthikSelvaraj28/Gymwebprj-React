import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    TextField, Button, Card, CardContent, Typography, 
    Box, Alert, CircularProgress 
} from "@mui/material";
import { motion } from "framer-motion";

const Login = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const response = await fetch("https://localhost:7092/api/User/Login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }
    
            // Save login info and navigate immediately
            localStorage.setItem("userName", data.fullname || "");
            localStorage.setItem("userEmail", email);
            setIsLoggedIn(true);
            navigate("/equipments"); // 🔹 Redirect immediately
    
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Box 
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #ffffff, #f3f4f6)",
                padding: "20px",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <Card 
                    sx={{
                        width: 400,
                        padding: 4,
                        borderRadius: "12px",
                        backgroundColor: "#ffffff",
                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
                        textAlign: "center",
                    }}
                >
                    <CardContent>
                        <Typography 
                            variant="h5" 
                            fontWeight="bold" 
                            sx={{ mb: 2, color: "#333" }}
                        >
                            Welcome Back 👋
                        </Typography>

                        {message && (
                            <Alert 
                                severity={message.includes("successful") ? "success" : "error"} 
                                sx={{ mb: 2 }}
                            >
                                {message}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Email"
                                type="email"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Button 
                                type="submit" 
                                variant="contained" 
                                fullWidth 
                                sx={{
                                    mt: 3, 
                                    py: 1.5, 
                                    fontSize: "16px", 
                                    fontWeight: "bold", 
                                    backgroundColor: "#007BFF",
                                    "&:hover": { backgroundColor: "#0056b3" }
                                }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Login"}
                            </Button>
                        </form>

                        <Typography variant="body2" sx={{ mt: 3, color: "#666" }}>
                            New user? <Link to="/register" style={{ color: "#007BFF", fontWeight: "bold" }}>Register here</Link>
                        </Typography>
                    </CardContent>
                </Card>
            </motion.div>
        </Box>
    );
};

export default Login;
