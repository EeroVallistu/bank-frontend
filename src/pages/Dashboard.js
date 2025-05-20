import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [accountsResponse, transactionsResponse] = await Promise.all([
          api.get('/accounts'),
          api.get('/transfers')
        ]);
        
        setAccounts(accountsResponse.data.data);
        setTransactions(transactionsResponse.data.data.slice(0, 5)); // Only show recent 5
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h1 className="mb-4">Welcome, {currentUser?.fullName}</h1>
      
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>Your Accounts</h3>
          <Link to="/accounts">
            <Button variant="primary" size="sm">Manage Accounts</Button>
          </Link>
        </Card.Header>
        <Card.Body>
          <Row>
            {accounts.length > 0 ? (
              accounts.map(account => (
                <Col md={4} key={account.id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>{account.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {account.accountNumber}
                      </Card.Subtitle>
                      <Card.Text className="h4">
                        {account.balance} {account.currency}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <p>You don't have any accounts yet. Create one now!</p>
                <Link to="/accounts">
                  <Button variant="primary">Create Account</Button>
                </Link>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>Recent Transactions</h3>
          <Link to="/transactions">
            <Button variant="primary" size="sm">View All</Button>
          </Link>
        </Card.Header>
        <Card.Body>
          {transactions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>From/To</th>
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
                        {accounts.some(acc => acc.accountNumber === transaction.fromAccount) 
                          ? `To: ${transaction.receiverName}` 
                          : `From: ${transaction.senderName}`}
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
            <p>No recent transactions found.</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Dashboard;