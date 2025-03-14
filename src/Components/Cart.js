import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ For navigation
import { Container, Card, CardContent, CardMedia, Typography, IconButton, Button, Grid, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize navigation

  // ✅ Get logged-in user's email from localStorage
  const userEmail = localStorage.getItem("userEmail");

  // ✅ Fetch Cart Items
  const fetchCartItems = useCallback(async () => {
    if (!userEmail) return;
    try {
      const response = await axios.get(`https://localhost:7092/api/Cart/List/${userEmail}`);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // ✅ Delete Item from Cart
  const deleteItem = async (orderID) => {
    try {
      await axios.delete(`https://localhost:7092/api/Cart/Delete/${orderID}`);
      setCartItems((prevItems) => prevItems.filter(item => item.orderID !== orderID));
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  // ✅ Place Order API Call
  const placeOrder = async () => {
    if (!userEmail) {
      alert("User not logged in!");
      return;
    }

    if (cartItems.length === 0) {
      alert("Cart is empty. Add items before placing an order!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`https://localhost:7092/api/Orders/PlaceOrder/${userEmail}`);

      if (response.status === 200) {
        alert("Order placed successfully!");
        navigate("/myorders"); // ✅ Redirect to MyOrders page
      } else {
        alert("Failed to place order. Try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calculate Total Price
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        {/* ✅ Left Side - Cart Items */}
        <Grid item xs={12} md={8}>
          {cartItems.length === 0 ? (
            <Typography textAlign="center">Your cart is empty</Typography>
          ) : (
            cartItems.map((item) => (
              <Card key={item.orderID} sx={{ display: "flex", alignItems: "center", p: 2, mb: 2 }}>
                {/* ✅ Image (Small Size) */}
                <CardMedia
                  component="img"
                  sx={{ width: 80, height: 80, objectFit: "contain", marginRight: 2 }}
                  image={`/images/${item.imageurl}`}
                  alt={item.equipments}
                />
                
                {/* ✅ Item Details */}
                <CardContent sx={{ flex: "1" }}>
                  <Typography variant="h6">{item.equipments}</Typography>
                  <Typography variant="body2">{item.description}</Typography>
                  <Typography variant="body1" fontWeight="bold">Price: ₹{item.price}</Typography>
                  <Typography fontWeight="bold">Total: ₹{item.price * item.quantity}</Typography>
                  {/* ✅ Show Selected Quantity */}
                  <Typography color="primary" sx={{ fontSize: "1rem", fontWeight: "bold" }}>
                    Selected Quantity: {item.quantity}
                  </Typography>
                </CardContent>

                {/* ✅ Delete Button */}
                <IconButton color="error" onClick={() => deleteItem(item.orderID)}>
                  <DeleteIcon />
                </IconButton>
              </Card>
            ))
          )}
        </Grid>

        {/* ✅ Right Side - "Place Order" Section */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" textAlign="center" gutterBottom>
              Order Summary
            </Typography>

            <Typography variant="body1"><strong>Items in Cart:</strong> {cartItems.length}</Typography>
            <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
              Total Price: ₹{totalPrice}
            </Typography>

            {/* ✅ Place Order Button */}
            <Box textAlign="center" sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={placeOrder}
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
