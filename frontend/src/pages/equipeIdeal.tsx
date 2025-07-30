// import React, { useEffect, useState } from "react";
// import { getEquipeIdeale, addJoueurToEquipe, removeJoueurFromEquipe } from  '@/services/equipeIdeal.service';

// type Joueur = {
//   id: number;
//   nom: string;
//   poste: string;
// };

// export default function EquipeIdeal() {
//   const [equipe, setEquipe] = useState<Joueur[]>([]);
//   const [nom, setNom] = useState("");
//   const [poste, setPoste] = useState("");

//   useEffect(() => {
//     fetchEquipe();
//   }, []);

//   const fetchEquipe = async () => {
//     const data = await getEquipeIdeale();
//     setEquipe(data);
//   };

//   const handleAdd = async () => {
//     if (!nom || !poste) return;
//     await addJoueurToEquipe({ nom, poste });
//     setNom("");
//     setPoste("");
//     fetchEquipe();
//   };

//   const handleDelete = async (id: number) => {
//     await removeJoueurFromEquipe(id);
//     fetchEquipe();
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Équipe Idéale</h1>

//       <ul className="mb-4">
//         {equipe.map((joueur) => (
//           <li key={joueur.id} className="mb-2">
//             {joueur.nom} - {joueur.poste}
//             <button
//               className="ml-4 px-2 py-1 bg-red-500 text-white rounded"
//               onClick={() => handleDelete(joueur.id)}
//             >
//               Supprimer
//             </button>
//           </li>
//         ))}
//       </ul>

//       <div className="flex flex-col gap-2 w-64">
//         <input
//           className="border p-2"
//           placeholder="Nom"
//           value={nom}
//           onChange={(e) => setNom(e.target.value)}
//         />
//         <input
//           className="border p-2"
//           placeholder="Poste"
//           value={poste}
//           onChange={(e) => setPoste(e.target.value)}
//         />
//         <button
//           className="bg-blue-600 text-white py-2 rounded"
//           onClick={handleAdd}
//         >
//           Ajouter un joueur
//         </button>
//       </div>
//     </div>
//   );
// }
