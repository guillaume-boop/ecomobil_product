// Récupération des pièces depuis le fichier JSON
const reponse = await fetch('pieces-autos.json');
const pieces = await reponse.json();

function genererPieces(pieces, agenceSelectionnee, tri, prixMax) {
    // Vérification si le tableau de pièces est vide
    if (!pieces || pieces.length === 0) {
        console.error("Aucune pièce disponible.");
        return;
    }

    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionFiches = document.querySelector(".fiches");

    // Supprimer les fiches existantes pour les recréer
    sectionFiches.innerHTML = "";

    // Filtrer les pièces en fonction de l'agence sélectionnée
    let piecesFiltrees = pieces;
    if (agenceSelectionnee) {
        piecesFiltrees = pieces.filter(piece => piece.disponibilite.includes(agenceSelectionnee));
    }

    // Trier les pièces en fonction de l'ordre sélectionné
    if (tri === "pertinence") {
        piecesFiltrees.sort((a, b) => a.id - b.id);
    } else if (tri === "prix-croissant") {
        piecesFiltrees.sort((a, b) => a.prix - b.prix);
    } else if (tri === "prix-decroissant") {
        piecesFiltrees.sort((a, b) => b.prix - a.prix);
    }

    // Afficher les pièces qui respectent le prix maximum
    for (let i = 0; i < piecesFiltrees.length; i++) {
        const article = piecesFiltrees[i];
        if (article.prix <= prixMax) {
            // Création d’une balise dédiée à une pièce automobile
            const pieceElement = document.createElement("article");

            // Création des balises pour afficher les images
            const imageContainer = document.createElement("div");
            imageContainer.classList.add("image-container");

            article.image.forEach((imagePath, index) => {
                const imageElement = document.createElement("img");
                imageElement.src = imagePath;
                imageElement.alt = "Image";
                if (index !== 0) {
                    imageElement.style.display = "none"; // Cacher toutes les images sauf la première
                }
                imageContainer.appendChild(imageElement);
            });

            // Création des boutons suivant et précédent
            const prevButton = document.createElement("button");
            prevButton.textContent = "<-";
            prevButton.classList.add("prevButton"); // Ajouter une classe spécifique pour le bouton "Précédent"
            prevButton.addEventListener("click", function() {
                showImage(-1, imageContainer);
            });
            
            const nextButton = document.createElement("button");
            nextButton.textContent = "->";
            nextButton.classList.add("nextButton"); // Ajouter une classe spécifique pour le bouton "Suivant"
            nextButton.addEventListener("click", function() {
                showImage(1, imageContainer);
            });
            
            // Création et ajout des balises pour les informations sur la pièce
            const nomElement = document.createElement("h2");
            nomElement.textContent = article.nom;

            const prixElement = document.createElement("p");
            prixElement.textContent = `Prix horaire: ${article.prix} € (${article.prix < 9 ? "€" : "€€"})`;
            prixElement.style.textAlign = "center";
            prixElement.style.fontWeight = "bold";
            prixElement.style.marginBottom = "15px";

            const descriptionElement = document.createElement("p");
            descriptionElement.textContent = article.description || "Pas de description pour le moment.";

            // Ajout des éléments au DOM
            pieceElement.appendChild(imageContainer);
            pieceElement.appendChild(prevButton);
            pieceElement.appendChild(nextButton);

            pieceElement.appendChild(nomElement);
            pieceElement.appendChild(prixElement);
            pieceElement.appendChild(descriptionElement);

            sectionFiches.appendChild(pieceElement);
        }
    }

    // Fonction pour afficher les images suivantes/précédentes
    function showImage(step, container) {
        const images = container.querySelectorAll("img");
        let currentIndex = -1;
        images.forEach((image, index) => {
            if (image.style.display !== "none") {
                currentIndex = index;
            }
        });

        currentIndex += step;
        if (currentIndex < 0) {
            currentIndex = images.length - 1;
        } else if (currentIndex >= images.length) {
            currentIndex = 0;
        }

        images.forEach((image, index) => {
            if (index === currentIndex) {
                image.style.display = "block";
            } else {
                image.style.display = "none";
            }
        });
    }
}

// Déclencher manuellement l'événement de changement pour le bouton "Pertinence" trié
const boutonTriPertinence = document.querySelector("input[type='radio'][name='tri'][value='pertinence']");
boutonTriPertinence.checked = true;
boutonTriPertinence.dispatchEvent(new Event('change'));

// Ajouter un écouteur d'événements pour les boutons radio de tri
const boutonsTri = document.querySelectorAll("input[name='tri']");
boutonsTri.forEach(bouton => {
    bouton.addEventListener("change", function() {
        const agenceSelectionnee = document.querySelector("input[type='radio'][name='agence']:checked").value;
        const prixMax = document.querySelector('#prix-max').value;
        genererPieces(pieces, agenceSelectionnee, this.value, prixMax);
    });
});

// Ajouter un écouteur d'événements pour la barre de prix
const inputPrixMax = document.querySelector('#prix-max');
inputPrixMax.addEventListener('input', function() {
    const agenceSelectionnee = document.querySelector("input[type='radio'][name='agence']:checked").value;
    const triSelectionne = document.querySelector("input[type='radio'][name='tri']:checked").value;
    genererPieces(pieces, agenceSelectionnee, triSelectionne, this.value);
});

const boutonsAgence = document.querySelectorAll("input[type='radio'][name='agence']");
boutonsAgence.forEach(function(bouton) {
    bouton.addEventListener("change", function() {
        const triSelectionne = document.querySelector("input[type='radio'][name='tri']:checked").value;
        const prixMax = document.querySelector('#prix-max').value;
        genererPieces(pieces, this.value, triSelectionne, prixMax);
    });
});

// Appel initial pour générer les fiches au chargement de la page
const agenceSelectionnee = document.querySelector("input[type='radio'][name='agence']:checked").value;
const triSelectionne = document.querySelector("input[type='radio'][name='tri']:checked").value;
const prixMax = document.querySelector('#prix-max').value;
genererPieces(pieces, agenceSelectionnee, triSelectionne, prixMax);
