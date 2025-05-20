import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <div className="py-5 text-center bg-light rounded-3 mb-5">
        <h1 className="display-5 fw-bold">Welcome to Modern Banking</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            Manage your accounts, make transactions, and track your finances with our secure and user-friendly banking platform.
          </p>
          {!isAuthenticated && (
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
              <Button variant="primary" size="lg" onClick={() => navigate('/login')} className="px-4 me-sm-3">Login</Button>
              <Button variant="outline-primary" size="lg" onClick={() => navigate('/register')} className="px-4">Register</Button>
            </div>
          )}
          {isAuthenticated && (
            <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')} className="px-4">Go to Dashboard</Button>
          )}
        </div>
      </div>

      <Row className="mb-5 g-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <div className="text-center mb-3">
                <i className="bi bi-wallet2 fs-1"></i>
              </div>
              <Card.Title className="text-center">Account Management</Card.Title>
              <Card.Text>
                Create and manage multiple accounts in different currencies. View balances and transaction history at a glance.
              </Card.Text>
            </Card.Body>
            <Card.Footer className="bg-transparent border-0 text-center">
              <Button 
                variant="outline-primary" 
                onClick={() => navigate(isAuthenticated ? '/accounts' : '/login')}
              >
                Manage Accounts
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <div className="text-center mb-3">
                <i className="bi bi-arrow-left-right fs-1"></i>
              </div>
              <Card.Title className="text-center">Quick Transfers</Card.Title>
              <Card.Text>
                Send money to other accounts quickly and securely. Support for both internal and external bank transfers.
              </Card.Text>
            </Card.Body>
            <Card.Footer className="bg-transparent border-0 text-center">
              <Button 
                variant="outline-primary"
                onClick={() => navigate(isAuthenticated ? '/transactions' : '/login')}
              >
                Make a Transfer
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <div className="text-center mb-3">
                <i className="bi bi-currency-exchange fs-1"></i>
              </div>
              <Card.Title className="text-center">Currency Exchange</Card.Title>
              <Card.Text>
                Check real-time exchange rates for multiple currencies. Convert between EUR, USD, GBP, and SEK easily.
              </Card.Text>
            </Card.Body>
            <Card.Footer className="bg-transparent border-0 text-center">
              <Button 
                variant="outline-primary"
                onClick={() => navigate('/exchange-rates')}
              >
                View Exchange Rates
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Card className="text-center bg-light p-4 mb-4">
        <Card.Body>
          <h3>API Documentation</h3>
          <p>
            Developers can integrate with our banking system using our comprehensive API.
            View our OpenAPI specification for detailed endpoint documentation.
          </p>
          <Button variant="outline-dark">
            <i className="bi bi-file-earmark-code me-2"></i>
            API Documentation
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Home;