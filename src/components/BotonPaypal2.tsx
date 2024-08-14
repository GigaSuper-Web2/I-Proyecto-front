import React from 'react';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useLocation, useNavigate } from 'react-router-dom';

const BotonPaypal2: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Extrae los datos pasados a través de navigate
    const { precio, cantidad, productId, clienteId } = location.state || { precio: '0.00', cantidad: 0, productId: '', clienteId: '' };

    // Si clienteId no está disponible, muestra un error
    if (!clienteId) {
        alert('Cliente ID no proporcionado.');
        navigate('/ContenidoTienda');
        return null;
    }

    const initialOptions = {
        clientId: clienteId,
        currency: "USD"
    };

    const onPurchase = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/actualizarStock/${productId}`, {
                cantidadComprada: cantidad
            });

            if (response.status === 200) {
                alert('Compra realizada con éxito.');
                navigate('/ContenidoTienda'); // Redirigir y enviar datos a facturación aquí
            } else {
                alert('Error al actualizar el stock.');
            }
        } catch (error) {
            console.error('Error durante la actualización del stock:', error);
            alert('Error al realizar la compra. No se encuentran mas productos disponibles en stock');
        }
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <div
                className='contenedor_paypal'
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: '80vh',
                    textAlign: 'center',
                    width: '60vw',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    backgroundColor: '#f0f0f0',
                    padding: '20px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    marginTop: '60px',
                }}
            >
                <h1>PayPal Payment</h1>
                <PayPalButtons
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            intent: 'CAPTURE',
                            purchase_units: [{
                                amount: {
                                    currency_code: 'USD',
                                    value: precio // Usa el precio recibido
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
                                    onPurchase(); // Llama a la función de compra después de la transacción exitosa
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
