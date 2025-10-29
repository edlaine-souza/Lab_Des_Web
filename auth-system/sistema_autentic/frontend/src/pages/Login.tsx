import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <div className="login-header">
          <h1 className="login-title">Bem-vindo</h1>
          <p className="login-subtitle">Entre na sua conta para continuar</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="seu@email.com"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="Sua senha"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Entrando...' : 'Entrar na Conta'}
          </button>
        </form>

        <div className="credentials-section">
          <h4 className="credentials-title">Credenciais de Teste</h4>
          <div className="credential-item">
            <span className="credential-label">Email:</span>
            <span className="credential-value">usuario@teste.com</span>
          </div>
          <div className="credential-item">
            <span className="credential-label">Senha:</span>
            <span className="credential-value">password</span>
          </div>
          <div className="credential-item">
            <span className="credential-label">Email:</span>
            <span className="credential-value">admin@teste.com</span>
          </div>
          <div className="credential-item">
            <span className="credential-label">Senha:</span>
            <span className="credential-value">password</span>
          </div>
        </div>
      </div>
    </div>
  );
};