import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import { Toaster } from 'react-hot-toast';


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

  const CustomerRoute = ({ children }) => {
    if (user && (user.role === 'admin' || user.role === 'owner')) {
      return <Navigate to="/admin" />;
    }
    return children;
  };

  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* If not logged in, force users to login first */}
            <Route
              index
              element={
                user
                  ? <CustomerRoute><Home /></CustomerRoute>
                  : <Navigate to="/login" replace />
              }
            />
            <Route path="restaurant/:id" element={<CustomerRoute><RestaurantMenu /></CustomerRoute>} />
            <Route path="login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="register" element={!user ? <Register /> : <Navigate to="/" />} />

            <Route path="cart" element={<CustomerRoute><ProtectedRoute><Cart /></ProtectedRoute></CustomerRoute>} />
            <Route path="orders" element={<CustomerRoute><ProtectedRoute><Orders /></ProtectedRoute></CustomerRoute>} />

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
