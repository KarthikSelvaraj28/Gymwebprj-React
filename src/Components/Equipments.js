import React, { useEffect, useState } from "react";
import { 
    Container, Grid, Card, CardContent, CardMedia, Typography, 
    Button, CircularProgress, Dialog, DialogTitle, DialogContent, 
    IconButton, Box, TextField 
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Equipments = () => {
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("userEmail"); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://localhost:7092/api/Equipments/List");
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
                const data = await response.json();
                setEquipments(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const handleSelect = (equipment) => {
        setSelectedEquipment(equipment);
        setQuantity(1); // Reset quantity when opening modal
        setOpen(true);
    };

    const handleQuantityChange = (e) => {
        let value = parseInt(e.target.value) || 1;
        setQuantity(value < 1 ? 1 : value); // Ensure quantity is at least 1
    };

    const handleAddToCart = async () => {
        if (!selectedEquipment) return;
        if (!userEmail) {
            alert("Please log in to add items to the cart.");
            return;
        }
    
        const cartItem = {
            orderID: Math.floor(Math.random() * 1000), 
            productID: selectedEquipment.id,
            equipments: selectedEquipment.equipments, 
            description: selectedEquipment.description,
            quantity,
            totalPrice: selectedEquipment.price * quantity,
            userEmail, 
            orderDate: new Date().toISOString().split("T")[0]
        };
    
        try {
            const response = await fetch("https://localhost:7092/api/Cart/Add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cartItem),
            });

            if (!response.ok) throw new Error("Failed to add item to cart.");

            alert(`${quantity} x ${selectedEquipment.equipments} added to cart!`);
            setOpen(false);
            navigate("/cart");
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add to cart.");
        }
    };

    const handleBuyNow = () => {
        if (!selectedEquipment) return;
        if (!userEmail) {
            alert("Please log in to proceed with the purchase.");
            return;
        }

        navigate(`/checkout?productID=${selectedEquipment.id}&quantity=${quantity}&total=${selectedEquipment.price * quantity}`);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" textAlign="center" gutterBottom sx={{ fontWeight: "bold", color: "#2E3B55" }}>
                🏋️‍♂️ Equipments List
            </Typography>
            
            {loading ? (
                <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />
            ) : (
                <Grid container spacing={3}>
                    {equipments.map((equipment) => (
                        <Grid item xs={12} sm={6} md={4} key={equipment.id}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Card 
                                    sx={{ 
                                        maxWidth: 320, 
                                        mx: "auto", 
                                        borderRadius: 4, 
                                        boxShadow: 6, 
                                        background: "#f8f9fa",
                                        transition: "0.3s",
                                        "&:hover": { transform: "scale(1.03)", boxShadow: "0px 8px 24px rgba(0,0,0,0.2)" }
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={`/images/${equipment.imageurl}`}
                                        alt={equipment.equipments}
                                        sx={{ objectFit: "contain", padding: "10px", background: "#fff", borderRadius: "8px" }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom textAlign="center" sx={{ fontWeight: "bold", color: "#333" }}>
                                            {equipment.equipments}
                                        </Typography>
                                        <Typography variant="body1" textAlign="center" color="primary" fontWeight="bold">
                                            ₹{equipment.price}
                                        </Typography>
                                        <Grid container justifyContent="center" alignItems="center">
                                            <IconButton color="primary" onClick={() => handleSelect(equipment)}>
                                                <VisibilityIcon />
                                                <Typography variant="body2" sx={{ ml: 1 }}>View</Typography>
                                            </IconButton>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}
            
            {/* ✅ Product Details Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} sx={{ backdropFilter: "blur(5px)" }}>
                <DialogTitle textAlign="center" sx={{ fontWeight: "bold", color: "#2E3B55" }}>
                    {selectedEquipment?.equipments} Details
                </DialogTitle>
                <DialogContent>
                    <Box textAlign="center">
                        {selectedEquipment && (
                            <CardMedia
                                component="img"
                                height="220"
                                image={`/images/${selectedEquipment.imageurl}`}
                                alt={selectedEquipment.equipments}
                                sx={{ objectFit: "contain", marginBottom: "10px", borderRadius: "10px" }}
                            />
                        )}
                    </Box>
                    <Typography sx={{ fontWeight: "bold", color: "#555" }}>
                        <strong>Description:</strong> {selectedEquipment?.description}
                    </Typography>

                    {/* ✅ Quantity Selection */}
                    <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                        <Button variant="contained" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} sx={{ minWidth: "40px", borderRadius: "50%", fontSize: "20px", mr: 1 }}>−</Button>
                        <TextField type="number" variant="outlined" size="small" sx={{ maxWidth: "80px", "& input": { textAlign: "center" } }} value={quantity} onChange={handleQuantityChange} />
                        <Button variant="contained" onClick={() => setQuantity((prev) => prev + 1)} sx={{ minWidth: "40px", borderRadius: "50%", fontSize: "20px", ml: 1 }}>+</Button>
                    </Box>
                    
                    <Button variant="contained" fullWidth sx={{ mt: 2, borderRadius: "25px" }} onClick={handleAddToCart} startIcon={<ShoppingCartIcon />}>Add to Cart</Button>
                    <Button variant="contained" fullWidth sx={{ mt: 2, borderRadius: "25px", backgroundColor: "#ff5722" }} onClick={handleBuyNow} startIcon={<LocalMallIcon />}>Buy Now</Button>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default Equipments;
