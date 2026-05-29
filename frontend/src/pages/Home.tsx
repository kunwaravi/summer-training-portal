import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = isLogin 
        ? { email, password } 
        : { email, password, name, fatherName, collegeName, branchName };
      
      const response = await api.post(endpoint, data);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">
          {isLogin ? 'Student Login' : 'Student Registration'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Father's Name" value={fatherName} onChange={(e) => setFatherName(e.target.value)} required className="w-full p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="College Name" value={collegeName} onChange={(e) => setCollegeName(e.target.value)} required className="w-full p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Branch (e.g. ECE, EEE)" value={branchName} onChange={(e) => setBranchName(e.target.value)} required className="w-full p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-blue-500" />
            </>
          )}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-blue-500" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-blue-500" />
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold transition flex items-center justify-center gap-2">
            {isLogin ? <><LogIn size={20} /> Login</> : <><UserPlus size={20} /> Register</>}
          </button>
        </form>
        
        <p className="mt-4 text-center text-slate-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-blue-400 hover:underline">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
      
      <div className="mt-12 text-center">
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Summer Training Portal
        </h1>
        <p className="text-slate-400 max-w-lg">
          Advance your skills in C, C++, IoT, and Embedded Systems with our 4-week structured training program. Get certified by industry experts.
        </p>
      </div>
    </div>
  );
};

export default Home;
