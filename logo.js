document.addEventListener("DOMContentLoaded", function() {
    var container = document.getElementById("container");
    var image = document.getElementById("image");

    // Détecte le mouvement de la souris sur tout le document pour déplacer l'image
    document.addEventListener("mousemove", function(event) {
        var containerWidth = container.offsetWidth;
        var mouseX = event.clientX;
        
        var imageWidth = image.offsetWidth;
        var halfImageWidth = imageWidth / 2;

        // Limiter la position de l'image à l'intérieur du conteneur
        var minX = 0;
        var maxX = containerWidth - imageWidth;

        // Calculer la position horizontale de l'image
        var newPositionX = mouseX - halfImageWidth;

        // Limiter la position de l'image à l'intérieur du conteneur
        newPositionX = Math.max(minX, Math.min(newPositionX, maxX));

        // Déplacer l'image
        image.style.transform = "translateX(" + newPositionX + "px)";
    });


});
