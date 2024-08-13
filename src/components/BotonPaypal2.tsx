import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';


const BotonPaypal2: React.FC<{ precio: string, onPurchase: () => void }> = ({ precio, onPurchase }) => {
    const clienteId = 'Acfe62d5FZKmgQhto53gEZC3lj9KJ6DXZFMULxB3nzj9ozzqtnzdIJdd52KOc8rJLdQv94kFeYbAbQsA';
    const initialOptions = {
        
        clientId: clienteId,
        currency: "USD"
    };
    

    return (
        <PayPalScriptProvider options={initialOptions}>
            <div>
                <h1>PayPal Payment</h1>
                <PayPalButtons
                    createOrder={(data, actions) => {
                        alert(`Creating order with amount: ${precio}`);
                        return actions.order.create({
                            intent: 'CAPTURE',
                            purchase_units: [{
                                amount: {
                                    currency_code: 'USD',
                                    value: precio // El precio ya está en formato adecuado
                                }
                            }]
                        });
                    }}
                    onApprove={async (data, actions) => {
                        if (actions.order) {
                            try {
                                const details = await actions.order.capture();
                                if (details.payer && details.payer.name) {
                                    alert(`Transaction completed by ${details.payer.name.given_name}`);
                                    // Llamar a la función de compra después de la transacción exitosa
                                    onPurchase();
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
