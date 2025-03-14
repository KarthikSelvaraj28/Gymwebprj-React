import React, { useEffect, useState, useCallback } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Card, CardMedia, CardContent, Grid
} from "@mui/material";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const userEmail = localStorage.getItem("userEmail");

    useEffect(() => {
        if (!userEmail) {
            setError("User email not found. Please log in.");
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch(`https://localhost:7092/api/Orders/List/${encodeURIComponent(userEmail)}`);
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: No orders found!`);
                }
                let data = await response.json();

                // Sort orders by orderDate in descending order (recent first)
                data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userEmail]);

    const openOrderModal = useCallback((order) => {
        setSelectedOrder(order);
    }, []);

    const closeOrderModal = useCallback(() => {
        setSelectedOrder(null);
    }, []);

    if (loading) return <Typography>Loading orders...</Typography>;
    if (error) return <Typography color="error">❌ {error}</Typography>;

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>My Orders</Typography>
            {orders.length === 0 ? (
                <Typography>No orders found.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Order ID</strong></TableCell>
                                <TableCell><strong>Quantity</strong></TableCell>
                                <TableCell><strong>Total Price</strong></TableCell>
                                <TableCell><strong>Order Date</strong></TableCell>
                                <TableCell><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.orderID}>
                                    <TableCell>{order.orderID}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>₹{order.totalPrice.toFixed(2)}</TableCell>
                                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => openOrderModal(order)}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Order Details Modal */}
            <Dialog 
                open={Boolean(selectedOrder)} 
                onClose={closeOrderModal} 
                fullWidth 
                maxWidth="md"
            >
                <DialogTitle>Order Details</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <Paper elevation={3} sx={{ p: 3, bgcolor: "#f9f9f9", borderRadius: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6">Order ID:</Typography>
                                    <Typography>{selectedOrder.orderID}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6">Customer Name:</Typography>
                                    <Typography>{selectedOrder.customerName || "N/A"}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6">Email:</Typography>
                                    <Typography>{selectedOrder.userEmail}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6">Order Date:</Typography>
                                    <Typography>{new Date(selectedOrder.orderDate).toLocaleDateString()}</Typography>
                                </Grid>
                            </Grid>

                            {selectedOrder.products?.map((product, index) => (
                                <Card 
                                    key={index} 
                                    sx={{ 
                                        display: "flex", 
                                        mb: 2, 
                                        p: 2, 
                                        borderRadius: 3, 
                                        boxShadow: 4, 
                                        backgroundColor: "#ffffff" 
                                    }}
                                >
                                    {/* Product Image */}
                                    <CardMedia
                                        component="img"
                                        image={product.imageurl !== "N/A" ? `/images/${product.imageurl}` : "https://via.placeholder.com/150"}
                                        alt={product.equipments}
                                        sx={{ 
                                            width: 130, 
                                            height: 130, 
                                            objectFit: "cover", 
                                            borderRadius: 2, 
                                            mr: 2, 
                                            boxShadow: 3 
                                        }}
                                    />

                                    {/* Product Details */}
                                    <CardContent sx={{ flex: 1 }}>
                                        <Typography variant="h6" fontWeight="bold" color="primary">
                                            {product.equipments}
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary" gutterBottom>
                                            {product.description || "No description available"}
                                        </Typography>
                                        <Typography>
                                            <strong>Quantity:</strong> {product.quantity}
                                        </Typography>
                                        <Typography color="success.main">
                                            <strong>Single Price:</strong> ₹{product.price?.toFixed(2) || "N/A"}
                                        </Typography>
                                        <Typography color="error.main">
                                            <strong>Total Price:</strong> ₹{(product.price * product.quantity)?.toFixed(2) || "N/A"}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}

                            <Typography variant="h4" align="right" sx={{ mt: 3, fontWeight: "bold" }}>
                                Total Amount: ₹{selectedOrder.products.reduce((sum, p) => sum + (p.price * p.quantity || 0), 0).toFixed(2)}
                            </Typography>
                        </Paper>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeOrderModal} color="secondary" variant="contained">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default MyOrders;
