// Import necessary loader
import { FBXLoader } from "https://threejs.org/examples/jsm/loaders/FBXLoader.js";

// What the info box displays
let infoBoxText = {
    error: {
        title: "Oh noes! Something isn't right...",
        imgSrc: "./img/uhOh.gif",
        text: "If you see this, something has gone wrong! Try reloading the page, or file a report on the Issues page on Github if you've tried everything else. Your feedback is appreciated.",
    },
    nucleus: {
        title: "Nucleus",
        imgSrc: "./img/DNA.jpeg",
        text: "The nucleus is the organelle that controls all of the other organelles. It does this by it's <b>DNA</b> (pictured above), which is basically the instructions of the cell. The nucleus also contains the <b>nucleolus</b>. The nucleolus is the smaller sphere-like object inscribed within the nucleus, which is in charge of creating <b>ribosomes</b>. In this model, the ribosomes are the black spheres (to learn more about ribosomes, click them in the model!).",
    },
    vacuole: {
        title: "Vacuole",
        imgSrc: "./img/blank.png",
        text: "The vacuole is responsible for <b>storage</b> in cells. For plant cells, there is one large vacoule. In contrast, for animal cells, there are usually a collection of smaller vacuoles.",
    },
    mitochondria: {
        title: "Mitochondrion",
        imgSrc: "./img/mitochondria.jpeg",
        text: "The mitochondria is resposible for the energy creation in cells. Through <b>cellular repiration</b>, these special organelles are able to create <b>ATP</b> from glucose. Looking at their structure, you may see that it has a folded membrane inside, to increase the amount of area it has to perform its energy creation.",
    },
    chloroplast: {
        title: "Chloroplast",
        imgSrc: "./img/chloroplast.png",
        text: "The chloroplast is responsible for the creation of <b>glucose</b> through <b>photosynthesis</b>. Chloroplast is most usually green, due to the presence of <b>chlorophyl</b>, which is what harvests the light energy. Because of chloroplast and it's chlorophyll, plants that conduct phytosynthesis are green.",
    },
    cellOuter: {
        title: "Cell Wall & Membrane",
        imgSrc: "./img/blank.png",
        text: "The outer cover of the plant cell is composed of two parts: The <b>cell wall</b>, and the <b>cell membrane</b>. The cell membrane (in yellow) is made of lipids, and monitors what exits and enters the cell. In contrast, the cell wall (in green) is rigid, and offers protection and shape support for the cell, without the ability to allow/disallow stuff.",
    },
    cytoplasm: {
        title: "Cytoplasm",
        imgSrc: "./img/blank.png",
        text: "The cytoplasm is where everything happens for the cell. In the case of eukaryotes (which is what our plant cell is), the cytoplasm is home to a variety of different organelles, which help the cell to <b>stay alive</b>. As for prokaryotes, the cytoplasm is where chemical reactions happen, as well as where the DNA floats.",
    },
    ser: {
        title: "Smooth ER",
        imgSrc: "./img/bothER.png",
        text: 'The smooth endoplasmic reticulum (SER) is similar to the rough ER. However, the smooth counterpart does not have any ribosomes attached to it, and it therefore "smooth". The purpose for both endoplasmic reticulum (both smooth and rough) is as a <b>passageway</b> for stuff needed throughout the cell. The materials will go out of the ER in a <b>vesicle</b>, somewhat similar to a small sac. The vesicles will then be accepted by the golgi apparatus.',
    },
    rer: {
        title: "Rough ER",
        imgSrc: "./img/roughER.jpeg",
        text: 'After leaving the nucleus, the ribosomes may attach to the rough endoplasmic reticulum, or the RER, making it "rough". The purpose for both endoplasmic reticulum (both smooth and rough) is as a <b>passageway</b> for stuff needed throughout the cell. The materials will go out of the ER in a <b>vesicle</b>, somewhat similar to a small sac. The vesicles will then be accepted by the golgi apparatus.',
    },
    golgi: {
        title: "Golgi Apparatus",
        imgSrc: "./img/golgi.jpeg",
        text: "The golgi apparatus, or golgi body accepts the <b>vesicles</b> with protein produced by the SER and the RER. After the golgi apparatus recieves the protein, it will start modifying the proteins into <b>useful forms</b> for the cell. The golgi apparatus may also add other materials onto the protein when necessary.",
    },
    ribosome: {
        title: "Ribosome",
        imgSrc: "./img/roughER.jpeg",
        text: "The ribosomes are in charge of <b>protein synthesis</b>. These ribosomes are created by the <b>nucleolus</b> (part of nucleus), and leave the nucleus to perform their jobs, based on their <b>mRNA</b>. The mRNA is a copy of the DNA in the nucleus.",
    },
};

// Necessary variables
let camera, controls, scene, renderer;
let sceneMeshes = [];

// The info panel
let infoPanel = document.getElementById("infoPanel");
infoPanel.selected = undefined;

let info = document.getElementById("infoTextContent");
let img = document.getElementById("img");
let title = document.getElementById("title");

// Loader
const fbxLoader = new FBXLoader();

// Assigns scene
scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

// Creates a renderer
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id = "mainCanvas";
console.log(renderer.domElement);
document.body.appendChild(renderer.domElement);

