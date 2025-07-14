import { useEffect, useState } from 'react';

interface User {
  id: number;
  email: string;
  username: string;
  role: 'user' | 'admin';
  created_at: string;
}

function TestMe() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/me', {
      method: 'GET',
      credentials: 'include',
    })
      .then(async res => {
        if (!res.ok) {
          const errBody = await res.json().catch(() => null);
          throw new Error(errBody?.error || res.statusText);
        }
        return res.json();
      })
      .then(data => {
        setUser(data.user);
        setError(null);
      })
      .catch(err => {
        setUser(null);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!user) return <div>Aucun utilisateur connecté.</div>;

  return (
    <div>
      <h2>Utilisateur connecté</h2>
      <p>Id: {user.id}</p>
      <p>Email: {user.email}</p>
      <p>Username: {user.username}</p>
      <p>Role: {user.role}</p>
      <p>Inscrit le: {new Date(user.created_at).toLocaleString()}</p>
    </div>
  );
}

export default TestMe;
