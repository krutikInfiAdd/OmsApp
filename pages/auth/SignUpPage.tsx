import React, { useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserIcon } from '../../components/icons/UserIcon';
import { MailIcon } from '../../components/icons/MailIcon';
import { LockClosedIcon } from '../../components/icons/LockClosedIcon';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signUp, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (name && email && password) {
      const success = await signUp(name, email, password);
      if (!success) {
        setError('An account with this email already exists.');
      }
    } else {
       setError('Please fill all fields.');
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
        Create a new account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center bg-red-100 dark:bg-red-900/30 p-2 rounded-md">
                {error}
            </p>
        )}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <div className="mt-1">
            <Input id="name" name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} icon={<UserIcon />} />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <div className="mt-1">
            <Input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} icon={<MailIcon />} />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="mt-1">
            <Input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} icon={<LockClosedIcon />} />
          </div>
        </div>
         <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm Password
          </label>
          <div className="mt-1">
            <Input id="confirm-password" name="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} icon={<LockClosedIcon />} />
          </div>
        </div>
        <div>
          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <NavLink to="/signin" className="font-medium text-primary-600 hover:text-primary-500">
          Sign in
        </NavLink>
      </p>
    </>
  );
};

export default SignUpPage;