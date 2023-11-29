import React from 'react';
import { SignOutButton } from '../../components/SignOutButton'; // Asegúrate de importar correctamente

const Salir = () => {
  

  return (
    <div className="contenido">
      <div className="contenido__texto">
        <h1>Recuerda que tienes que realizar las evaluaciones correspondientes a su alumno asignado!
        
        </h1>
        <h2>HASTA LUEGO!</h2>
        {/* Pasa la función de redirección al SignOutButton */}
        <SignOutButton  />
      </div>
      <div className="contenido__fondo">
        
      </div>
    </div>
  );
};

export default Salir;
