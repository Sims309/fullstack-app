import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight
} from "lucide-react";
import { UserContext } from "@/contexts/UserContext";

interface Joueur {
  posteId: number;
  id: number;
  name: string;
  country: string;
  image: string;
  fifa_points: number;
  biography: string;
  statistics: string;
  trophees_majeurs: string;
  age: number;
  club: string;
  nationalite: string;
  buts: number;
  passes: number;
  cartons_jaunes: number;
  cartons_rouges: number;
  youtubeUrl?: string;
  position_x?: number;
  position_y?: number;
}

interface PosteInfo {
  id: number;
  nom: string;
  description?: string;
}

const PostePage: React.FC = () => {
  const { posteId } = useParams<{ posteId: string }>();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [posteInfo, setPosteInfo] = useState<PosteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"terrain" | "liste">("liste");

  const postesMapping: { [key: string]: string } = {
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

  const positionsDefaut: { [key: number]: { x: number; y: number } } = {
    1: { x: 50, y: 5 },
    2: { x: 30, y: 20 },
    3: { x: 70, y: 20 },
    4: { x: 85, y: 25 },
    5: { x: 15, y: 25 },
    6: { x: 30, y: 45 },
    7: { x: 50, y: 50 },
    8: { x: 70, y: 45 },
    9: { x: 20, y: 75 },
    10: { x: 50, y: 80 },
    11: { x: 80, y: 75 }
  };

  useEffect(() => {
    if (!posteId) {
      setError("Poste non spécifié");
      setLoading(false);
      return;
    }

    const fetchJoueurs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Forcer le rechargement et éviter le 304 Not Modified
        const res = await fetch(
          `/api/joueurs/poste/${posteId}`,
          { credentials: "include", cache: "no-store" }
        );
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();

        const js: Joueur[] = (data.joueurs || data).map((j: Joueur) => ({
          ...j,
          position_x: j.position_x ?? positionsDefaut[j.posteId]?.x ?? 50,
          position_y: j.position_y ?? positionsDefaut[j.posteId]?.y ?? 50
        }));

        setJoueurs(js);

        if (data.posteInfo) {
          setPosteInfo(data.posteInfo);
        } else {
          setPosteInfo({ id: +posteId, nom: postesMapping[posteId] ?? `Poste ${posteId}` });
        }

        if (posteId === "12") setViewMode("terrain");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchJoueurs();
  }, [posteId]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoBack = () => navigate("/accueil");
  const nextPlayer = () => setCurrentIndex(i => (i + 1) % joueurs.length);
  const prevPlayer = () => setCurrentIndex(i => (i - 1 + joueurs.length) % joueurs.length);
  const goToPlayer = (i: number) => setCurrentIndex(i);
  const currentPlayer = joueurs[currentIndex];
  const posteNom = posteInfo?.nom || postesMapping[posteId ?? ""] || "Joueurs";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-6 text-xl font-semibold text-gray-700">Chargement des {posteNom.toLowerCase()}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-red-500 mb-6 text-lg">{error}</p>
          <button onClick={handleGoBack} className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (joueurs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Aucun {posteNom} trouvé</h3>
          <p className="text-gray-600 mb-6 text-lg">Il n'y a actuellement aucun {posteNom.toLowerCase()} enregistré pour ce poste.</p>
          <button onClick={handleGoBack} className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white rounded-lg shadow-md p-6">
          <button onClick={handleGoBack} className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg">
            <ChevronLeft className="w-4 h-4 mr-2" /> Retour à l'accueil
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{posteNom}</h1>
          <div className="space-x-2">
            <button
              onClick={() => setViewMode("liste")}
              className={`px-4 py-2 rounded ${viewMode === "liste" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Liste
            </button>
            <button
              onClick={() => setViewMode("terrain")}
              className={`px-4 py-2 rounded ${viewMode === "terrain" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Terrain
            </button>
          </div>
        </div>

        {viewMode === "liste" ? (
          <>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 min-h-[800px] relative">
              <button onClick={prevPlayer} disabled={joueurs.length <= 1} className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20">
                <ChevronLeft className="w-8 h-8 text-gray-700" />
              </button>
              <button onClick={nextPlayer} disabled={joueurs.length <= 1} className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20">
                <ChevronRight className="w-8 h-8 text-gray-700" />
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tous les {posteNom.toLowerCase()}</h3>
              <div className="flex flex-wrap justify-center gap-6">
                {joueurs.map((j, i) => (
                  <button key={j.id} onClick={() => goToPlayer(i)} className={i === currentIndex ? "ring-4 ring-blue-500 scale-110" : ""}>
                    <img src={j.image} alt={j.name} className="w-28 h-28 rounded-full shadow-lg" />
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-4">Formation sur le terrain</h2>
            <div style={{ position: "relative", width: "100%", maxWidth: 600, height: 400, margin: "0 auto", backgroundColor: "#2d7d32", border: "3px solid white", borderRadius: 8, overflow: "hidden" }}>
              {/* ... SVG et positions des joueurs ... */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostePage;
