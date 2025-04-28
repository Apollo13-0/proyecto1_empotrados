const Main = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <div>
      {isAuthenticated ? <SmartHomeApp /> : <Login onLogin={() => setIsAuthenticated(true)} />}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
