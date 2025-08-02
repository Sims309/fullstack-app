// import React, { useEffect, useState, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { UserContext } from "@/contexts/UserContext";

// interface Joueur {
//   posteId: number;
//   id: number;
//   name: string;
//   country: string;
//   image: string;
//   fifa_points: number;
//   age: number;
//   club: string;
//   nationalite: string;
//   buts: number;
//   passes: number;
//   cartons_jaunes: number;
//   cartons_rouges: number;
//   youtubeUrl?: string;
//   position_x?: number;
//   position_y?: number;
// }

// interface PosteInfo {
//   id: number;
//   nom: string;
// }

// const PostePage: React.FC = () => {
//   const { posteId } = useParams<{ posteId: string }>();
//   const navigate = useNavigate();
//   const { user } = useContext(UserContext);

//   const [joueurs, setJoueurs] = useState<Joueur[]>([]);
//   const [posteInfo, setPosteInfo] = useState<PosteInfo | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     if (!posteId) return;
//     setLoading(true);
//     fetch(`/api/joueurs/poste/${posteId}`, { cache: 'no-store', credentials: 'include' })
//       .then(res => res.ok ? res.json() : Promise.reject(`Erreur ${res.status}`))
//       .then(data => {
//         const js: Joueur[] = (data.joueurs || data).map((j: Joueur) => j);
//         setJoueurs(js);
//         setPosteInfo(data.posteInfo || { id: +posteId, nom: `Poste ${posteId}` });
//       })
//       .catch(err => setError(`Erreur de chargement: ${err}`))
//       .finally(() => setLoading(false));
//   }, [posteId]);

//   useEffect(() => { if (!user) navigate('/'); }, [user]);

//   const handleGoBack = () => navigate('/accueil');
//   const nextPlayer = () => setCurrentIndex(i => (i + 1) % joueurs.length);
//   const prevPlayer = () => setCurrentIndex(i => (i - 1 + joueurs.length) % joueurs.length);
//   const currentPlayer = joueurs[currentIndex];

//   if (loading) return <div>Chargement...</div>;
//   if (error) return <div>{error}</div>;
//   if (joueurs.length === 0) return <div>Aucun joueur trouvé.</div>;

//   return (
//     <div className="min-h-screen p-4">
//       <button onClick={handleGoBack}>Retour</button>
//       <h1>{posteInfo?.nom}</h1>
//       <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
//         <div className="flex justify-between items-center mb-4">
//           <button onClick={prevPlayer}><ChevronLeft /></button>
//           <span>Joueur {currentIndex + 1} / {joueurs.length}</span>
//           <button onClick={nextPlayer}><ChevronRight /></button>
//         </div>
//         {currentPlayer && (
//           <div className="text-center">
//             <img src={currentPlayer.image} alt={currentPlayer.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
//             <h2 className="text-xl font-bold">{currentPlayer.name}</h2>
//             <p>Points FIFA : {currentPlayer.fifa_points}</p>
//             <p>Club : {currentPlayer.club}</p>
//             <p>Âge : {currentPlayer.age}</p>
//             <p>Buts : {currentPlayer.buts} – Passes : {currentPlayer.passes}</p>
//             <p>Cartons jaunes : {currentPlayer.cartons_jaunes} – Cartons rouges : {currentPlayer.cartons_rouges}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PostePage;
