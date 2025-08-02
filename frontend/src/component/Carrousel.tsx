// import React, { useEffect, useState } from "react";
// import { ChevronLeft, ChevronRight, User, MapPin, Calendar, Trophy, Target, Users, AlertTriangle, Youtube } from "lucide-react";

// // Interface complète pour les joueurs
// interface Joueur {
//   posteId: number;
//   id: number;
//   name: string;
//   country: string;
//   image: string;
//   fifa_points: number;
//   biography: string;
//   statistics: string;
//   trophees_majeurs: string;
//   age: number;
//   club: string;
//   nationalite: string;
//   buts: number;
//   passes: number;
//   cartons_jaunes: number;
//   cartons_rouges: number;
//   youtubeUrl?: string;
// }

// interface PosteInfo {
//   id: number;
//   nom: string;
//   description?: string;
// }

// const PostePage: React.FC = () => {
//   const [joueurs, setJoueurs] = useState<Joueur[]>([]);
//   const [posteInfo, setPosteInfo] = useState<PosteInfo | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Mapping des postes
//   const postesMapping: { [key: string]: string } = {
//     "1": "Gardiens de but",
//     "2": "Défenseurs centraux", 
//     "3": "Latéraux droits",
//     "4": "Latéraux gauches",
//     "5": "Milieux défensifs",
//     "6": "Milieux centraux",
//     "7": "Milieux offensifs",
//     "8": "Ailiers droits",
//     "9": "Ailiers gauches",
//     "10": "Seconds attaquants",
//     "11": "Attaquants",
//     "12": "Équipe Idéale"
//   };

//   // Données de test avec l'interface complète
//   const joueursTest: Joueur[] = [
//     {
//       posteId: 10,
//       id: 1,
//       name: "Lionel Messi",
//       country: "Argentina",
//       image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=400&h=400&fit=crop&crop=face",
//       fifa_points: 93,
//       biography: "Considéré comme l'un des plus grands joueurs de tous les temps, Messi a remporté de nombreux titres avec le FC Barcelone et l'Argentina. Son dribble exceptionnel et sa vision du jeu en font un joueur unique.",
//       statistics: "Goals: 800+, Assists: 350+, Matches: 1000+, Trophées individuels: 50+",
//       trophees_majeurs: "8 Ballons d'Or, Coupe du Monde 2022, 4 Ligue des Champions, 10 Liga, Copa América 2021",
//       age: 36,
//       club: "Inter Miami",
//       nationalite: "Argentine",
//       buts: 807,
//       passes: 357,
//       cartons_jaunes: 42,
//       cartons_rouges: 3,
//       youtubeUrl: "https://youtube.com/watch?v=example1"
//     },
//     {
//       posteId: 11,
//       id: 2,
//       name: "Cristiano Ronaldo",
//       country: "Portugal",
//       image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face",
//       fifa_points: 91,
//       biography: "Attaquant portugais légendaire, connu pour sa détermination et ses performances exceptionnelles en club et en sélection. Sa mentalité de gagnant et son professionnalisme sont exemplaires.",
//       statistics: "Goals: 850+, Assists: 250+, Matches: 1100+, Hat-tricks: 60+",
//       trophees_majeurs: "5 Ballons d'Or, Euro 2016, 5 Ligue des Champions, 3 Premier League, 2 Liga, 2 Serie A",
//       age: 39,
//       club: "Al Nassr",
//       nationalite: "Portugaise",
//       buts: 856,
//       passes: 267,
//       cartons_jaunes: 156,
//       cartons_rouges: 11,
//       youtubeUrl: "https://youtube.com/watch?v=example2"
//     },
//     {
//       posteId: 8,
//       id: 3,
//       name: "Kylian Mbappé",
//       country: "France",
//       image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=face",
//       fifa_points: 92,
//       biography: "Jeune prodige français, rapide et technique, déjà vainqueur de la Coupe du Monde avec l'équipe de France. Sa vitesse et son finishing en font l'un des attaquants les plus redoutés au monde.",
//       statistics: "Goals: 250+, Assists: 120+, Matches: 400+, Vitesse max: 38 km/h",
//       trophees_majeurs: "Coupe du Monde 2018, 4 Ligue 1, Ligue des Nations 2021, Finaliste Coupe du Monde 2022",
//       age: 25,
//       club: "Real Madrid",
//       nationalite: "Française",
//       buts: 267,
//       passes: 134,
//       cartons_jaunes: 23,
//       cartons_rouges: 1,
//       youtubeUrl: "https://youtube.com/watch?v=example3"
//     },
//     {
//       posteId: 7,
//       id: 4,
//       name: "Kevin De Bruyne",
//       country: "Belgium",
//       image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop&crop=face",
//       fifa_points: 91,
//       biography: "Milieu offensif belge d'exception, reconnu pour ses passes décisives et sa vision du jeu remarquable. Un véritable chef d'orchestre sur le terrain.",
//       statistics: "Goals: 150+, Assists: 200+, Matches: 600+, Passes clés par match: 3.2",
//       trophees_majeurs: "5 Premier League, 1 Ligue des Champions, 6 trophées avec Manchester City",
//       age: 32,
//       club: "Manchester City",
//       nationalite: "Belge",
//       buts: 156,
//       passes: 287,
//       cartons_jaunes: 67,
//       cartons_rouges: 2,
//       youtubeUrl: "https://youtube.com/watch?v=example4"
//     }
//   ];

