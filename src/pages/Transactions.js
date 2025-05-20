import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, Modal, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function Transactions() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTransferModal, setShowNewTransferModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newTransfer, setNewTransfer] = useState({
    fromAccount: location.state?.selectedAccount || '',
    toAccount: '',
    amount: '',
    explanation: ''
  });

  const fetchData = async () => {
    try {
      const [transactionsRes, accountsRes] = await Promise.all([
        api.get('/transfers'),
        api.get('/accounts')
      ]);
      setTransactions(transactionsRes.data.data);
      setAccounts(accountsRes.data.data);
    } catch (error) {
      console.error('Error fetching data', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Open transfer modal if account was selected from Accounts page
    if (location.state?.selectedAccount) {
      setShowNewTransferModal(true);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTransfer(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTransfer = async () => {
    try {
      await api.post('/transfers', newTransfer);
      setShowNewTransferModal(false);
      setNewTransfer({
        fromAccount: '',
        toAccount: '',
        amount: '',
        explanation: ''
      });
      setSuccess('Transfer created successfully!');
      await fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create transfer');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Transactions</h1>
        <Button 
          variant="primary" 
          onClick={() => setShowNewTransferModal(true)}
          disabled={accounts.length === 0}
        >
          New Transfer
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Card>
        <Card.Body>
          {transactions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{transaction.createdAt ? new Date(transaction.createdAt).toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : new Date().toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</td>
                      <td>
                        {transaction.senderName}<br/>
                        <small className="text-muted">{transaction.fromAccount}</small>
                      </td>
                      <td>
                        {transaction.receiverName}<br/>
                        <small className="text-muted">{transaction.toAccount}</small>
                      </td>
                      <td className={accounts.some(acc => acc.accountNumber === transaction.fromAccount) ? 'text-danger' : 'text-success'}>
                        {accounts.some(acc => acc.accountNumber === transaction.fromAccount) ? '-' : '+'}
                        {transaction.amount} {transaction.currency}
                      </td>
                      <td>
                        <span className={`badge ${transaction.status === 'completed' ? 'bg-success' : 
                          transaction.status === 'failed' ? 'bg-danger' : 'bg-warning'}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/transactions/${transaction.id}`}>
                          <Button variant="outline-primary" size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center">No transactions found.</p>
          )}
        </Card.Body>
      </Card>

      {/* New Transfer Modal */}
      <Modal show={showNewTransferModal} onHide={() => setShowNewTransferModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>From Account</Form.Label>
              <Form.Select 
                name="fromAccount" 
                value={newTransfer.fromAccount} 
                onChange={handleChange}
                required
              >
                <option value="">Select Account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.accountNumber}>
                    {account.name} - {account.balance} {account.currency} ({account.accountNumber})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>To Account</Form.Label>
              <Form.Control
                type="text"
                name="toAccount"
                value={newTransfer.toAccount}
                onChange={handleChange}
                placeholder="Enter recipient account number"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={newTransfer.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Explanation</Form.Label>
              <Form.Control
                as="textarea"
                name="explanation"
                value={newTransfer.explanation}
                onChange={handleChange}
                placeholder="What is this transfer for?"
                rows={3}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewTransferModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreateTransfer}
            disabled={!newTransfer.fromAccount || !newTransfer.toAccount || !newTransfer.amount || !newTransfer.explanation}
          >
            Send Transfer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Transactions;