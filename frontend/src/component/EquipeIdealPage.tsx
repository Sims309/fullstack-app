import React, { useState, useContext, useEffect } from 'react';
import { useEquipeIdeal } from '@/contexts/EquipeIdealContext';
import { FORMATIONS, Formation } from '@/constants/formations';
import { UserContext } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

// Composant PlayerOnField (existant)
const PlayerOnField = ({ joueur }: { joueur: any }) => (
  <div className="w-[70px] h-[70px] bg-white rounded-full border-2 border-gray-800 flex flex-col items-center justify-center text-xs font-bold shadow-lg">
    <img
      src={joueur.image || joueur.imageUrl || '/placeholder.jpg'}
      alt={joueur.nom || joueur.name}
      className="w-12 h-12 rounded-full object-cover mb-1"
    />
    <span className="text-[10px] text-center leading-tight">
      {(joueur.nom || joueur.name).split(' ').slice(-1)[0]}
    </span>
  </div>
);

// Composant TerrainFootball
const TerrainFootball = ({ joueurs }: { joueurs: any[] }) => (
  <div style={{
    position: 'relative', width: '100%', maxWidth: '600px', height: '400px', margin: '0 auto',
    backgroundColor: '#2d7d32', border: '3px solid white', borderRadius: 8, overflow: 'hidden'
  }}>
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="2" />
      <circle cx="50%" cy="50%" r="60" fill="none" stroke="white" strokeWidth="2" />
      <circle cx="50%" cy="50%" r="3" fill="white" />
      <rect x="25%" y="0" width="50%" height="15%" fill="none" stroke="white" strokeWidth="2" />
      <rect x="35%" y="0" width="30%" height="7%" fill="none" stroke="white" strokeWidth="2" />
      <rect x="25%" y="85%" width="50%" height="15%" fill="none" stroke="white" strokeWidth="2" />
      <rect x="35%" y="93%" width="30%" height="7%" fill="none" stroke="white" strokeWidth="2" />
      <rect x="45%" y="0" width="10%" height="3%" fill="white" />
      <rect x="45%" y="97%" width="10%" height="3%" fill="white" />
    </svg>
    {joueurs.map((j, idx) => {
      const pidNum = j.poste !== undefined ? parseInt(String(j.poste), 10) : idx + 1;
      const x = j.position_x ?? 50;
      const y = j.position_y ?? 50;
      return (
        <div key={j.id}
          title={`${j.prenom || j.name} ${j.nom || ''} – ${j.club}`}
          style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', width: 70, cursor: 'pointer' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#1976d2',
            border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 'bold' }}>
            {j.image ? (
              <img src={j.image} alt={j.nom || j.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : pidNum}
          </div>
          <div style={{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '2px 6px', borderRadius: 3,
            fontSize: 10, marginTop: 4, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {j.nom || j.name}
          </div>
        </div>
      );
    })}
  </div>
);

export default function EquipeIdealPage() {
  const { equipe } = useEquipeIdeal();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [formation, setFormation] = useState<Formation>(FORMATIONS[0]);
  const [viewMode, setViewMode] = useState<'terrain' | 'liste'>('terrain');
  const [joueurs, setJoueurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (!user) navigate('/'); }, [user]);

  const titulaires = equipe.slice(0, 11);
  const remplaçants = equipe.slice(11, 16);
  const handleGoBack = () => navigate('/accueil');

  const positionsDefaut: { [key: number]: { x: number; y: number } } = {
    1: { x: 50, y: 5 }, 2: { x: 30, y: 20 }, 3: { x: 70, y: 20 },
    4: { x: 85, y: 25 }, 5: { x: 15, y: 25 }, 6: { x: 30, y: 45 },
    7: { x: 50, y: 50 }, 8: { x: 70, y: 45 }, 9: { x: 20, y: 75 },
    10: { x: 50, y: 80 }, 11: { x: 80, y: 75 }
  };

  useEffect(() => {
    setLoading(true);
    if (!equipe || titulaires.length === 0) {
      setJoueurs([]);
      setLoading(false);
      return;
    }
    const js = titulaires.map((j, i) => {
      const pidNum = j.poste !== undefined ? parseInt(String(j.poste), 10) : i + 1;
      return {
        ...j,
        position_x: positionsDefaut[pidNum]?.x ?? 50,
        position_y: positionsDefaut[pidNum]?.y ?? 50,
        posteId: pidNum
      };
    });
    setJoueurs(js);
    setLoading(false);
  }, [equipe]);

  if (loading) return <div className="text-center py-12"><p>Chargement des joueurs...</p></div>;
  if (error) return (
    <div className="text-center py-12">
      <h2>Erreur</h2>
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={handleGoBack} className="px-4 py-2 bg-blue-500 text-white rounded">Retour à l'accueil</button>
    </div>
  );
  if (joueurs.length === 0) return <div className="text-center py-12"><h3>Aucun joueur trouvé pour ce poste</h3><p>Il n'y a actuellement aucun joueur enregistré pour ce poste.</p></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={handleGoBack} className="px-4 py-2 bg-gray-500 text-white rounded">← Retour à l'accueil</button>
        <h1 className="text-3xl font-bold">Équipe Idéale</h1>
        <div className="space-x-2">
          <button onClick={() => setViewMode('liste')} className={`px-4 py-2 rounded ${viewMode === 'liste' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Liste</button>
          <button onClick={() => setViewMode('terrain')} className={`px-4 py-2 rounded ${viewMode === 'terrain' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Terrain</button>
        </div>
      </div>

      {viewMode === 'terrain' ? (
        <>
          <h2 className="text-xl mb-4 text-center">Formation sur le terrain</h2>
          <TerrainFootball joueurs={joueurs} />
          <div className="mt-4 text-center text-gray-600 text-sm"><span className="inline-block w-3 h-3 bg-white rounded-full border border-gray-800 mr-2"></span> Joueurs</div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {joueurs.map((j) => (
            <div key={j.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
              <img src={j.image} alt={j.nom || j.name} className="w-full h-40 object-cover rounded mb-4" />
              <h3 className="text-xl font-semibold mb-2">{j.prenom || j.name} {j.nom}</h3>
              <p className="text-gray-600"><strong>Nationalité:</strong> {j.nationalite || j.country}</p>
              <p className="text-gray-600"><strong>Club:</strong> {j.club}</p>
              <p className="text-gray-600"><strong>Poste:</strong> {j.posteId}</p>
            </div>
          ))}
        </div>
      )}

      {remplaçants.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Remplaçants</h2>
          <div className="flex space-x-4 overflow-x-auto">
            {remplaçants.map((j) => <PlayerOnField key={j.id} joueur={j} />)}
          </div>
        </div>
      )}

      {equipe.length === 0 && (
        <div className="mt-8 text-center py-12 bg-gray-100 rounded-lg">
          <p className="text-gray-600 text-lg">Votre équipe idéale est vide. Ajoutez des joueurs depuis les pages de postes !</p>
        </div>
      )}
    </div>
  );
}
