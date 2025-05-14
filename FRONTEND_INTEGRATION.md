# Frontend Integration Guide

This guide explains how to integrate the backend API with your React frontend.

## API Endpoints Structure

The API is organized into two main sections:
- **Website User Endpoints** (`/api/auth/*` and `/api/orders/*`)
- **Admin Endpoints** (`/api/admin/*`)

## Authentication

All requests to protected endpoints need to include an Authorization header with a Bearer token:

```
Authorization: Bearer <your_token>
```

### Getting and Storing the Token

After a successful login, the API returns an access token. You should store this token in localStorage:

```javascript
// Login example
const loginUser = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    
    const { accessToken, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { success: true, user };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Login failed' 
    };
  }
};
```

### Making Authenticated Requests

For any API call that requires authentication, include the token in the request headers:

```javascript
const getMyOrders = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return { success: true, orders: response.data.orders };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch orders' 
    };
  }
};
```

## Example Integration for Order Creation from the Checkout Component

Update your `Checkout.jsx` component to use the user's access token:

```javascript
// Inside Checkout.jsx - handleProceedToPay function

const handleProceedToPay = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please login to continue");
      navigate('/login'); // Redirect to login if no token
      return;
    }

    // Form validation
    if (!formData.venueAddress.trim()) {
      alert("Please enter venue address");
      return;
    }
    // Other validations...

    // Prepare order data
    const orderData = {
      // Service Details
      serviceName: serviceName,
      basePrice: basePrice,
      
      // Customer provided details
      venueAddress: formData.venueAddress.trim(),
      source: selectSource,
      occasion: formData.occasion,
      alternateContact: formData.altMobile.trim(),
      
      // Delivery Details
      pincode: pincode,
      deliveryCharges: deliveryCharges,
      
      // Date and Time
      date: selectedDate ? formatDate(selectedDate) : null,
      timeSlot: selectedTimeSlot,
      
      // Addons and Colors
      balloonColors: balloonColors || [],
      addons: selectedAddons.map(addon => ({
        name: addon.name,
        price: parseInt(addon.price) || 0,
        quantity: parseInt(addon.quantity) || 0
      })) || [],
      
      // Payment Details
      totalAmount: finalTotal,
      couponApplied: selectedCoupon || null,
      paymentPercentage: selectedPayPercentage,
      paidAmount: amountToPay,
      duePayment: selectedPayPercentage === "50" ? amountToPay : 0,
      grandTotal: finalTotal,
      paymentMethod: "UPI", // You can make this selectable if needed
      
      // Preferences
      whatsappNotifications: selectedNotification
    };

    // Make the API call to the customer order endpoint
    const response = await axios.post("http://localhost:5000/api/orders", orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.data.success) {
      console.log("Order created successfully:", response.data);
      alert("Order created successfully!");
      // Reset form and state
      setFormData({
        venueAddress: '',
        source: '',
        occasion: '',
        altMobile: ''
      });
      setSelectedCoupon("");
      setSelectedNotification(false);
      dispatch(resetOrder());
      navigate('/order-success'); // Navigate to success page
    }
  } catch (error) {
    console.error("Error creating order:", error.response?.data || error.message);
    alert("Failed to create order. Please try again.");
  }
};
```

## Profile Management Integration

Here's an example of how to fetch and update a user's profile:

```javascript
// Fetch user profile
const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.get('http://localhost:5000/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return { success: true, profile: response.data.user };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch profile' 
    };
  }
};

// Update user profile
const updateUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.put('http://localhost:5000/api/auth/profile', profileData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return { success: true, profile: response.data.user };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to update profile' 
    };
  }
};
```

## Order Management Integration

You can add a component to display a user's orders:

```jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('You must be logged in to view orders');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setOrders(response.data.orders);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-orders">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <h3>Order #{order.orderId}</h3>
              <p>Service: {order.serviceName}</p>
              <p>Date: {order.date}</p>
              <p>Status: <span className={`status-${order.orderStatus}`}>{order.orderStatus}</span></p>
              <p>Total: ₹{order.grandTotal}</p>
              <button onClick={() => /* Navigate to order details */}>View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
```

## Error Handling

Always include proper error handling in your API calls to provide meaningful feedback to users:

```javascript
try {
  // API call
} catch (error) {
  // Check for specific error types
  if (error.response) {
    // The server responded with a status code outside the 2xx range
    if (error.response.status === 401) {
      // Handle unauthorized access - maybe redirect to login
      localStorage.removeItem('accessToken'); // Clear invalid token
      navigate('/login');
    } else if (error.response.status === 400) {
      // Handle validation errors
      const errorMessage = error.response.data.message || 'Invalid input';
      alert(errorMessage);
    } else {
      // Handle other server errors
      alert('Server error: ' + (error.response.data.message || 'Unknown error'));
    }
  } else if (error.request) {
    // The request was made but no response was received
    alert('Network error. Please check your connection.');
  } else {
    // Something else happened
    alert('Error: ' + error.message);
  }
}
```

## Testing with Postman

Use the provided Postman collection (`server/postman-collection.json`) to test all API endpoints. Import this file into Postman to get started quickly. 