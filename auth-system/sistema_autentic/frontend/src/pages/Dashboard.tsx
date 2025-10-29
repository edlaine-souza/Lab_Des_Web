import { useAuth } from "../context/AuthContext";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card slide-up">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
         
        </div>
        
        <div className="welcome-section">
          <div className="welcome-content">
            <h2 className="welcome-title">Olá, {user?.name}! 👋</h2>
            <p className="welcome-message">Bem-vindo ao sistema de autenticação</p>
          </div>
        </div>
        
        <div className="user-info">
          <div className="info-item">
            <span className="info-label">ID do Usuário</span>
            <span className="info-value">#{user?.id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Status</span>
            <span className="status-online">Online</span>
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleLogout}
            className="btn btn-logout"
          >
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
};