import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Interfaces separadas para usuário completo e usuário seguro (sem senha)
interface User {
  id: number;
  email: string;
  password: string;
  name: string;
}

interface SafeUser {
  id: number;
  email: string;
  name: string;
}

// DADOS MOCKADOS - "Banco de dados" em memória
const users: User[] = [
  {
    id: 1,
    email: 'usuario@teste.com',
    password: 'password', // Senha igual ao frontend
    name: 'Usuário Teste'
  },
  {
    id: 2,
    email: 'admin@teste.com',
    password: 'password',
    name: 'Administrador'
  }
];

// Simulação de tokens ativos (em memória)
const activeTokens = new Map<string, { userId: number; user: SafeUser }>();

// Gerar token simples
function generateToken(): string {
  return `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Middleware para verificar token
function authenticateToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acesso necessário'
    });
  }

  const tokenData = activeTokens.get(token);
  if (!tokenData) {
    return res.status(403).json({
      success: false,
      message: 'Token inválido ou expirado'
    });
  }

  // Adicionar usuário à requisição
  (req as any).user = tokenData.user;
  next();
}

// Rota de saúde da API
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: '🚀 API de Autenticação funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota de login - COMPATÍVEL COM FRONTEND
app.post('/api/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Tentativa de login:', { email });

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar senha (simples comparação)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Gerar token
    const token = generateToken();
    
    // Criar usuário seguro (sem senha)
    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      name: user.name
    };
    
    // Salvar token ativo
    activeTokens.set(token, {
      userId: user.id,
      user: safeUser
    });

    console.log('✅ Login bem-sucedido:', user.email);

    // Resposta COMPATÍVEL com o frontend
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token: token,
      user: safeUser
    });

  } catch (error) {
    console.error('💥 Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para verificar token - COMPATÍVEL COM FRONTEND
app.get('/api/verify', authenticateToken, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    res.json({
      success: true,
      message: 'Token válido',
      user: user
    });
  } catch (error) {
    console.error('💥 Erro na verificação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar token'
    });
  }
});

// Rota de logout - COMPATÍVEL COM FRONTEND
app.post('/api/logout', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      activeTokens.delete(token);
    }

    console.log('🚪 Logout realizado');

    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('💥 Erro no logout:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota protegida de exemplo
app.get('/api/protected-data', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  
  res.json({
    success: true,
    message: 'Esta é uma rota protegida!',
    data: {
      secret: 'Dados confidenciais apenas para usuários autenticados',
      user: user,
      timestamp: new Date().toISOString()
    }
  });
});

// Rota para listar usuários (apenas para desenvolvimento)
app.get('/api/users', (req: Request, res: Response) => {
  const usersWithoutPasswords: SafeUser[] = users.map(user => ({
    id: user.id,
    email: user.email,
    name: user.name
  }));
  
  res.json({
    success: true,
    users: usersWithoutPasswords
  });
});

// Rota não encontrada
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 BACKEND COMPATÍVEL INICIADO!');
  console.log('='.repeat(50));
  console.log(`📡 URL: http://localhost:${PORT}`);

});