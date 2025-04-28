const Login = ({ onLogin }) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false); // 🔥 nuevo estado
  

  //aqui va el codigo para conectar al back  
    const handleSubmit = (e) => {
      e.preventDefault();
      setLoading(true);
      setTimeout(() => {
        if (username === 'admin' && password === '1234') {
          onLogin();
        } else {
          alert('Credenciales incorrectas');
          setLoading(false); 
        }
      }, 1000); // espera 1 segundo para dar más realismo
    };
  
    return (
      <div className="login">
        <h2>Iniciar Sesión</h2>
        {loading ? (
          <div className="spinner">Cargando...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Usuario"
            /><br/>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Contraseña"
            /><br/>
            <button type="submit">Entrar</button>
          </form>
        )}
      </div>
    );
  };
  