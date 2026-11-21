import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1815] flex items-center justify-center">
        <div className="text-[#F4EFEA] text-lg">Se încarcă...</div>
      </div>
    );
  }

  return user ? <Dashboard /> : <Login />;
}
