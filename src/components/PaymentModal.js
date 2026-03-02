import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentService } from '../services/api';

const stripePromise = loadStripe('pk_test_51T5lGmH92eRPwZ5kfOZAkRyXCOApl8ZqHS0QICldkx28NOO6RIJ1o8iisgfbI9tC6upSMw6n7FNu4W9H10KEmpBZ009D6wmAvj');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

function CheckoutForm({ course, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const initPayment = async () => {
      try {
        const response = await paymentService.createPaymentIntent({
          amount: course.price,
          courseId: course._id,
          courseTitle: course.title
        });
        setClientSecret(response.data.clientSecret);
        setLoading(false);
      } catch (err) {
        console.error('Payment error:', err);
        setError('Cannot connect to payment server');
        setLoading(false);
      }
    };
    initPayment();
  }, [course]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement
      }
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess();
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="spinner-border text-primary" role="status"></div>
        <p style={{ marginTop: '15px', color: '#666' }}>Loading payment form...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ 
          background: '#ffeaea', 
          color: '#dc3545', 
          padding: '12px', 
          borderRadius: '6px', 
          marginBottom: '15px',
          border: '1px solid #ffc9c9'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '600', 
          color: '#333' 
        }}>
          Card Number
        </label>
        <div style={{ 
          border: '1px solid #ced4da', 
          borderRadius: '6px', 
          padding: '12px',
          backgroundColor: '#fff'
        }}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing || !clientSecret}
        style={{
          width: '100%',
          padding: '14px 20px',
          background: (!stripe || processing) ? '#6c757d' : '#ff7f40',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: (processing || !stripe) ? 'not-allowed' : 'pointer',
          marginTop: '10px'
        }}
      >
        {processing ? 'Processing...' : 'Pay $' + course.price}
      </button>
    </form>
  );
}

export default function PaymentModal({ course, onClose, onSuccess }) {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.6)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 9999 
    }}>
      <div style={{ 
        backgroundColor: '#fff', 
        borderRadius: '12px', 
        padding: '30px', 
        maxWidth: '420px', 
        width: '90%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px' 
        }}>
          <h3 style={{ margin: 0, color: '#162d59' }}>Pay with Card</h3>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: '#999',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        <div style={{ 
          background: '#162d59', 
          borderRadius: '8px', 
          padding: '15px', 
          marginBottom: '20px',
          color: 'white'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>Total Amount</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>${course?.price}</div>
          <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '5px' }}>{course?.title}</div>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm course={course} onSuccess={onSuccess} />
        </Elements>

        <div style={{ 
          marginTop: '20px', 
          textAlign: 'center', 
          fontSize: '12px', 
          color: '#999' 
        }}>
          <span>🔒 Secured by Stripe</span>
        </div>
      </div>
    </div>
  );
}