//   useEffect(() => {
//     // Simulation du chargement des données
//     const fetchJoueurs = async () => {
//       setLoading(true);
//       try {
//         // Ici vous pouvez remplacer par votre appel API réel
//         // const response = await fetch(`/api/joueurs/poste/${posteId}`);
//         // const data = await response.json();
        
//         // Pour la démo, on utilise les données de test
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         setJoueurs(joueursTest);
//         setPosteInfo({
//           id: 10,
//           nom: "Meilleurs Joueurs du Monde",
//         });
//       } catch (err) {
//         setError("Erreur de chargement des données");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJoueurs();
//   }, []);

//   const handleGoBack = () => {
//     console.log("Retour à l'accueil");
//   };

//   const nextPlayer = () => {
//     setCurrentIndex((prev) => (prev + 1) % joueurs.length);
//   };

//   const prevPlayer = () => {
//     setCurrentIndex((prev) => (prev - 1 + joueurs.length) % joueurs.length);
//   };

//   const goToPlayer = (index: number) => {
//     setCurrentIndex(index);
//   };

//   const currentPlayer = joueurs[currentIndex];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500 mx-auto"></div>
//           <p className="mt-6 text-xl font-semibold text-gray-700">Chargement des joueurs...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
//         <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
//           <h2 className="text-3xl font-bold text-red-600 mb-4">Erreur</h2>
//           <p className="text-red-500 mb-6 text-lg">{error}</p>
//           <button 
//             onClick={handleGoBack}
//             className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
//           >
//             Retour à l'accueil
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (joueurs.length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
//           <h3 className="text-2xl font-bold mb-4">Aucun joueur trouvé</h3>
//           <p className="text-gray-600 mb-6 text-lg">Il n'y a actuellement aucun joueur enregistré pour ce poste.</p>
//           <button 
//             onClick={handleGoBack}
//             className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
//           >
//             Retour à l'accueil
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* En-tête */}
//         <div className="flex justify-between items-center mb-8 bg-white rounded-lg shadow-md p-6">
//           <button
//             onClick={handleGoBack}
//             className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
//           >
//             <ChevronLeft className="w-4 h-4 mr-2" />
//             Retour à l'accueil
//           </button>
          
//           <h1 className="text-3xl font-bold text-gray-800">
//             {posteInfo?.nom || "Joueurs"}
//           </h1>
          
//           <div className="text-right">
//             <p className="text-sm text-gray-600">Joueur</p>
//             <p className="text-lg font-semibold">{currentIndex + 1} / {joueurs.length}</p>
//           </div>
//         </div>

//         {/* Carrousel Principal - PLUS GRAND */}
//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 min-h-[800px]">
//           <div className="relative h-full">
//             {/* Navigation du carrousel */}
//             <button 
//               onClick={prevPlayer}
//               className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-95 hover:bg-opacity-100 rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl"
//               disabled={joueurs.length <= 1}
//             >
//               <ChevronLeft className="w-8 h-8 text-gray-700" />
//             </button>
            
//             <button 
//               onClick={nextPlayer}
//               className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-95 hover:bg-opacity-100 rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl"
//               disabled={joueurs.length <= 1}
//             >
//               <ChevronRight className="w-8 h-8 text-gray-700" />
//             </button>

//             {/* Contenu du joueur - BEAUCOUP PLUS GRAND */}
//             <div className="p-12">
//               <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 min-h-[700px]">
//                 {/* Colonne 1: Photo et infos principales - AGRANDIE */}
//                 <div className="text-center flex flex-col justify-center">
//                   <div className="relative inline-block mb-8">
//                     <img
//                       src={currentPlayer.image}
//                       alt={currentPlayer.name}
//                       className="w-80 h-80 rounded-full object-cover border-8 border-gradient-to-r from-blue-500 to-purple-600 shadow-2xl mx-auto"
//                     />
//                     <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-24 h-24 flex items-center justify-center font-bold text-2xl shadow-2xl border-4 border-white">
//                       {currentPlayer.fifa_points}
//                     </div>
//                   </div>
                  
