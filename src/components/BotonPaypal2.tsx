import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useLocation, useNavigate } from 'react-router-dom';

const BotonPaypal2: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Se arma un diccionario vacio para guardar los datos en los campos 
    const [datos, setDatos] = useState({
        usuario: {
            nombre: '',
            apellido: '',
            direccion: '',
            correo: ''
        },
        empresa: {
            idtienda: '',
            nombre: '',
            categoria: '',
            correo: '',
            logo: '',
            cedula: ''
        },
        producto: {
            nombre: '',
            precio: ''
        }
    });
    const [jsonFacturacion, setJsonFacturacion] = useState({});
    const [loading, setLoading] = useState(true);

    // Extrae los datos pasados a través de navigate
    const { precio, cantidad, productId, clienteId, token_sesion_usuario } = location.state || { precio: '0.00', cantidad: 0, productId: '', clienteId: '', token_sesion_usuario: '' };
    const token = token_sesion_usuario;
    // Función para obtener los datos de usuario, empresa y producto
    const obtenerDatos = async () => {
        try {
            if (!token_sesion_usuario) {
                console.error('Token de sesión no proporcionado.');
                return;
            }

            const [usuarioResponse, empresaResponse, productoResponse] = await Promise.all([ // hace las llamadas al mismo tiempo, antes del pago para recopialar los datos
                axios.get(`http://localhost:5000/obtenerUsuario/${token_sesion_usuario}`),
                axios.get('http://localhost:5000/obtenerEmpresa'),
                axios.get(`http://localhost:5000/productoEspecifico/${productId}`)
            ]);

            const usuario = usuarioResponse.data.data.user;
            const empresa = empresaResponse.data.data.tienda;
            const producto = productoResponse.data.data.producto;

            setDatos({
                usuario: {
                    nombre: usuario.nombre || '',
                    apellido: usuario.apellidos || '',
                    direccion: usuario.lugarResidencia || '',
                    correo: usuario.email || ''
                },
                empresa: {
                    idtienda: empresa.idtienda || '',
                    nombre: empresa.nombreEmpresa || '',
                    categoria: empresa.categoria || '',
                    correo: empresa.email || '',
                    logo: empresa.logoTienda || '',
                    cedula: empresa.cedulaEmpresa || ''
                },
                producto: {
                    nombre: producto.nombreProducto || '',
                    precio: producto.precio || ''
                }
            });

            // Construye el JSON de facturación
            const json_facturacion = {
                'nombre_comercial': empresa.nombreEmpresa || '',
                'logo_empresa': empresa.logoTienda || '',
                'ced_juridica': empresa.cedulaEmpresa || '',
                'correo_empresa': empresa.email || '',
                'cod_producto': productId || '',
                'nombre_producto': producto.nombreProducto || '',
                'cant_compra': cantidad || 0,
                'precio_unitario': producto.precio || '',
                'monto_total': precio || '',
                'nombre_cliente': usuario.nombre || '',
                'apellido_cliente': usuario.apellidos || '',
                'direccion_usuario': usuario.lugarResidencia || ''
            };

            setJsonFacturacion(json_facturacion);

        } catch (err) {
            console.error('Error al obtener los datos:', err);
            alert('Error al obtener los datos. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerDatos();
    }, [token_sesion_usuario, productId]);

    // Verifica si clienteId está disponible
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

                //verificando datos de facturacion

                console.log('Datos de facturación:', jsonFacturacion);
                const jsonString = JSON.stringify(jsonFacturacion, null, 2);
                alert(jsonString);

                localStorage.setItem('sesion', token);
                //navigate('/ContenidoTienda', { state: token });\
                navigate('/ContenidoTienda');
            } else {
                alert('Error al actualizar el stock.');
            }
        } catch (error) {
            console.error('Error durante la actualización del stock:', error);
            alert('Error al realizar la compra. No se encuentran más productos disponibles en stock.');
        }
    };

    if (loading) {
        return <div>Cargando datos...</div>;
    }

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
                                    value: precio
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
