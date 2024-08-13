import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import BotonPaypal2 from './BotonPaypal2';

const ContenidoTienda: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);
    const [totalPrice, setTotalPrice] = useState<string>('0.00');
    const [totalUnitario, setPrecioUnitario] = useState<string>('0.00');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/obtenerProductos');
                setProducts(response.data.data.productos);
            } catch (err) {
                setError('Error al obtener los productos.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleShow = (product: any) => {
        setSelectedProduct(product);
        setQuantity(1);  // Resetea la cantidad al mostrar un nuevo producto
        setPrecioUnitario(product.precio); // Inicializa el precio total
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

    const handlePurchase = async () => {
        if (selectedProduct) {
            try {
                const response = await axios.put(`http://localhost:5000/actualizarStock/${selectedProduct.id}`, {
                    cantidadComprada: quantity
                });

                if (response.status === 200) {
                    alert(`Compra realizada con éxito. Precio Total: $${totalPrice}`);
                    setShowModal(false);
                    // Redirigir a ContenidoTienda
                    window.location.href = '/ContenidoTienda';
                } else {
                    alert('Error al actualizar el stock.');
                }
            } catch (error) {
                console.error('Error durante la actualización del stock:', error);
                alert('Error al realizar la compra.');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
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
                            <Form.Group>
                                <Form.Label>Cantidad:</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    min="1"
                                    max={selectedProduct.stock} // Evita que el usuario seleccione más del stock disponible
                                />
                            </Form.Group>
                            <h5>Precio Total: ${totalPrice}</h5>
                            <BotonPaypal2 precio={totalPrice} onPurchase={handlePurchase} />
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
