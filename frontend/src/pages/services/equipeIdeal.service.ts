const API_URL = '/api/equipe-ideal';

// Récupérer tous les joueurs de l’équipe idéale
export async function getEquipeIdeale() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Erreur de chargement de l’équipe idéale');
  return await res.json();
}

// Ajouter un joueur à l’équipe idéale
export async function ajouterJoueur(joueur: any) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(joueur),
  });
  if (!res.ok) throw new Error('Erreur lors de l’ajout du joueur');
  return await res.json();
}

// Modifier un joueur de l’équipe idéale
export async function modifierJoueur(id: number, joueur: any) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(joueur),
  });
  if (!res.ok) throw new Error('Erreur lors de la modification du joueur');
  return await res.json();
}

// Supprimer un joueur de l’équipe idéale
export async function supprimerJoueur(id: number) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erreur lors de la suppression du joueur');
}
