import React, { useState, useEffect } from "react";
import { fetchData } from "./formato";
import "./estilosseguimiento.css";

function Seguimientoresidencia(props) {
  const [mostrarPopup, setMostrarPopup] = useState(false);

  const handleCerrarPopup = () => {
    // Lógica para cerrar el popup
    setMostrarPopup(false);
  };

  const handleCrearClick = () => {
    setMostrarPopup(true);
  };

  const imprimir3 = () => {
       // Ocultar otros elementos antes de imprimir
       const style = document.createElement('style');
       style.innerHTML = '@page { size: landscape; }';
     
       // Agregar el estilo al head del documento
       document.head.appendChild(style);
       window.print();
  };

  const [data, setData] = useState(null);
  const [newItem, setNewItem] = useState({
    nombre: "",
    ncontrol: "",
    nombre_anteproyecto: "",
    periodo: "",
    empresa: "",
    asesorE: "",
    carrera: "",
    asesorI: "",
  });

  const nombretabla = "api/residentesuploads";
  const correo = props.graphData.graphData.graphData.mail;

  useEffect(() => {
    fetchDataAsync();
  }, [correo]);

  async function fetchDataAsync() {
    try {
      const responseData = await fetchData(nombretabla);
      const residenteSeleccionado = responseData.data.find(
        (item) => item.attributes.correo === correo
      );

      // Actualizar el estado solo con el nombre del residente
      const nombreResidente = residenteSeleccionado
        ? residenteSeleccionado.attributes.nombre
        : "";
      const ncontrol = residenteSeleccionado
        ? residenteSeleccionado.attributes.ncontrol
        : "";
      const nproyecto = residenteSeleccionado
        ? residenteSeleccionado.attributes.nombre_anteproyecto
        : "";
      const perio = residenteSeleccionado
        ? residenteSeleccionado.attributes.periodo
        : "";
      const nempresa = residenteSeleccionado
        ? residenteSeleccionado.attributes.empresa
        : "";
      const asesorex = residenteSeleccionado
        ? residenteSeleccionado.attributes.asesorE
        : "";
      const asesorin = residenteSeleccionado
        ? residenteSeleccionado.attributes.asesorI
        : "";
      const especialidad = residenteSeleccionado
        ? residenteSeleccionado.attributes.carrera
        : "";

      setNewItem({
        nombre: nombreResidente,
        ncontrol: ncontrol,
        nombre_anteproyecto: nproyecto,
        periodo: perio,
        empresa: nempresa,
        asesorE: asesorex,
        carrera: especialidad,
        asesorI: asesorin,
      });

      console.log("Esto es residente seleccionado", residenteSeleccionado);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }
  //##########################################################
  const obtenerFilasGuardadas = () => {
    const filasGuardadas = localStorage.getItem("filas");
    return filasGuardadas
      ? JSON.parse(filasGuardadas)
      : [
          { actividad: "", tiempo: "P" },
          { actividad: "", tiempo: "R" },
        ];
  };

  const obtenerColumnasGuardadas = () => {
    const columnasGuardadas = localStorage.getItem("columnas");
    return columnasGuardadas ? JSON.parse(columnasGuardadas) : [];
  };

  const obtenerColoresGuardados = () => {
    const coloresGuardados = localStorage.getItem("colores");
    return coloresGuardados
      ? JSON.parse(coloresGuardados)
      : Array(filas.length * columnas.length).fill("white");
  };

  const [filas, setFilas] = useState(obtenerFilasGuardadas);
  const [columnas, setColumnas] = useState(obtenerColumnasGuardadas);
  const [cellColors, setCellColors] = useState(obtenerColoresGuardados);
  const [selectedCell, setSelectedCell] = useState({
    rowIndex: null,
    colIndex: null,
  });

  useEffect(() => {
    localStorage.setItem("filas", JSON.stringify(filas));
  }, [filas]);

  useEffect(() => {
    localStorage.setItem("columnas", JSON.stringify(columnas));
    localStorage.setItem("colores", JSON.stringify(cellColors));
  }, [columnas, cellColors]);

  const getCellPosition = (rowIndex, colIndex) => {
    return rowIndex * columnas.length + colIndex;
  };

  const agregarFila = () => {
    const nuevasFilas = [...filas, { actividad: "", tiempo: "P" }];
    const nuevosColores = [...cellColors];

    setFilas(nuevasFilas);

    // Ajusta el color de las nuevas celdas
    for (let i = 0; i < columnas.length; i++) {
      nuevosColores.push("white"); // Actividad (P)
      nuevosColores.push("white"); // Tiempo (R)
    }

    setCellColors(nuevosColores);
  };

  const agregarColumna = () => {
    const nuevasColumnas = [...columnas, ` ${columnas.length + 1}`];
    const nuevosColores = cellColors.map((fila) => [...fila, "white"]);

    setColumnas(nuevasColumnas);
    setCellColors(nuevosColores);
  };

  const eliminarColumna = (index) => {
    if (columnas.length > 1) {
      const nuevasColumnas = [...columnas];
      const nuevosColores = [];

      for (let i = 0; i < filas.length * 2; i++) {
        const filaOriginal = cellColors.slice(
          i * nuevasColumnas.length,
          (i + 1) * nuevasColumnas.length
        );
        const nuevaFila = [
          ...filaOriginal.slice(0, index),
          ...filaOriginal.slice(index + 1),
        ];
        nuevosColores.push(...nuevaFila);
      }

      nuevasColumnas.splice(index, 1);

      setColumnas(nuevasColumnas);
      setCellColors(nuevosColores);
    }
  };

  const eliminarFila = (index) => {
    const nuevasFilas = [...filas];
    const nuevosColores = [...cellColors];
    nuevasFilas.splice(index, 1);

    // Elimina los colores de las celdas de la fila
    nuevosColores.splice(index * columnas.length * 2, columnas.length * 2);

    setFilas(nuevasFilas);
    setCellColors(nuevosColores);
  };

  const handleCellClick = (rowIndex, colIndex) => {
    const nuevosColores = [...cellColors];
    const cellPosition = getCellPosition(rowIndex, colIndex);
    setSelectedCell({ rowIndex, colIndex });

    if (rowIndex % 2 === 0) {
      // Para las filas de actividad (P)
      nuevosColores[cellPosition] =
        nuevosColores[cellPosition] === "white" ? "blue" : "white";
    } else {
      // Para las filas de tiempo (R)
      nuevosColores[cellPosition] =
        nuevosColores[cellPosition] === "white" ? "red" : "white";
    }

    setCellColors(nuevosColores);
  };

  const eliminarDatoLocalStorage = () => {
    // Supongamos que quieres eliminar un elemento llamado "miDato"
    
    localStorage.removeItem("filas");
    localStorage.removeItem("columnas");
    localStorage.removeItem("colores");
    alert("El dato ha sido eliminado del Local Storage.");
    window.location.reload();
  };

  return (
    <div className="contenido__seguimientoresidencia">
      <h2>SEGUIMIENTO RESIDENCIA</h2>
      <div className="Seguimientoresidencia__preguntas">
        <div className="contenido__preguntas">
          <div className="informacion__pregunta">
            <span>Nombre del residente:</span>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del residente"
              value={newItem.nombre}
              readOnly
            />
            <span>Numero de control:</span>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del residente"
              value={newItem.ncontrol}
              readOnly
            />
            <span>Nombre Proyecto:</span>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del residente"
              value={newItem.nombre_anteproyecto}
              readOnly
            />
            <span>Empresa:</span>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del residente"
              value={newItem.empresa}
              readOnly
            />
          </div>
          <div className="informacion__pregunta">
            <span>Asesor Externo:</span>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del residente"
              value={newItem.asesorE}
              readOnly
            />
            <span>Asesor Interno:</span>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del residente"
              value={newItem.asesorI}
              readOnly
            />
            <span>Periodo :</span>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del residente"
              value={newItem.periodo}
              readOnly
            />
          </div>
        </div>
        <div>
          <table className= "mi-tabla2"border="1">
            <thead>
              <tr >
                <th style={{ backgroundColor: '#1a3968' }}>
                  <font color="White">ACTIVIDAD</font>
                </th>
                <th style={{ backgroundColor: '#1a3968' }}>
                  <font color="White">TIEMPO</font>
                </th>
                {columnas.map((nombreColumna, index) => (
                  <th style={{ backgroundColor: '#1a3968' }}
                    key={index}
                    onClick={() => handleCellClick(0, index)}
                    onDoubleClick={() => handleCellClick(0, index)}
                  >
                    <font color="White">{nombreColumna}</font>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <tr bgcolor="white">
                    <td rowSpan={2}>
                      <font color="black">
                        <input
                          type="text"
                          className="actividad"
                          value={fila.actividad}
                          onChange={(e) => {
                            const nuevasFilas = [...filas];
                            nuevasFilas[rowIndex].actividad = e.target.value;
                            setFilas(nuevasFilas);
                          }}
                        />
                      </font>
                    </td>
                    <td>
                      <font color="black">{fila.tiempo}</font>
                    </td>
                    {columnas.map((_, colIndex) => (
                      <td
                        key={colIndex}
                        onClick={() => handleCellClick(rowIndex * 2, colIndex)}
                        onDoubleClick={() =>
                          handleCellClick(rowIndex * 2, colIndex)
                        }
                        style={{
                          backgroundColor:
                            cellColors[getCellPosition(rowIndex * 2, colIndex)],
                        }}
                      >
                        <font color="black"></font>
                      </td>
                    ))}
                  </tr>
                  <tr bgcolor="white">
                    <td>
                      <font color="black">R</font>
                    </td>
                    {columnas.map((_, colIndex) => (
                      <td
                        key={colIndex + 1}
                        onClick={() =>
                          handleCellClick(rowIndex * 2 + 1, colIndex)
                        }
                        onDoubleClick={() =>
                          handleCellClick(rowIndex * 2 + 1, colIndex)
                        }
                        style={{
                          backgroundColor:
                            cellColors[
                              getCellPosition(rowIndex * 2 + 1, colIndex)
                            ],
                        }}
                      >
                        <font color="white"></font>
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
              <tr>
                <th>OBSERVACIONES</th>
                <th>{/* Celda vacía */}</th>
                {console.log("ESTO ES OLUMNAS", columnas)}
                {Array.from({ length: 3 }).map((_, groupIndex) => {
                  const totalDays = columnas.length;
                  const daysPerColumn = Math.ceil(totalDays / 3);
                  const startDay = groupIndex * daysPerColumn + 1;
                  const endDay = Math.min(
                    (groupIndex + 1) * daysPerColumn,
                    totalDays
                  );

                  return (
                    <th key={groupIndex} colSpan={endDay - startDay + 1}></th>
                  );
                })}
              </tr>
            </tbody>
          </table>
          <br />
          <button className="btn-asig" onClick={agregarFila}>
            Agregar Actividad
          </button>
          <button className="btn-asig" onClick={agregarColumna}>
            Agregar Semana
          </button>
          <button
            className="btn-asig"
            onClick={() => eliminarFila(filas.length - 1)}
          >
            Eliminar Última Actividad
          </button>
          <button
            className="btn-asig"
            onClick={() => eliminarColumna(columnas.length - 1)}
          >
            Eliminar Última Semana
          </button>
        </div>
        <button className="btn-asig" onClick={handleCrearClick}>
          Imprimir Evaluacion Interna 1
        </button>
        <button className="btn-asig" onClick={eliminarDatoLocalStorage}>
        Eliminar Dato del Local Storage
      </button>
      </div>

      {mostrarPopup && (
        <div className="popuphorizontal">
          <div className="popup-contenidohorizontal">
            <table className="mi-tabla3">
              <tbody>
                <tr>
                <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '10px', margin: '0', width: '10%' }}>
  <img
    src="https://istmo.tecnm.mx/wp-content/uploads/2021/08/logo-tec-png-naranja.png"
    alt="Descripción de la imagen"
    style={{ width: '100%', height: 'auto', margin: '-10px' }}
  />
</td>

                  <td style={{ textAlign: "center", fontWeight: "bold", padding: 0, margin: 0 }}>
                    Instituto Tecnológico Del Istmo
                    <br />
                    "Por una Tecnología Propia como principio de libertad"
                    <br />
                    SEGUIMIENTO DE PROYECTO DE RESIDENCIA
                    <br />
                    PROFESIONAL
                  </td>
                  <td style={{ textAlign: "center", fontWeight: "bold" }}>
                    Código:
                    <br />
                    FR-ITISTMO-7.5.1-07-05
                    <br />
                    Versión:
                    <br />
                    Rev. 1
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="contenido__preguntas">
              <div className="informacion__pregunta">
                <p style={{ textAlign: "left", fontWeight: "bold" }} >
                  ESTUDIANTE: {newItem.nombre}
                </p>
                <p style={{ textAlign: "left", fontWeight: "bold" }}>
                  NOMBRE DEL PROYECTO: {newItem.nombre_anteproyecto}
                </p>
                <p style={{ textAlign: "left" , fontWeight: "bold"}}>
                  ASESOR EXTERNO: {newItem.asesorE}
                </p>
                <p style={{ textAlign: "left" , fontWeight: "bold"}}>
                  PERIODO DE REALIZAION: {newItem.periodo}
                </p>
              </div>
              <div className="informacion__pregunta">
                <p style={{ textAlign: "left" , fontWeight: "bold"}}>
                  NUMERO DE CONTROL: {newItem.ncontrol}
                </p>
                <p style={{ textAlign: "left" , fontWeight: "bold" }}>EMPRESA: {newItem.empresa}</p>
                <p style={{ textAlign: "left" , fontWeight: "bold"}}>
                  ASESOR INTERNO: {newItem.asesorI}
                </p>
              </div>
            </div>

            <table className="mi-tabla2">
              <thead>
                <tr bgcolor="#1a3968">
                  <th>ACTIVIDAD</th>
                  <th>TIEMPO</th>
                  {columnas.map((nombreColumna, index) => (
                    <th
                      key={index}
                      onClick={() => handleCellClick(0, index)}
                      onDoubleClick={() => handleCellClick(0, index)}
                    >
                      {nombreColumna}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filas.map((fila, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <tr bgcolor="white">
                      <td rowSpan={2}>
                        <font color="black">
                          <input
                            type="text"
                            className={`actividad ${mostrarPopup ? 'sin-borde' : ''}`}
                            value={fila.actividad}
                            onChange={(e) => {
                              const nuevasFilas = [...filas];
                              nuevasFilas[rowIndex].actividad = e.target.value;
                              setFilas(nuevasFilas);
                            }}
                          />
                        </font>
                      </td>
                      <td>
                        <font color="black">{fila.tiempo}</font>
                      </td>
                      {columnas.map((_, colIndex) => (
                        <td
                          key={colIndex}
                          onClick={() =>
                            handleCellClick(rowIndex * 2, colIndex)
                          }
                          onDoubleClick={() =>
                            handleCellClick(rowIndex * 2, colIndex)
                          }
                          style={{
                            backgroundColor:
                              cellColors[
                                getCellPosition(rowIndex * 2, colIndex)
                              ],
                          }}
                        >
                          <font color="black"></font>
                        </td>
                      ))}
                    </tr>
                    <tr bgcolor="white">
                      <td>
                        <font color="black">R</font>
                      </td>
                      {columnas.map((_, colIndex) => (
                        <td
                          key={colIndex + 1}
                          onClick={() =>
                            handleCellClick(rowIndex * 2 + 1, colIndex)
                          }
                          onDoubleClick={() =>
                            handleCellClick(rowIndex * 2 + 1, colIndex)
                          }
                          style={{
                            backgroundColor:
                              cellColors[
                                getCellPosition(rowIndex * 2 + 1, colIndex)
                              ],
                          }}
                        >
                          <font color="white"></font>
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                ))}
                <tr>
                  <th>OBSERVACIONES</th>
                  <th>{/* Celda vacía */}</th>
                  {console.log("ESTO ES OLUMNAS", columnas)}
                  {Array.from({ length: 3 }).map((_, groupIndex) => {
                    const totalDays = columnas.length;
                    const daysPerColumn = Math.ceil(totalDays / 3);
                    const startDay = groupIndex * daysPerColumn + 1;
                    const endDay = Math.min(
                      (groupIndex + 1) * daysPerColumn,
                      totalDays
                    );

                    return (
                      <th key={groupIndex} colSpan={endDay - startDay + 1}></th>
                    );
                  })}
                </tr>

                <tr>
                  <th>ENTREGA DE REPORTE</th>
                  <th><table style={{ border: 'none', width: '100%' }}>
                          <tr>
                            <td style={{ borderBottom: '1px solid black' }}>Asesor Interno: </td>
                          </tr>
                          <tr>
                            <td style={{ borderBottom: '1px solid black' }}>Estudiante</td>
                          </tr>
                          <tr>
                            <td style={{ borderBottom: '1px solid black' }}>Jefe Depto.</td>
                          </tr>
                        </table></th>
                  {console.log("ESTO ES OLUMNAS", columnas)}
                  {Array.from({ length: 3 }).map((_, groupIndex) => {
                    const totalDays = columnas.length;
                    const daysPerColumn = Math.ceil(totalDays / 3);
                    const startDay = groupIndex * daysPerColumn + 1;
                    const endDay = Math.min((groupIndex + 1) * daysPerColumn, totalDays);

                    return (
                      <th key={groupIndex} colSpan={endDay - startDay + 1}>
                        <table style={{ border: 'none', width: '100%' }}>
                          <tr>
                            <td style={{ borderBottom: '1px solid black' }}>{newItem.asesorI}</td>
                          </tr>
                          <tr>
                            <td style={{ borderBottom: '1px solid black' }}>{newItem.nombre}</td>
                          </tr>
                          <tr>
                            <td style={{ borderBottom: '1px solid black' }}>{newItem.asesorE}</td>
                          </tr>
                        </table>
                      </th>
                    );
                  })}
                </tr>
                
              </tbody>
            </table>

            <button className="btn-asig" onClick={imprimir3}>
              Imprimir
            </button>
            <button className="btn-asig" onClick={handleCerrarPopup}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Seguimientoresidencia;
