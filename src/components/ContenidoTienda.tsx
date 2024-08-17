import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const ContenidoTienda: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);
    const [totalPrice, setTotalPrice] = useState<string>('0.00');
    const [clienteId, setClienteId] = useState<string>(''); // Estado para clienteId
    const [tienda, setTienda] = useState<any | null>(null); // Estado para la tienda
    const navigate = useNavigate();
    const location = useLocation();
    
    const token = location.state?.token;

    useEffect(() => {
        const fetchProductsAndStore = async () => {
            try {
                // Obtener productos
                const productsResponse = await axios.get('http://localhost:5000/obtenerProductos', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(productsResponse.data.data.productos);

                // Obtener información de la tienda
                const storeResponse = await axios.get('http://localhost:5000/obtenerEmpresa', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTienda(storeResponse.data.data.tienda);
            } catch (err) {
                setError('Error al obtener los productos o la tienda.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsAndStore();
    }, [token]);

    const handleShow = (product: any) => {
        setSelectedProduct(product);
        setQuantity(1);
        setTotalPrice(product.precio);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(event.target.value);
        setQuantity(newQuantity);
        if (selectedProduct) {
            const newTotalPrice = (newQuantity * selectedProduct.precio).toFixed(2);
            setTotalPrice(newTotalPrice);
        }
    };

    const handlePurchase = () => {
        if (selectedProduct && clienteId) {
            const purchaseData = {
                precio: totalPrice,
                cantidad: quantity,
                productId: selectedProduct.id,
                clienteId: clienteId,
                token_sesion_usuario: token
            };

            navigate('/BotonPaypal2', { state: purchaseData });
        } else {
            alert('Por favor, ingrese un clienteId válido.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            <div className="text-center mb-4">
                <br />
                <br />
                {tienda ? (
                    <h1>{tienda.nombreEmpresa}</h1>
                ) : (
                    <p>Cargando información de la tienda...</p>
                )}
                <br />

            </div>
            <div className="row">
                {products.map((product) => (
                    <div key={product.id} className="col-md-4">
                        <div className="card mb-4">
                            <img
                                src={`data:image/svg+xml;base64,${btoa(product.logoProducto)}`}
                                className="card-img-top"
                                alt={product.nombreProducto}
                                onClick={() => handleShow(product)}
                                style={{ cursor: 'pointer' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.nombreProducto}</h5>
                                <p className="card-text">{product.descripcion}</p>
                                <p className="card-text">Precio: ${product.precio}</p>
                                <p className="card-text">Stock: {product.stock}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedProduct?.nombreProducto}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProduct && (
                        <div>
                            <img
                                src={`data:image/svg+xml;base64,${btoa(selectedProduct.logoProducto)}`}
                                className="img-fluid mb-3"
                                alt={selectedProduct.nombreProducto}
                            />
                            <h4>Descripción:</h4>
                            <h6>{selectedProduct.descripcion}</h6>
                            <br />
                            <h5>Precio: ${selectedProduct.precio}</h5>
                            <h5>Stock: {selectedProduct.stock}</h5>
                            <br />
                            <Form.Group>
                                <Form.Label>Cantidad:</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    min="1"
                                    max={selectedProduct.stock}
                                />
                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Form.Label><h5>Cliente ID:</h5></Form.Label>
                                <Form.Control
                                    type="text"
                                    value={clienteId}
                                    onChange={(e) => setClienteId(e.target.value)}
                                    placeholder="Ingrese su Cliente ID proporcionado por PayPal"
                                />
                                <br />
                            </Form.Group>
                            <h5>Precio Total: ${totalPrice}</h5>
                            <button 
                                onClick={handlePurchase}
                                style={{
                                    backgroundColor: '#FFD700',
                                    height: '50px',
                                    width: '100%',
                                    border: 'none',
                                    color: 'black',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    marginTop: '20px'
                                }}>
                                Proceder al pago
                            </button>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ContenidoTienda;
