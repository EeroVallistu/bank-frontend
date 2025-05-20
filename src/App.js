import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import TransactionDetails from './pages/TransactionDetails';
import ExchangeRates from './pages/ExchangeRates';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <div className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/accounts" element={
              <PrivateRoute>
                <Accounts />
              </PrivateRoute>
            } />
            <Route path="/transactions" element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            } />
            <Route path="/transactions/:id" element={
              <PrivateRoute>
                <TransactionDetails />
              </PrivateRoute>
            } />
            <Route path="/exchange-rates" element={<ExchangeRates />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;