import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Row, Col } from 'react-bootstrap';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [transaction, setTransaction] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionRes, accountsRes] = await Promise.all([
          api.get(`/transfers/${id}`),
          api.get('/accounts')
        ]);
        setTransaction(transactionRes.data.data);
        setAccounts(accountsRes.data.data);
      } catch (error) {
        console.error('Error fetching data', error);
        setError('Failed to load transaction details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
        <div className="mt-3">
          <Button variant="outline-primary" onClick={() => navigate('/transactions')}>
            Back to Transactions
          </Button>
        </div>
      </Alert>
    );
  }

  if (!transaction) {
    return (
      <Alert variant="warning">
        Transaction not found
        <div className="mt-3">
          <Button variant="outline-primary" onClick={() => navigate('/transactions')}>
            Back to Transactions
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Button variant="outline-secondary" onClick={() => navigate('/transactions')}>
          &larr; Back to Transactions
        </Button>
      </div>
      
      <h1 className="mb-4">Transaction Details</h1>
      
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h3>Transfer #{transaction.id}</h3>
            <span className={`badge ${transaction.status === 'completed' ? 'bg-success' : 
              transaction.status === 'failed' ? 'bg-danger' : 'bg-warning'}`}>
              {transaction.status}
            </span>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <h5>Transaction Info</h5>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th>Amount</th>
                    <td>
                      <strong className={`h4 ${accounts.some(acc => acc.accountNumber === transaction.fromAccount) ? 'text-danger' : 'text-success'}`}>
                        {accounts.some(acc => acc.accountNumber === transaction.fromAccount) ? '-' : '+'}
                        {transaction.amount} {transaction.currency}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <th>Date & Time</th>
                    <td>{transaction.createdAt ? new Date(transaction.createdAt).toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : new Date().toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{transaction.status}</td>
                  </tr>
                  <tr>
                    <th>External Transaction</th>
                    <td>{transaction.isExternal ? 'Yes' : 'No'}</td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col md={6}>
              <h5>Description</h5>
              <p className="border p-3 rounded">{transaction.explanation}</p>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <Card className="mb-3 mb-md-0">
                <Card.Header>Sender</Card.Header>
                <Card.Body>
                  <p><strong>Name:</strong> {transaction.senderName}</p>
                  <p><strong>Account:</strong> {transaction.fromAccount}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Header>Recipient</Card.Header>
                <Card.Body>
                  <p><strong>Name:</strong> {transaction.receiverName}</p>
                  <p><strong>Account:</strong> {transaction.toAccount}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default TransactionDetails;