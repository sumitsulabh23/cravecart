import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import { Toaster } from 'react-hot-toast';

// Mock/Placeholder pages for now
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantMenu from './pages/RestaurantMenu';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import RestaurantManagement from './pages/RestaurantManagement';
import FoodManagement from './pages/FoodManagement';
import OrderManagement from './pages/OrderManagement';
import NotFound from './pages/NotFound';

function App() {
  const { user } = useContext(AuthContext);

  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!user) return <Navigate to="/login" />;
    if (adminOnly && user.role !== 'admin' && user.role !== 'owner') return <Navigate to="/" />;
    return children;
  };

  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="restaurant/:id" element={<RestaurantMenu />} />
            <Route path="login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="register" element={!user ? <Register /> : <Navigate to="/" />} />

            <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

            <Route path="admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="admin/restaurants" element={<ProtectedRoute adminOnly><RestaurantManagement /></ProtectedRoute>} />
            <Route path="admin/restaurants/:restaurantId/foods" element={<ProtectedRoute adminOnly><FoodManagement /></ProtectedRoute>} />
            <Route path="admin/orders" element={<ProtectedRoute adminOnly><OrderManagement /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
