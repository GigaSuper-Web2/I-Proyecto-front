import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegistroTienda = () => {
  const [nombre, setNombre] = useState("");
  const [propietarioEmpresa, setPropietarioEmpresa] = useState("");
  const [cedEmpresa, setCedEmpresa] = useState("");
  const [categoria, setCategoria] = useState("");
  const [datoFirma, setDatoFirma] = useState<string>(""); // Firma digital como texto
  const [correo, setCorreo] = useState("");
  const [pass, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState(""); // Estado para la confirmación de la contraseña
  const [logo, setLogo] = useState<File | null>(null);
  const [publicKeyFile, setPublicKeyFile] = useState<File | null>(null); // Archivo .pem de clave pública
  const [signatureFile, setSignatureFile] = useState<File | null>(null); // Archivo .pem de firma digital

  const navigate = useNavigate();

  const handleSignatureFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSignatureFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setDatoFirma(event.target.result as string); // Guarda la firma como texto
        }
      };
      reader.readAsText(file); // Lee el archivo como texto
    } else {
      setSignatureFile(null);
      setDatoFirma(""); // Limpia el datoFirma si no hay archivo
    }
  };

  //alert(cedEmpresa);

  const formlleno = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pass !== confirmPass) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (!logo || !publicKeyFile || !signatureFile) {
      alert(
        "Por favor, adjuntar el logo, archivo de firma digital y archivo de clave pública."
      );
      return;
    }
    alert("firma digital: " + datoFirma);

    try {
      // Crear FormData para la verificación de la firma
      const verificationFormData = new FormData();
      verificationFormData.append("idNumber", cedEmpresa);

      //alert(cedEmpresa);
      verificationFormData.append("idType", categoria);

      verificationFormData.append("publicKeyFile", publicKeyFile); // Incluye el archivo .pem de clave pública

      verificationFormData.append("signature", datoFirma); // Firma digital como texto

      // Verificar firma digital
      const verifyResponse = await axios.post(
        "http://10.90.31.200/bank/validate-signature",
        verificationFormData
      );

      if (verifyResponse.status === 200) {
        alert("La firma es válida.");

        // Crear FormData para registrar la tienda
        const formData = new FormData();
        formData.append("nombreEmpresa", nombre);
        formData.append("propietarioEmpresa", propietarioEmpresa);
        formData.append("cedulaEmpresa", cedEmpresa);
        formData.append("categoria", categoria);
        formData.append("email", correo);
        formData.append("passwd", pass);
        formData.append("logoTienda", logo); // Solo incluye el logo para el registro
        formData.append("datoFirmaDigital", signatureFile);

        // Enviar FormData al servidor para registrar la tienda
        const registerResponse = await axios.post(
          "http://10.90.31.123:5000/registrarTienda",
          formData
        );

        if (registerResponse.status === 201) {
          alert("Tienda registrada :)");
          navigate("/PrimerProducto");
        } else {
          alert("Error al registrar la tienda.");
        }
      } else {
        alert("La firma no es válida.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(
          `Error: ${error.response.data.message}. Es posible que haya una tienda registrada. \nSolo se admite una tienda en la base de datos.`
        );
      } else {
        alert("Ocurrió un error al verificar la firma.");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="card p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center mb-4">Registro de Tienda</h2>
        <form onSubmit={formlleno}>
          {/* Campos del formulario */}
          <div className="form-group">
            <label style={{ marginLeft: "5px" }}>Nombre empresa</label>
            <input
              required
              type="text"
              placeholder="Nombre Empresa"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
          </div>
          <div className="form-group">
            <label style={{ marginLeft: "5px" }}>Propietario empresa</label>
            <input
              required
              type="text"
              placeholder="Propietario Empresa"
              className="form-control"
              value={propietarioEmpresa}
              onChange={(e) => setPropietarioEmpresa(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
          </div>
          <div className="form-group">
            <label style={{ marginLeft: "5px" }}>Cédula empresa</label>
            <input
              required
              type="text"
              placeholder="Cédula Empresa"
              className="form-control"
              value={cedEmpresa}
              onChange={(e) => setCedEmpresa(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
          </div>
          <div className="form-group">
            <label style={{ marginLeft: "5px" }}>Categoría empresa</label>
            <input
              required
              type="text"
              placeholder="Categoría"
              className="form-control"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
          </div>
          <div className="form-group">
            <label style={{ marginLeft: "5px" }}>
              Archivo de firma digital (.pem)
            </label>
            <input
              required
              type="file"
              accept=".pem"
              className="form-control"
              onChange={handleSignatureFileChange}
              style={{ marginBottom: "15px" }}
            />
          </div>
          <div className="form-group">
            <label style={{ marginLeft: "5px" }}>
              Archivo de clave pública (.pem)
            </label>
            <input
              required
              type="file"
              accept=".pem"
              className="form-control"
              onChange={(e) => setPublicKeyFile(e.target.files?.[0] || null)}
              style={{ marginBottom: "15px" }}
            />
          </div>
          <div className="form-group">
            <label style={{ marginLeft: "5px" }}>Correo Electrónico</label>
            <input
              required
              type="email"
              placeholder="Correo"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
          </div>
          <div className="form-group">
            <label style={{ marginLeft: "5px" }}>Contraseña</label>
            <input
              required
              type="password"
              placeholder="Contraseña"
              className="form-control"
              value={pass}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
          </div>
          <div className="form-group">
            <label style={{ marginLeft: "5px" }}>Confirmar Contraseña</label>
            <input
              required
              type="password"
              placeholder="Confirmar Contraseña"
              className="form-control"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
          </div>
          <div className="form-group">
            <label style={{ marginLeft: "5px" }}>Logo empresa</label>
            <input
              type="file"
              accept=".svg"
              className="form-control"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-3">
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistroTienda;
