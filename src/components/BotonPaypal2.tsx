import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

// Replace with your actual sandbox or production client ID
const initialOptions = {
  clientId: "Acfe62d5FZKmgQhto53gEZC3lj9KJ6DXZFMULxB3nzj9ozzqtnzdIJdd52KOc8rJLdQv94kFeYbAbQsA",
  currency: "USD" // Adjust currency if needed
};

const BotonPaypal2 = () => {
  return (
    <PayPalScriptProvider options={initialOptions}>
      <div>
        <h1>PayPal Payment</h1>

        {/* PayPal Button */}
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: 'CAPTURE', // 'CAPTURE' for immediate capture, 'AUTHORIZE' if you want to capture later
              purchase_units: [{
                amount: {
                  currency_code: 'USD', // Required currency code
                  value: '10.00' // Fixed amount for the transaction
                }
              }]
            });
          }}
          onApprove={async (data, actions) => {
            // Ensure `actions.order` is not `undefined`
            if (actions.order) {
              try {
                // Capture the order
                const details = await actions.order.capture();
                // Check if payer details are available
                if (details.payer && details.payer.name) {
                  alert(`Transaction completed by ${details.payer.name.given_name}`);
                } else {
                  alert('Transaction completed, but payer details are missing.');
                }
              } catch (error) {
                console.error('Capture error:', error);
                alert('An error occurred while capturing the transaction.');
              }
            } else {
              console.error('Order action is undefined');
              alert('Order action is undefined.');
            }
          }}
          onError={(err) => {
            console.error('PayPal Error:', err);
            alert('An error occurred with PayPal. Please try again.');
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default BotonPaypal2;
