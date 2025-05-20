import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Alert } from 'react-bootstrap';
import api from '../services/api';

function ExchangeRates() {
  const [rates, setRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState('EUR');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currencies = ['EUR', 'USD', 'GBP', 'SEK'];

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/exchange-rates?base=${baseCurrency}`);
        setRates(response.data.rates);
        setError('');
      } catch (error) {
        console.error('Error fetching exchange rates', error);
        setError('Failed to load exchange rates. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [baseCurrency]);

  return (
    <div>
      <h1 className="mb-4">Currency Exchange Rates</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Body>
          <Form className="mb-4">
            <Form.Group as={Row}>
              <Form.Label column sm={3} md={2}>Base Currency:</Form.Label>
              <Col sm={6} md={3}>
                <Form.Select 
                  value={baseCurrency} 
                  onChange={(e) => setBaseCurrency(e.target.value)}
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
          </Form>

          {loading ? (
            <div className="text-center">Loading rates...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Currency</th>
                    <th>Rate</th>
                    <th>Conversion</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(rates).map(([currency, rate]) => (
                    <tr key={currency}>
                      <td>{currency}</td>
                      <td>{rate}</td>
                      <td>1 {baseCurrency} = {rate} {currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Header>Currency Converter</Card.Header>
        <Card.Body>
          <CurrencyConverter rates={rates} baseCurrency={baseCurrency} currencies={currencies} />
        </Card.Body>
      </Card>
    </div>
  );
}

function CurrencyConverter({ rates, baseCurrency, currencies }) {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState(baseCurrency);
  const [toCurrency, setToCurrency] = useState(Object.keys(rates)[0] || 'USD');

  // Remove base currency from target currencies
  const targetCurrencies = currencies.filter(c => c !== fromCurrency);
  
  // If the current toCurrency is the same as fromCurrency, reset it
  useEffect(() => {
    if (toCurrency === fromCurrency) {
      setToCurrency(targetCurrencies[0]);
    }
  }, [fromCurrency, toCurrency, targetCurrencies]);

  const convert = () => {
    if (fromCurrency === baseCurrency) {
      return (amount * rates[toCurrency]).toFixed(2);
    } else if (toCurrency === baseCurrency) {
      return (amount / rates[fromCurrency]).toFixed(2);
    } else {
      // Convert from source to base, then from base to target
      const amountInBase = fromCurrency === baseCurrency ? amount : amount / rates[fromCurrency];
      return (amountInBase * rates[toCurrency]).toFixed(2);
    }
  };

  return (
    <div>
      <Row className="align-items-end">
        <Col md={5}>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>From</Form.Label>
            <Form.Select 
              value={fromCurrency} 
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2} className="text-center mb-3">
          <div className="h4">=</div>
        </Col>
        <Col md={5}>
          <Form.Group className="mb-3">
            <Form.Label>Converted Amount</Form.Label>
            <Form.Control 
              type="text" 
              value={convert()} 
              readOnly 
              className="bg-light"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>To</Form.Label>
            <Form.Select 
              value={toCurrency} 
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {targetCurrencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
}

export default ExchangeRates;