//                   <h2 className="text-5xl font-bold text-gray-800 mb-6">{currentPlayer.name}</h2>
                  
//                   <div className="space-y-6 text-2xl">
//                     <div className="flex items-center justify-center">
//                       <MapPin className="w-8 h-8 text-red-500 mr-4" />
//                       <span className="font-semibold">{currentPlayer.country}</span>
//                     </div>
                    
//                     <div className="flex items-center justify-center">
//                       <Calendar className="w-8 h-8 text-blue-500 mr-4" />
//                       <span className="font-semibold">{currentPlayer.age} ans</span>
//                     </div>
                    
//                     <div className="flex items-center justify-center">
//                       <Users className="w-8 h-8 text-green-500 mr-4" />
//                       <span className="font-semibold">{currentPlayer.club}</span>
//                     </div>

//                     <div className="flex items-center justify-center">
//                       <User className="w-8 h-8 text-purple-500 mr-4" />
//                       <span className="font-semibold">{currentPlayer.nationalite}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Colonne 2: Statistiques - AGRANDIES */}
//                 <div className="space-y-8">
//                   <h3 className="text-3xl font-bold text-gray-800 border-b-4 border-blue-500 pb-3">
//                     Statistiques Complètes
//                   </h3>
                  
//                   <div className="grid grid-cols-1 gap-6">
//                     <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-2xl text-center shadow-lg">
//                       <Target className="w-12 h-12 mx-auto mb-3" />
//                       <div className="text-4xl font-bold">{currentPlayer.buts}</div>
//                       <div className="text-lg">Buts marqués</div>
//                     </div>
                    
//                     <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-2xl text-center shadow-lg">
//                       <Users className="w-12 h-12 mx-auto mb-3" />
//                       <div className="text-4xl font-bold">{currentPlayer.passes}</div>
//                       <div className="text-lg">Passes décisives</div>
//                     </div>
                    
//                     <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 rounded-2xl text-center shadow-lg">
//                       <AlertTriangle className="w-12 h-12 mx-auto mb-3" />
//                       <div className="text-4xl font-bold">{currentPlayer.cartons_jaunes}</div>
//                       <div className="text-lg">Cartons Jaunes</div>
//                     </div>
                    
//                     <div className="bg-gradient-to-r from-red-400 to-red-600 text-white p-6 rounded-2xl text-center shadow-lg">
//                       <AlertTriangle className="w-12 h-12 mx-auto mb-3" />
//                       <div className="text-4xl font-bold">{currentPlayer.cartons_rouges}</div>
//                       <div className="text-lg">Cartons Rouges</div>
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 p-6 rounded-2xl shadow-inner">
//                     <h4 className="font-bold text-gray-800 mb-4 text-xl">Statistiques Détaillées</h4>
//                     <p className="text-gray-700 text-lg leading-relaxed">{currentPlayer.statistics}</p>
//                   </div>
//                 </div>

//                 {/* Colonne 3: Biographie et Trophées - AGRANDIE */}
//                 <div className="space-y-8">
//                   <div>
//                     <h3 className="text-3xl font-bold text-gray-800 border-b-4 border-purple-500 pb-3 mb-6">
//                       Biographie
//                     </h3>
//                     <p className="text-gray-700 leading-relaxed text-lg">{currentPlayer.biography}</p>
//                   </div>
                  
//                   <div>
//                     <h3 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
//                       <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
//                       Trophées Majeurs
//                     </h3>
//                     <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-2xl shadow-inner">
//                       <p className="text-gray-700 font-medium text-lg leading-relaxed">{currentPlayer.trophees_majeurs}</p>
//                     </div>
//                   </div>

//                   {currentPlayer.youtubeUrl && (
//                     <div>
//                       <a 
//                         href={currentPlayer.youtubeUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl transition-colors text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
//                       >
//                         <Youtube className="w-6 h-6 mr-3" />
//                         Voir les highlights
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Miniatures des joueurs - AGRANDIES */}
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tous les joueurs</h3>
//           <div className="flex flex-wrap justify-center gap-6">
//             {joueurs.map((joueur, index) => (
//               <button
//                 key={joueur.id}
//                 onClick={() => goToPlayer(index)}
//                 className={`relative group transition-all duration-300 ${
//                   index === currentIndex 
//                     ? 'ring-4 ring-blue-500 scale-110 shadow-2xl' 
//                     : 'hover:scale-105 hover:shadow-xl'
//                 }`}
//               >
//                 <img
//                   src={joueur.image}
//                   alt={joueur.name}
//                   className="w-28 h-28 rounded-full object-cover shadow-lg"
//                 />
//                 <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shadow-lg">
//                   {joueur.fifa_points}
//                 </div>
//                 <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
//                   {joueur.name}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PostePage;