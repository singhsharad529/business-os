import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/Logo';
import { AlertCircle, Building2, User, UserCog, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'super_admin' | 'company_admin' | 'standard_user' | ''>('super_admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const loggedInUser = await login(email, password); // user object or null
    console.log('loggedInUser', loggedInUser);


    if (!loggedInUser) {
      setError('Invalid email or password');
      setIsLoading(false);
      return;
    }

    // Navigate to voicebot dashboard by default (new default behavior)
    navigate('/app/voicebot/dashboard');


  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/images/screenshot_2025-12-10_at_10.39.06_am.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-white/80 to-bg/90 backdrop-blur-[2px]" />
      <div className="w-full max-w-md relative z-10">

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-text-main mb-2">Welcome back</h1>
          <p className="text-text-muted">Sign in to your BusinessOS account</p>
        </div>

        {/* Login Card */}
        <div className="card p-8 shadow-xl">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Error Message */}
            {error && (
              <div className="bg-danger-soft border border-danger text-danger px-4 py-3 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}


            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Select Role
              </label>


              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('super_admin')}
                  className={`flex items-center flex-col justify-center gap-2 border rounded-lg py-3 transition-all
        ${role === 'super_admin'
                      ? 'bg-primary-soft text-black border-primary shadow-sm'
                      : 'border-border-muted text-text-muted hover:bg-surface'
                    }`}
                >
                  <UserCog className="w-4 h-4" />
                  <span className="text-sm font-medium">Super Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('company_admin')}
                  className={`flex items-center flex-col justify-center gap-2 border rounded-lg py-3 px-1 transition-all
        ${role === 'company_admin'
                      ? 'bg-primary-soft text-black border-primary shadow-sm'
                      : 'border-border-muted text-text-muted hover:bg-surface'
                    }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Company Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('standard_user')}
                  className={`flex items-center flex-col justify-center gap-2 border rounded-lg py-3 transition-all
        ${role === 'standard_user'
                      ? 'bg-primary-soft text-black border-primary shadow-sm'
                      : 'border-border-muted text-text-muted hover:bg-surface'
                    }`}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">User</span>
                </button>
              </div>
            </div>


            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-main mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@company.com"
                required
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-main mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
                required
              />
            </div>



            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>
          <div className="mt-6 pt-6 border-t border-border-subtle">
            <p className="text-xs text-text-muted text-center">
              Demo credentials:<br />
              Super Admin: admin@businessos.com / admin123<br />
              Company Admin: john@acmeprocure.com / password
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
