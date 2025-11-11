import React, { useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { MailIcon } from '../../components/icons/MailIcon';
import { LockClosedIcon } from '../../components/icons/LockClosedIcon';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('SuperAdminInfi@yopmail.com');
  const [password, setPassword] = useState('Adm!n123');
  const [error, setError] = useState<string | null>(null);
  const { signIn, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (email && password) {
      const success = await signIn(email, password);
      if (!success) {
        setError('Invalid email or password. Please try again.');
      }
    } else {
      setError('Please fill in both fields.');
    }
  };
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
        Sign in to your account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 text-center bg-red-100 dark:bg-red-900/30 p-2 rounded-md">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <div className="mt-1">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<MailIcon />}
            />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="mt-1">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<LockClosedIcon />}
            />
          </div>
        </div>
        <div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Not a member?{' '}
        <NavLink to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
          Sign up
        </NavLink>
      </p>
    </>
  );
};

export default SignInPage;