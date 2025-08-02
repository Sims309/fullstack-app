import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Joueur } from '@/types/joueurs';
import { getJoueursByPoste } from '@/api/joueursApi';
import { useEquipeIdeal } from '@/contexts/EquipeIdealContext';
import { FaArrowLeft, FaArrowRight, FaYoutube, FaHeart } from 'react-icons/fa';

export default function PostePage() {
  const { posteId } = useParams();
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [index, setIndex] = useState(0);

  const { ajouterJoueur } = useEquipeIdeal();

  useEffect(() => {
    if (!posteId) return;
    getJoueursByPoste(Number(posteId)).then((data: Joueur[]) => {
      setJoueurs([...data].reverse());
      setIndex(0);
    });
  }, [posteId]);

  const joueur = joueurs[index];

  const suivant = () => setIndex((prev) => (prev + 1) % joueurs.length);
  const precedent = () => setIndex((prev) => (prev - 1 + joueurs.length) % joueurs.length);

  // 🔒 Fonction pour valider l'URL YouTube
  const isValidYouTubeUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be');
    } catch {
      return false;
    }
  };

  if (!joueur) return <p className="text-center mt-10">Chargement…</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 text-center">
      <h2 className="text-xl font-semibold mb-2">
        Joueur {index + 1} / {joueurs.length}
      </h2>

      <div className="bg-white shadow rounded-2xl p-4 space-y-4">
        <img
          src={joueur.image || '/placeholder.jpg'}
          alt={joueur.nom}
          className="w-48 h-48 object-cover mx-auto rounded-full border"
        />
        <h3 className="text-2xl font-bold">{joueur.nom}</h3>
        <p className="text-sm text-gray-500">Points FIFA : {joueur.pointsFIFA}</p>
        <p className="text-sm text-gray-400 italic">
          Position : {posteId} – Rang n° {joueurs.length - index}
        </p>

        <p className="text-gray-700 text-sm">{joueur.biographie}</p>

        {/* 🔴 Lien YouTube si présent et valide */}
        {joueur.youtube && isValidYouTubeUrl(joueur.youtube) && (
          <a
            href={joueur.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded shadow transition-colors duration-200"
          >
            <FaYoutube className="mr-2" /> Voir vidéos
          </a>
        )}

        {/* ❤️ Bouton pour ajouter à l'équipe idéale */}
        <button
          onClick={() => ajouterJoueur(joueur)}
          className="inline-flex items-center mt-3 px-3 py-1 text-white bg-pink-600 hover:bg-pink-700 rounded shadow transition-colors duration-200"
        >
          <FaHeart className="mr-2" />
          Ajouter à l'équipe idéale
        </button>
      </div>

      {/* 🔁 Navigation */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={precedent}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm flex items-center transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2" /> Précédent
        </button>
        <button
          onClick={suivant}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm flex items-center transition-colors duration-200"
        >
          Suivant <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
}