const Login = ({ onLogin }) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (username === 'admin' && password === '1234') {
        onLogin();
      } else {
        alert('Credenciales incorrectas');
      }
    };
  
    return (
      <div>
        <h2>Iniciar Sesión</h2>
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
      </div>
    );
  };
  