// Creates a camera
camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
);
camera.position.set(400, 200, 0);

// Controls
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window); // optional

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 100;
controls.maxDistance = 500;

// Adds lights
const dirLight1 = new THREE.DirectionalLight(0xffffff);
dirLight1.position.set(1, 1, 1);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xdddddd);
dirLight2.position.set(-1, -1, -1);
scene.add(dirLight2);

const ambientLight = new THREE.HemisphereLight(
    "white", // bright sky color
    "darkslategrey", // dim ground color
    0.7 // intensity
);
scene.add(ambientLight);

// When there is a window resize, change the proportions of the window
let onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", onWindowResize);

// Update loop
animate();

// List of organelles
let organelles = [];

// Function to load various FBX files
let loadFBX = (path, name) => {
    fbxLoader.load(
        path, // Takes path of the file as parameter
        (object) => {
            let meshes = [];
            // Traverses the FBX model (meshless) into a mesh, which may be hit via raycast
            object.traverse(function (child) {
                if (child.isMesh) {
                    let m = child;
                    m.receiveShadow = true;
                    m.castShadow = true;
                    m.material.flatShading = true;
                    meshes.push(m);
                    sceneMeshes.push(m);
                }
                if (child.isLight) {
                    let l = child;
                    l.castShadow = true;
                    l.shadow.bias = -0.003;
                    l.shadow.mapSize.width = 2048;
                    l.shadow.mapSize.height = 2048;
                }
            });

            // Adds the object
            scene.add(object);
            organelles.push({ name: name, mesh: meshes });
            // sceneMeshes.push(object);
        },
        (xhr) => {
            // Prints how much of the file is loaded
            console.log(
                path + " is " + (xhr.loaded / xhr.total) * 100 + "% loaded"
            );
        },
        (error) => {
            // In the case of any error, log it.
            console.log(error);
        }
    );
};

// Load all models
loadFBX("./models/golgiFBX.fbx", "golgi");
loadFBX("./models/nucleusFBX.fbx", "nucleus");
loadFBX("./models/rerFBX.fbx", "rer");
loadFBX("./models/serFBX.fbx", "ser");
loadFBX("./models/ribosomeFBX.fbx", "ribosome");
loadFBX("./models/vacuoleFBX.fbx", "vacuole");
loadFBX("./models/mitochondriaFBX.fbx", "mitochondria");
loadFBX("./models/chloroplastFBX.fbx", "chloroplast");

loadFBX("./models/cytoplasmFBX.fbx", "cytoplasm");
loadFBX("./models/cellOuterFBX.fbx", "cellOuter");

// Raycaster to deduct what is hit
const raycaster = new THREE.Raycaster();

// Event listener to detect clicks
document.getElementById("mainCanvas").addEventListener("click", (event) => {
    console.log(organelles);
    const mouse = {
        x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    };
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(sceneMeshes, false);

    if (intersects.length > 0) {
        let n = new THREE.Vector3();
        n.copy(intersects[0].face.normal);
        n.transformDirection(intersects[0].object.matrixWorld);
        const selectedObject = intersects[0];
        let selected = false;
        loop: for (let [i, x] of organelles.entries()) {
            for (let [i2, x2] of x.mesh.entries()) {
                if (selectedObject.object.name == x2.name) {
                    console.log(x.name);
                    selected = true;
                    if (infoPanel.selected !== undefined) {
                        infoPanel.style.bottom = "-100%";

                        setTimeout(() => {
                            infoPanel.selected = x.name;
                            if (infoBoxText[infoPanel.selected] == undefined) {
                                title.innerHTML = infoBoxText["error"].title;
                                info.innerHTML = infoBoxText["error"].text;
                                img.src = infoBoxText["error"].imgSrc;
                            } else {
                                title.innerHTML =
                                    infoBoxText[infoPanel.selected].title;
                                info.innerHTML =
                                    infoBoxText[infoPanel.selected].text;
                                img.src =
                                    infoBoxText[infoPanel.selected].imgSrc;
                            }
                            infoPanel.style.bottom = 0;
                        }, 500);
                    } else {
                        infoPanel.selected = x.name;
                        if (infoBoxText[infoPanel.selected] == undefined) {
                            title.innerHTML = infoBoxText["error"].title;
                            info.innerHTML = infoBoxText["error"].text;
                            img.src = infoBoxText["error"].imgSrc;
                        } else {
                            title.innerHTML =
                                infoBoxText[infoPanel.selected].title;
                            info.innerHTML =
                                infoBoxText[infoPanel.selected].text;
                            img.src = infoBoxText[infoPanel.selected].imgSrc;
                        }
                        infoPanel.style.bottom = 0;
                    }
                    break loop;
                }
            }
        }
    } else {
        infoPanel.selected = undefined;
    }
});

// Animation
function animate() {
    requestAnimationFrame(animate);
    document.getElementById("closeInfoButton").onclick = () => {
        infoPanel.selected = undefined;
    };

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    if (infoPanel.selected == undefined) {
        infoPanel.style.bottom = "-100%";
    }

    render();
}

// Render
function render() {
    renderer.render(scene, camera);
}
