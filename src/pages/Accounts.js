import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Accounts() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAccount, setNewAccount] = useState({ currency: 'EUR', name: '' });
  const [error, setError] = useState('');

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/accounts');
      setAccounts(response.data.data);
    } catch (error) {
      console.error('Error fetching accounts', error);
      setError('Failed to load accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async () => {
    try {
      await api.post('/accounts', newAccount);
      setShowCreateModal(false);
      setNewAccount({ currency: 'EUR', name: '' });
      await fetchAccounts();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create account');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAccount(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Your Accounts</h1>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Create New Account
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {accounts.length > 0 ? (
          accounts.map(account => (
            <Col md={4} key={account.id} className="mb-4">
              <Card>
                <Card.Header className="d-flex justify-content-between">
                  <span>{account.name}</span>
                  <span className="badge bg-info">{account.currency}</span>
                </Card.Header>
                <Card.Body>
                  <Card.Title className="h3 mb-3">
                    {account.balance} {account.currency}
                  </Card.Title>
                  <Card.Text>
                    <strong>Account Number:</strong><br/>
                    {account.accountNumber}
                  </Card.Text>

                  <Button 
                    variant="outline-primary" 
                    onClick={() => navigate('/transactions', { state: { selectedAccount: account.accountNumber } })}
                  >
                    Make a Transfer
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Card>
              <Card.Body className="text-center">
                <p>You don't have any accounts yet. Create one now!</p>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Create Account Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Account Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newAccount.name}
                onChange={handleChange}
                placeholder="e.g., Main Savings, Vacation Fund"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Currency</Form.Label>
              <Form.Select 
                name="currency" 
                value={newAccount.currency} 
                onChange={handleChange}
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="SEK">SEK</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateAccount}>
            Create Account
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Accounts;