import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginLayout } from '../components/templates';
import { LoginForm } from '../components/molecules';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <LoginLayout>
      <LoginForm onSuccess={handleLoginSuccess} />
    </LoginLayout>
  );
};

export default Login;
