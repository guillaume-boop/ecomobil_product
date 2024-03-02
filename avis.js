export async function ajoutListenersAvis() {
    const piecesElements = document.querySelectorAll(".fiches article button");
 
    for (let i = 0; i < piecesElements.length; i++) {
        piecesElements[i].addEventListener("click", async function (event) {
            const id = event.target.dataset.id;
            try {
                // Charger les données depuis le fichier JSON local
                const reponse = await fetch('avis.json');
                const avis = await reponse.json();
                const avisPiece = avis.filter(avis => avis.pieceId === parseInt(id));

                const pieceElement = event.target.parentElement;
                const avisElement = document.createElement("div");

                if (avisPiece.length > 0) {
                    avisPiece.forEach(item => {
                        const avisItem = document.createElement("p");
                        avisItem.innerHTML = `<b>${item.utilisateur}:</b> ${item.commentaire}`;
                        avisElement.appendChild(avisItem);
                    });
                } else {
                    const noAvisElement = document.createElement("p");
                    noAvisElement.textContent = "Aucun avis disponible pour cette pièce.";
                    avisElement.appendChild(noAvisElement);
                }

                pieceElement.appendChild(avisElement);
            } catch (error) {
                console.error('Erreur lors du chargement des avis :', error);
            }
        });
    }
}
 
 export function ajoutListenerEnvoyerAvis() {
    const formulaireAvis = document.querySelector(".formulaire-avis");
    formulaireAvis.addEventListener("submit", function (event) {
    event.preventDefault();
    // Création de l’objet du nouvel avis.
    const avis = {
        pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
        utilisateur: event.target.querySelector("[name=utilisateur]").value,
        commentaire: event.target.querySelector("[name=commentaire]").value,
        nbEtoiles: parseInt(event.target.querySelector("[name=nbEtoiles]").value)
    };
    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(avis);
    // Appel de la fonction fetch avec toutes les informations nécessaires
    fetch("http://localhost:8081/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile
    });
    });
    
 }



 export async function afficherGraphiqueAvis() {
    const avis = await fetch("http://localhost:8081/avis").then(response => response.json());

    // Initialiser un objet pour stocker les moyennes des étoiles attribuées par pièce
    const moyennesParPiece = {};

    // Calculer la moyenne des étoiles attribuées par pièce
    for (let commentaire of avis) {
        if (!moyennesParPiece[commentaire.pieceId]) {
            moyennesParPiece[commentaire.pieceId] = {
                totalEtoiles: 0,
                totalAvis: 0
            };
        }
        moyennesParPiece[commentaire.pieceId].totalEtoiles += commentaire.nbEtoiles;
        moyennesParPiece[commentaire.pieceId].totalAvis++;
    }

    // Calculer la moyenne des étoiles attribuées par pièce
    const moyennes = {};
    for (let pieceId in moyennesParPiece) {
        moyennes[pieceId] = moyennesParPiece[pieceId].totalEtoiles / moyennesParPiece[pieceId].totalAvis;
    }

    // Créer un tableau des pièces et des moyennes des étoiles attribuées
    const pieces = Object.keys(moyennes);
    const moyennesEtoiles = pieces.map(pieceId => moyennes[pieceId]);

    // Données et personnalisation du graphique
    const data = {
        labels: pieces,
        datasets: [{
            label: "Moyenne des étoiles attribuées",
            data: moyennesEtoiles,
            backgroundColor: "rgba(255, 230, 0, 1)", // couleur jaune
        }],
    };

    // Objet de configuration final
    const config = {
        type: "bar",
        data: data,
        options: {
            indexAxis: "y",
            scales: {
                x: {
                    min: 0,  // Définir la limite minimale de l'axe x
                    max: 5   // Définir la limite maximale de l'axe x
                }
            }
        },
    };

    // Rendu du graphique dans l'élément canvas
    const graphiqueAvis = new Chart(
        document.querySelector("#graphique-avis"),
        config,
    );
}
