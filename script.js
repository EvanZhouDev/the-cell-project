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
        text: "The nucleus controls what processes occur in the cell. The instruction that the cell would follow is called “DNA”.  The nucleus also has a nucleolus inside it, which creates ribosomes.",
    },
    vacuole: {
        title: "Vacuole",
        imgSrc: "./img/vacuole.png",
        text: "The vacuole is responsible for storing materials in the cell. In plant cells, they store mostly water, and sometimes act as part of the structure of the cell. Animal cells have a variety of smaller vacuoles, which may contain anything necessary.",
    },
    mitochondria: {
        title: "Mitochondria",
        imgSrc: "./img/mitochondria.jpeg",
        text: "Mitochondria is what breaks down glucose (which may come from a variety of sources), and turns it into ATP, which the cell uses as energy. Without the mitochondria, the cell would not have power to run.",
    },
    chloroplast: {
        title: "Chloroplast",
        imgSrc: "./img/chloroplast.png",
        text: "The chloroplast is the organelle in charge of photosynthesis. This organelle is green because of it’s chlorophyll (which absorbs sunlight), and in turn, because of this, most plants are green. For plants, the glucose produced by photosynthesis is used in cellular respiration, which is done by the mitochondria.",
    },
    cellOuter: {
        title: "Cell Wall & Membrane",
        imgSrc: "./img/blank.png",
        text: "The outer cover of the cell is composed of two parts: The cell membrane, and the cell wall.<br/><b>Cell membrane:</b><br/>The cell membrane protects the cell, and holds it together. The membrane is also a way for the cell to regulate what goes in and out of the cell. Because of how the membrane is constructed of interlocking hydrophobic lipids, it allows the cell to be waterproof.<br/><b>Cell wall:</b><br/>The cell wall is strong and rigid, in only plant cells, and adds structure to cells. They allow plants to grow tall, and is a second barrier, over the cell membrane. The cell wall is different from the cell membrane as it cannot prevent things smaller than a certain size in.",
    },
    cytoplasm: {
        title: "Cytoplasm",
        imgSrc: "./img/blank.png",
        text: "Everything floats in the cytoplasm. If the cell is prokaryotic, then the chemical reactions happen in the cytoplasm. If it is a eukaryotic cell, then the cytoplasm would house all of the organelles, which would in turn perform the critical chemical reactions.",
    },
    ser: {
        title: "Smooth ER",
        imgSrc: "./img/bothER.png",
        text: 'The smooth endoplasmic reticulum is similar to the rough endoplasmic reticulum. However, it does not have any ribosomes attached to it. The purpose of the smooth endoplasmic reticulum is to store and produce lipids and steroids, use those same lipids and steroids to communicate with the rest of the cell, as well as detoxify the cell.',
    },
    rer: {
        title: "Rough ER",
        imgSrc: "./img/roughER.jpeg",
        text: 'When the ribosome leaves the nucleolus, it connects onto the rough endoplasmic reticulum to make proteins. In the rough ER The protein is marked with a carbohydrate, so that the protein knows where to be sent. After this process, the protein is covered in a vesicle made of lipids to be sent out.',
    },
    golgi: {
        title: "Golgi Apparatus",
        imgSrc: "./img/golgi.jpeg",
        text: "The Golgi body is responsible for modifying and ejecting the protein. The proteins may either return to the nucleus, get sent to a different portion of the cell, be used to communicate with the rest of the cell, or be recycled to be reused.",
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
let loadAmount = 0;
let loadIndicatorShown = false;
let enableWatermark = false;

// The info panel
let infoPanel = document.getElementById("infoPanel");
infoPanel.selected = undefined;

// The info table
let infoTable = document.getElementById("infoTable");
infoTable.shown = false;

let info = document.getElementById("infoTextContent");
let img = document.getElementById("img");
let title = document.getElementById("title");
let loading = document.getElementById("loadingIndicator");


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

controls.zoom0 = 2;
controls.reset();

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
            if (xhr.loaded / xhr.total == 1) {
                loadAmount += 1;
            }
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


const delta = 3;
let startX;
let startY;

document.getElementById("mainCanvas").addEventListener('mousedown', function (event) {
  startX = event.pageX;
  startY = event.pageY;
});

document.getElementById("mainCanvas").addEventListener('mouseup', function (event) {
  const diffX = Math.abs(event.pageX - startX);
  const diffY = Math.abs(event.pageY - startY);

  if (diffX < delta && diffY < delta) {
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
        loop: for (let [_i, x] of organelles.entries()) {
            for (let [_i2, x2] of x.mesh.entries()) {
                if (selectedObject.object.name == x2.name) {
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
  }
});

// Animation
function animate() {
    requestAnimationFrame(animate);
    document.getElementById("closeInfoButton").onclick = () => {
        infoPanel.selected = undefined;
    };

    document.onkeydown = (e) => {
        if (e.key == "Escape") {
            infoPanel.selected = undefined;
            infoTable.shown = false;
        }
    };

    document.getElementById("closeInfoTableButton").onclick = () => {
        infoTable.shown = !infoTable.shown;
    };
    document.getElementById("infoTableButton").onclick = () => {
        infoTable.shown = !infoTable.shown;
    };

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    if (infoPanel.selected == undefined) {
        infoPanel.style.bottom = "-100%";
    }

    if (loadAmount >= 10 && !loadIndicatorShown) {
        loading.innerHTML = "Loading complete. Enjoy.";
        loadIndicatorShown = true;
        setInterval(() => {
            enableWatermark = true;
            loading.innerHTML = "Created by Evan (Yifan) Zhou";
        }, 3000)
    }
    
    if (enableWatermark) {
        if (loading.innerHTML !== "Created by Evan (Yifan) Zhou") {
            loading.innerHTML = "Created by Evan (Yifan) Zhou";
        }
    }

    if (infoTable.shown) {
        infoTable.style.bottom = "0";
    }else{
        infoTable.style.bottom = "-100%";
    }

    // if (table.shown) {
        
    // }

    render();
}

// Render
function render() {
    renderer.render(scene, camera);
}
