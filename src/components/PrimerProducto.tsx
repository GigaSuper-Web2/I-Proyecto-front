import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const PrimerProducto = () => {
  const [formData, setFormData] = useState({
    tiendaId: "",
    nombreProducto: "",
    descripcion: "",
    precio: "",
    stock: "",
    logoProducto: null as File | null,
  });
  const [idTienda, setIdTienda] = useState<string | undefined>();
  const navigate = useNavigate();

  const obtenerEmpresaId = async () => {
    try {
      const response = await axios.get(
        `http://10.90.31.123:5000/obtenerEmpresa`
      );
      setIdTienda(response.data.data.tienda["idtienda"]);
      //alert(response.data.data.tienda['idtienda']);
    } catch (err) {
      console.log(err);
    }
  }; //cierra metodo

  useEffect(() => {
    obtenerEmpresaId();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevState) => ({
      ...prevState,
      logoProducto: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!idTienda) {
      alert("ID de tienda no encontrado. Por favor, inténtalo de nuevo.");
      return;
    }

    // Validar si se seleccionó un archivo
    if (!formData.logoProducto) {
      alert("Por favor, selecciona un archivo SVG para el logo del producto.");
      return;
    }

    const data = new FormData();
    data.append("tiendaId", idTienda);
    data.append("nombreProducto", formData.nombreProducto);
    data.append("descripcion", formData.descripcion);
    data.append("precio", formData.precio);
    data.append("stock", formData.stock);
    data.append("logoProducto", formData.logoProducto);

    try {
      const response = await axios.post(
        "http://10.90.31.123:5000/agregarProducto",
        data
      );
      alert("Producto agregado con éxito");
      navigate("/PaginaInicio");
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      alert("Hubo un problema al agregar el producto.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="card p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <br />

        <h1 className="text-center">Bienvenido!</h1>
        <p className="text-center">
          Ya que te acabas de registrar en nuestro sistema, agrega tu primer
          producto!
        </p>
        <h3 className="text-center">Agregar Nuevo Producto</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            {/* <label>ID de la Tienda</label>
            <input
              type="text"
              name="tiendaId"
              className="form-control"
              value={formData.tiendaId}
              onChange={handleChange}
              required
            /> */}
          </div>
          <div className="form-group">
            <label>Nombre del Producto</label>
            <input
              type="text"
              name="nombreProducto"
              className="form-control"
              value={formData.nombreProducto}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              className="form-control"
              value={formData.descripcion}
              onChange={handleChange}
              required
              style={{ width: "100%", height: "100px", resize: "none" }}
            />
          </div>
          <div className="form-group">
            <label>Precio $</label>
            <input
              type="text"
              name="precio"
              className="form-control"
              value={formData.precio}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              className="form-control"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Logo del Producto (SVG)</label>
            <input
              type="file"
              name="logoProducto"
              className="form-control"
              accept=".svg"
              onChange={handleFileChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-3">
            Agregar Producto
          </button>
        </form>
      </div>
    </div>
  );
};

export default PrimerProducto;
