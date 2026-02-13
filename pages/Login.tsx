import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-brand-900">WOLTERS</h2>
          <p className="mt-2 text-sm text-slate-600">Portal Interno de Gestión</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-700">
                {error}
              </div>
            )}

            <Input
              id="email"
              name="email"
              type="email"
              label="Email corporativo"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@wolters.com"
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="1234"
            />

            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Iniciar Sesión
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  Acceso restringido
                </span>
              </div>
            </div>
            <div className="mt-6 text-center text-xs text-slate-400">
              Solo personal autorizado de Wolters Recruitment.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;