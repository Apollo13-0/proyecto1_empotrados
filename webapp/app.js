const App = () => {
  const luces = [0, 1, 2, 3, 4];
  const puertas = [0, 1, 2, 3];
  const [foto, setFoto] = React.useState(null);
  const [estadoPuertas, setEstadoPuertas] = React.useState([false, false, false, false]);

  const cambiarLuz = (id, estado) => {
    fetch(`/lights/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ state: estado })
    });
  };
  
  const tomarFoto = () => {
    // Primero tomar la foto
    fetch('/picture')
      .then(() => {
        // Luego obtener la imagen
        return fetch('/last-picture');
      })
      .then(res => res.blob())
      .then(blob => setFoto(URL.createObjectURL(blob)));
  };

  const cambiarPuerta = (id) => {

    const nuevaEstado = [...estadoPuertas];
    nuevaEstado[id] = !nuevaEstado[id];

    fetch(`/doors/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ state: nuevaEstado[id] })
    });

    setEstadoPuertas(nuevaEstado);

  };

  
  // const cambiarLuz = (id, estado) => {
  //   fetch(`/api/luces/${id}/${estado}`, { method: 'POST' });
  // };

  // const tomarFoto = () => {
  //   fetch('/picture')
  //     .then(res => res.blob())
  //     .then(blob => setFoto(URL.createObjectURL(blob)));
  // };

  const togglePuerta = (id) => {
    // Esto es solo simulado, en tu backend real vendría del API
    const nuevaEstado = [...estadoPuertas];
    nuevaEstado[id] = !nuevaEstado[id];
    setEstadoPuertas(nuevaEstado);
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
              <button className="btn-on" onClick={() => cambiarLuz(id, 'on')}>Encender</button>
              <button className="btn-off" onClick={() => cambiarLuz(id, 'off')}>Apagar</button>
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

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
