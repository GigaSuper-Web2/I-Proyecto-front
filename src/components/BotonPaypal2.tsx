import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useLocation, useNavigate } from "react-router-dom";

const BotonPaypal2: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Aqui se estan guardando datos generales para simplemente tenerlos amno en caso de cualquier cambio en el envío a facturación
  const [datos, setDatos] = useState({
    usuario: {
      nombre: "",
      apellido: "",
      direccion: "",
      correo: "",
    },
    empresa: {
      idtienda: "",
      nombre: "",
      categoria: "",
      correo: "",
      logo: "",
      cedula: "",
    },
    producto: {
      nombre: "",
      precio: "",
    },
  });

  // Aquí se define el JSON que se enviará a facturación
  const [jsonFacturacion, setJsonFacturacion] = useState({
    cliente: "",
    correoCliente: "",
    detalles: [
      {
        codigoProducto: "",
        cantidad: 0,
        nombreProducto: "",
        precioUnitario: 0,
        montoTotal: 0,
        subTotal: 0,
      },
    ],
    totalVenta: 0,
  });

  const [loading, setLoading] = useState(true);

  //aqui se reciben los datos para el pago de paypal
  const { precio, cantidad, productId, clienteId, token_sesion_usuario } =
    location.state || {
      precio: "0.00",
      cantidad: 0,
      productId: "",
      clienteId: "",
      token_sesion_usuario: "",
    };
  const token = token_sesion_usuario;

  const obtenerDatos = async () => {
    try {
      if (!token_sesion_usuario) {
        console.error("Token de sesión no proporcionado.");
        return;
      }

      const [usuarioResponse, empresaResponse, productoResponse] =
        await Promise.all([
          axios.get(
            `http://10.90.31.123:5000/obtenerUsuario/${token_sesion_usuario}`
          ),
          axios.get("http://10.90.31.123:5000/obtenerEmpresa"),
          axios.get(`http://10.90.31.123:5000/productoEspecifico/${productId}`),
        ]);

      const usuario = usuarioResponse.data.data.user;
      const empresa = empresaResponse.data.data.tienda;
      const producto = productoResponse.data.data.producto;

      setDatos({
        usuario: {
          nombre: usuario.nombre || "",
          apellido: usuario.apellidos || "",
          direccion: usuario.lugarResidencia || "",
          correo: usuario.email || "",
        },
        empresa: {
          idtienda: empresa.idtienda || "",
          nombre: empresa.nombreEmpresa || "",
          categoria: empresa.categoria || "",
          correo: empresa.email || "",
          logo: empresa.logoTienda || "",
          cedula: empresa.cedulaEmpresa || "",
        },
        producto: {
          nombre: producto.nombreProducto || "",
          precio: producto.precio || "",
        },
      });

      // Construimos y asignamos las variables al JSON que se enviará a facturación
      const facturacionDetalles = {
        cliente: empresa.nombreEmpresa || "",
        correoCliente: usuario.email,
        detalles: [
          {
            codigoProducto: productId || "",
            cantidad: cantidad || 0,
            nombreProducto: producto.nombreProducto || "",
            precioUnitario: parseFloat(producto.precio || "0"),
            montoTotal: parseFloat(precio || "0"),
            subTotal: parseFloat(precio || "0"),
          },
        ],
        totalVenta: parseFloat(precio || "0"),
      };

      setJsonFacturacion(facturacionDetalles);
    } catch (err) {
      console.error("Error al obtener los datos:", err);
      alert("Error al obtener los datos. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const enviarAFacturacion = async () => {
    try {
      await axios.post("http://10.90.31.119:3000/factura", jsonFacturacion); // falta actualizar ip con server y metodo
      console.log("Factura enviada:", jsonFacturacion);
      alert("Factura enviada exitosamente!");
    } catch (error) {
      console.error(
        "Error al enviar la factura:",
        error +
          ".\nEsto puede ser porque tus datos registrados como cliente de Facturacion y Gigasuper no coinciden."
      );
      alert(
        "Error al enviar la factura. Inténtalo de nuevo. (Falta actualizar ip del server de ellos)"
      );
    }
  };

  const onPurchase = async () => {
    try {
      const response = await axios.put(
        `http://10.90.31.123:5000/actualizarStock/${productId}`,
        {
          cantidadComprada: cantidad,
        }
      );

      if (response.status === 200) {
        alert("Compra realizada con éxito.");

        // Envia los datos de facturación
        await enviarAFacturacion();

        localStorage.setItem("sesion", token);
        navigate("/ContenidoTienda");
      } else {
        alert("Error al actualizar el stock.");
      }
    } catch (error) {
      console.error("Error durante la actualización del stock:", error);
      alert(
        "Error al realizar la compra. No se encuentran más productos disponibles en stock."
      );
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, [token_sesion_usuario, productId]);

  if (!clienteId) {
    alert("Cliente ID no proporcionado.");
    navigate("/ContenidoTienda");
    return null;
  }

  const initialOptions = {
    clientId: clienteId,
    currency: "USD",
  };

  if (loading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div
        className="contenedor_paypal"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "80vh",
          textAlign: "center",
          width: "60vw",
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "#f0f0f0",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          marginTop: "60px",
        }}
      >
        <h1>PayPal Payment</h1>
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: precio,
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            if (actions.order) {
              try {
                const details = await actions.order.capture();
                if (details.payer && details.payer.name) {
                  alert(
                    `Transaction completed by ${details.payer.name.given_name}`
                  );
                  onPurchase();
                } else {
                  alert(
                    "Transaction completed, but payer details are missing."
                  );
                }
              } catch (error) {
                console.error("Capture error:", error);
                alert("An error occurred while capturing the transaction.");
              }
            } else {
              console.error("Order action is undefined");
              alert("Order action is undefined.");
            }
          }}
          onError={(err) => {
            console.error("PayPal Error:", err);
            alert("An error occurred with PayPal. Please try again.");
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default BotonPaypal2;
