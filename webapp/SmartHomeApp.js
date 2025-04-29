const SmartHomeApp = () => {
    const luces = [0, 1, 2, 3, 4];
    const puertas = [0, 1, 2, 3];
    const [foto, setFoto] = React.useState(null);
    const [estadoPuertas, setEstadoPuertas] = React.useState([true, true, true, true, true]);
    const URL = 'http://192.168.100.2:3000'; 
  
    const cambiarLuz = (id, estado) => {
      fetch(`${URL}/lights/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state: estado })
      });
    };
  
    const tomarFoto = () => {
      fetch(`${URL}/picture`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al tomar la foto');
          }
          return fetch(`${URL}/last-picture`);
        })
        .then(res => {
          if (!res.ok) {
            throw new Error('No se pudo obtener la imagen');
          }
          return res.blob();
        })
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result;
            setFoto(base64data);
          };
          reader.readAsDataURL(blob);
        })
        .catch(error => {
          console.error('Error en tomarFoto:', error);
        });
    };
  
    const cambiarPuerta = (id) => {
      console.log('Cambiando puerta:', id);
      const nuevaEstado = [...estadoPuertas];
      const nuevoValor = !estadoPuertas[id];
  
      fetch(`${URL}/doors/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state: nuevoValor })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Error al actualizar puerta');
          }
          return res.json();
        })
        .then(data => {
          console.log('Respuesta del servidor:', data);
          if (data.success) {
            nuevaEstado[id] = nuevoValor;
            setEstadoPuertas(data.doors);
          }
        })
        .catch(err => {
          console.error('Error en fetch:', err);
        });
    };
  
    return (
      <div className="app">
        <h1>Casa Inteligente - Proyecto 1 - Sistemas Empotrados - Kevin Guzman - Ignacio Calderon - Sergio Rios</h1>
  
        <section>
          <h2>Luces</h2>
          {luces.map(id => (
            <div className="device" key={id}>
              <span>Luz {id + 1}</span>
              <div>
                <button className="btn-on" onClick={() => cambiarLuz(id, true)}>Encender</button>
                <button className="btn-off" onClick={() => cambiarLuz(id, false)}>Apagar</button>
              </div>
            </div>
          ))}
        </section>
  
        <section>
          <h2>Puertas</h2>
          {puertas.map(id => (
            <div className="device" key={id}>
              <span>Puerta {id + 1}</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button onClick={() => cambiarPuerta(id)}>Simular apertura</button>
                <div className={`indicator ${estadoPuertas[id] ? 'on' : 'off'}`}></div>
              </div>
            </div>
          ))}
        </section>
  
        <section>
          <h2>Cámara del Jardín</h2>
          <button className="btn-on" onClick={tomarFoto}>Tomar Foto</button><br />
          {foto && <img src={foto} alt="Jardín" />}
        </section>
      </div>
    );
  };
  