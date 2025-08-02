import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { UserContext } from "@/contexts/UserContext";

interface Joueur {
  posteId: number;
  id: number;
  name: string;
  country: string;
  image: string;
  fifa_points: number;
  age: number;
  club: string;
  nationalite: string;
  buts: number;
  passes: number;
  cartons_jaunes: number;
  cartons_rouges: number;
  statistics: string;
  biography: string;
  trophees_majeurs: string;
  youtubeUrl?: string;
  position_x?: number;
  position_y?: number;
}

interface PosteInfo {
  id: number;
  nom: string;
}

const postesMapping: Record<string, string> = {
  "1": "Gardiens de but",
  "2": "Défenseurs centraux",
  "3": "Latéraux droits",
  "4": "Latéraux gauches",
  "5": "Milieux défensifs",
  "6": "Milieux centraux",
  "7": "Milieux offensifs",
  "8": "Ailiers droits",
  "9": "Ailiers gauches",
  "10": "Seconds attaquants",
  "11": "Attaquants",
  "12": "Équipe Idéale"
};

const PostePage: React.FC = () => {
  const { posteId } = useParams<{ posteId: string }>();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [posteInfo, setPosteInfo] = useState<PosteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!posteId) return;
    setLoading(true);
    fetch(`/api/joueurs/poste/${posteId}`, { cache: "no-store", credentials: "include" })
      .then(res => res.ok ? res.json() : Promise.reject(`Erreur ${res.status}`))
      .then(data => {
        // Trie par fifa_points décroissant, meilleur premier dans tableau
        const sorted = (data.joueurs || data).slice().sort((a: Joueur, b: Joueur) => b.fifa_points - a.fifa_points);
        setJoueurs(sorted);
        setPosteInfo(data.posteInfo || { id: +posteId, nom: postesMapping[posteId] || `Poste ${posteId}` });
      })
      .catch(err => setError(`Erreur de chargement: ${err}`))
      .finally(() => setLoading(false));
  }, [posteId]);

  useEffect(() => { if (!user) navigate('/'); }, [user]);

  const handleGoBack = () => navigate('/accueil');
  const nextPlayer = () => setCurrentIndex(i => (i + 1) % joueurs.length);
  const prevPlayer = () => setCurrentIndex(i => (i - 1 + joueurs.length) % joueurs.length);
  const currentPlayer = joueurs[currentIndex];

  // Classement normal : N°1 pour le premier joueur (index 0, meilleur)
  // N°2 pour le deuxième joueur (index 1), etc.
  const classementNormal = currentIndex + 1;

  const renderMedal = (rank: number) => {
    switch(rank) {
      case 1:
        return <span className="text-yellow-400 ml-2" title="1ère place 🥇">🥇</span>;
      case 2:
        return <span className="text-gray-400 ml-2" title="2ème place 🥈">🥈</span>;
      case 3:
        return <span className="text-yellow-700 ml-2" title="3ème place 🥉">🥉</span>;
      default:
        return null;
    }
  }

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!currentPlayer) return <div>Aucun joueur trouvé.</div>;

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <button onClick={handleGoBack} className="mb-4 text-blue-600">&larr; Retour</button>

      {/* Titre du poste */}
      <h1 className="text-3xl font-bold mb-1 text-center">{postesMapping[posteId!]}</h1>

      {/* Classement sous le titre */}
      <div className="text-center text-5xl font-extrabold mb-2 flex justify-center items-center space-x-4">
        <span>N° {classementNormal}</span>
        {renderMedal(classementNormal)}
      </div>

      {/* Carousel des photos */}
      <div className="max-w-lg mx-auto mb-6 relative">
        <button onClick={prevPlayer} className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow">
          <ChevronLeft size={24} />
        </button>
        <img
          src={currentPlayer.image}
          alt={currentPlayer.name}
          className="w-full h-64 object-cover rounded-xl"
        />
        <button onClick={nextPlayer} className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Détails du joueur */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-2xl font-semibold text-center">{currentPlayer.name}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><strong>Points FIFA :</strong> {currentPlayer.fifa_points}</div>
          <div><strong>Club :</strong> {currentPlayer.club}</div>
          <div><strong>Âge :</strong> {currentPlayer.age}</div>
          <div><strong>Pays :</strong> {currentPlayer.country}</div>
          <div><strong>Buts :</strong> {currentPlayer.buts}</div>
          <div><strong>Passes :</strong> {currentPlayer.passes}</div>
          <div><strong>Cartons jaunes :</strong> <span className="text-yellow-500 font-bold">{currentPlayer.cartons_jaunes}</span></div>
          <div><strong>Cartons rouges :</strong> <span className="text-red-500 font-bold">{currentPlayer.cartons_rouges}</span></div>
        </div>
        <div className="flex items-center text-gray-600">
          <Trophy className="mr-2 text-[#FFD700]" />
          <span><strong>Trophées majeurs :</strong> {currentPlayer.trophees_majeurs}</span>
        </div>
        <div>
          <h3 className="font-medium">Statistiques globales</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">{currentPlayer.statistics}</p>
        </div>
        <div>
          <h3 className="font-medium">Biographie</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">{currentPlayer.biography}</p>
        </div>
      </div>
    </div>
  );
};

export default PostePage;