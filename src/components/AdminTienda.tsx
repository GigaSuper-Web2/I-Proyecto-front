import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const AdminTienda: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string>("");
  const [productStock, setProductStock] = useState<string>("");
  const [productLogo, setProductLogo] = useState<File | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [Idtienda, setIdTienda] = useState("");

  const [product_id, setProduct_id] = useState<string>("");

  const token = location.state?.token;

  const buscaTiendaId = async () => {
    try {
      const response = await axios.get("http:///obtenerEmpresa");
      setIdTienda(response.data.data.tienda["idtienda"]);

      //alertita para verificar xd
      alert(response.data.data.tienda["idtienda"]);
    } catch (err) {
      //cierra try

      setError("Error al obtener el ID de la empresa");
    } //cierra consulta api
  };

  useEffect(() => {
    buscaTiendaId();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://10.90.31.123:5000/obtenerProductos",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(response.data.data.productos);
      } catch (err) {
        setError("Error al obtener los productos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const handleShow = (product: any) => {
    setProduct_id(product.id);
    setSelectedProduct(product);
    setProductName(product.nombreProducto);
    setProductDescription(product.descripcion);
    setProductPrice(product.precio);
    setProductStock(product.stock);
    setProductLogo(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProduct(null); // Limpiar la selección al cerrar el modal
  };

  const handleSaveProduct = async () => {
    const formData = new FormData();

    formData.append("tiendaId", Idtienda);
    formData.append("nombreProducto", productName);
    formData.append("descripcion", productDescription);
    formData.append("precio", productPrice);
    formData.append("stock", productStock);
    if (productLogo) {
      formData.append("logoProducto", productLogo);
    }
    //formData.append('tiendaId', Idtienda); // Reemplaza con el ID correcto de la tienda

    try {
      if (selectedProduct) {
        // Editar producto existente
        await axios.put(
          `http://10.90.31.123:5000/editarProducto/${selectedProduct.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Actualizar la lista de productos después de la edición
        const updatedProducts = products.map((product) =>
          product._id === selectedProduct.id
            ? {
                ...product,
                nombreProducto: productName,
                descripcion: productDescription,
                precio: productPrice,
                stock: productStock,
              }
            : product
        );
        setProducts(updatedProducts);
        navigate("/AdminTienda");
      } else {
        // Agregar nuevo producto
        await axios.post("http://10.90.31.123:5000/agregarProducto", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        // Actualizar la lista de productos después de la adición
        const response = await axios.get(
          "http://10.90.31.123:5000/obtenerProductos",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(response.data.data.productos);
      }

      handleClose();
    } catch (err) {
      console.error("Error al guardar el producto:", err);
      setError("Error al guardar el producto.");
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct || !selectedProduct.id) {
      setError("ID del producto no encontrado.");
      return;
    }

    const formData = new FormData();
    formData.append("nombreProducto", productName);
    formData.append("descripcion", productDescription);
    formData.append("precio", productPrice);
    formData.append("stock", productStock);
    if (productLogo) {
      formData.append("logoProducto", productLogo);
    }

    try {
      await axios.put(
        `http://10.90.31.123:5000/editarProducto/${selectedProduct.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Actualizar la lista de productos después de la edición
      const updatedProducts = products.map((product) =>
        product._id === selectedProduct.id
          ? {
              ...product,
              nombreProducto: productName,
              descripcion: productDescription,
              precio: productPrice,
              stock: productStock,
            }
          : product
      );
      setProducts(updatedProducts);

      handleClose();
    } catch (err) {
      console.error("Error al editar el producto:", err);
      setError("Error al editar el producto.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await axios.delete(
        `http://10.90.31.123:5000/eliminarProducto/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Actualizar la lista de productos después de la eliminación
      setProducts(products.filter((product) => product.id !== productId));
    } catch (err) {
      console.error("Error al eliminar el producto:", err);
      setError("Error al eliminar el producto.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <div className="text-center mb-4">
        <br />
        <br />
        <h1>Administrar Productos</h1>
        <br />
      </div>
      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-md-4">
            <div className="card mb-4">
              <img
                src={`data:image/svg+xml;base64,${btoa(product.logoProducto)}`}
                className="card-img-top"
                alt={product.nombreProducto}
                onClick={() => handleShow(product)}
                style={{ cursor: "pointer" }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.nombreProducto}</h5>
                {/* Mostrar el ID del producto */}
                <p className="card-text">
                  <strong>ID:</strong> {product.id}
                </p>
                <p className="card-text">{product.descripcion}</p>
                <p className="card-text">Precio: ${product.precio}</p>
                <p className="card-text">Stock: {product.stock}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "10px",
        }}
      >
        <button
          style={{
            backgroundColor: "#FFD700",
            height: "60px",
            width: "60px",
            border: "none",
            color: "black",
            fontSize: "24px",
            fontWeight: "bold",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={() => {
            setSelectedProduct(null);
            setProductName("");
            setProductDescription("");
            setProductPrice("");
            setProductStock("");
            setProductLogo(null);
            setShowModal(true);
          }}
        >
          +
        </button>
        <button
          style={{
            backgroundColor: "#4a3ada",
            height: "60px",
            width: "60px",
            border: "none",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={() =>
            navigate("/EditarTienda", { state: { Idtienda, token } })
          }
        >
          Editar Tienda
        </button>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedProduct ? "Editar Producto" : "Agregar Producto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre del Producto</Form.Label>
              <Form.Control
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción del Producto</Form.Label>
              <Form.Control
                type="text"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="text"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="text"
                value={productStock}
                onChange={(e) => setProductStock(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formProductLogo">
              <Form.Label>Logo del Producto</Form.Label>
              <Form.Control
                type="file"
                accept=".svg"
                onChange={(e) =>
                  setProductLogo(
                    (e.target as HTMLInputElement).files?.[0] || null
                  )
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveProduct}>
            {selectedProduct ? "Guardar Cambios" : "Agregar Producto"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminTienda;
