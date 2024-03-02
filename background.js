/* Check External Source: bvambient.js */ 
document.addEventListener("DOMContentLoaded", function() {
    var demo1 = new BVAmbient({
selector: "#ambient",
fps: 60,
max_transition_speed: 12000,
min_transition_speed: 8000,
particle_number: 70,
particle_maxwidth: 60,
particle_minwidth: 10,
particle_radius: 50,
particle_opacity: true,
particle_colision_change: true,
particle_background: "#58c70c",
particle_image: {
image: false,
src: ""
},
responsive: [
 {
   breakpoint: 768,
   settings: {
     particle_number: "15"
   }
 },
 {
   breakpoint: 480,
   settings: {
     particle_number: "10"
   }
 }
]
});
});