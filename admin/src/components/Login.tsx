import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { signIn, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Te rog completează ambele câmpuri');
      return;
    }

    try {
      await signIn(email, password);
    } catch (err: any) {
      setLocalError('Email sau parolă incorectă');
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1815] flex items-center justify-center">
      <div className="bg-[#F4EFEA] p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl text-[#1E1815] mb-2 text-center">
          Be Still
        </h1>
        <p className="text-sm text-[#1E1815]/60 mb-8 text-center uppercase tracking-wider">
          ADMINISTRARE
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1E1815] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent"
              placeholder="email@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1E1815] mb-2">
              Parolă
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#1E1815]/20 rounded bg-white text-[#1E1815] placeholder:text-[#1E1815]/40 focus:outline-none focus:ring-2 focus:ring-[#7A5363] focus:border-transparent"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {localError && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
              {localError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E1815] text-[#F4EFEA] py-3 rounded font-medium hover:bg-[#2A1F1C] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Se încarcă...' : 'Autentificare'}
          </button>
        </form>
      </div>
    </div>
  );
}
