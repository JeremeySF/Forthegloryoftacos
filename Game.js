// Basic setup for Three.js
let scene, camera, renderer, player;
let mapSize = 100; // 100x100x100 cubes
let cubeSize = 1;
let hitCount = 0;

const socket = io();  // Connect to the server for multiplayer

function init() {
  // Scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas") });
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Player setup
  player = new THREE.Object3D();
  camera.position.set(0, 1.6, 0); // Camera is at the player's height
  player.add(camera);
  scene.add(player);

  // Generate the map
  generateMap();

  // Handle player movement
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  animate();
}

function generateMap() {
  let texture = new THREE.TextureLoader().load('path/to/texture.jpg');
  let material = new THREE.MeshBasicMaterial({ map: texture });

  for (let x = 0; x < mapSize; x++) {
    for (let y = 0; y < mapSize; y++) {
      let geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      let cube = new THREE.Mesh(geometry, material);
      cube.position.set(x * cubeSize, 0, y * cubeSize);
      scene.add(cube);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onKeyDown(event) {
  switch(event.code) {
    case 'KeyW': // Forward
      player.position.z -= 0.1;
      break;
    case 'KeyS': // Backward
      player.position.z += 0.1;
      break;
    case 'KeyA': // Left
      player.position.x -= 0.1;
      break;
    case 'KeyD': // Right
      player.position.x += 0.1;
      break;
    case 'ArrowUp': // Look up
      camera.rotation.x -= 0.01;
      break;
    case 'ArrowDown': // Look down
      camera.rotation.x += 0.01;
      break;
    case 'ArrowLeft': // Look left
      player.rotation.y += 0.01;
      break;
    case 'ArrowRight': // Look right
      player.rotation.y -= 0.01;
      break;
  }
}

function openLobby() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('lobby').style.display = 'block';
}

function joinGame() {
  let code = document.getElementById('codeInput').value;
  if (code) {
    socket.emit('joinGame', code);
  }
}

function createLobby() {
  socket.emit('createLobby');
}

socket.on('startGame', (mapData) => {
  document.getElementById('lobby').style.display = 'none';
  init();
});

// Notify player on hit
socket.on('hit', () => {
  hitCount++;
  if (hitCount >= 7) {
    alert('You died!');
    socket.emit('playerDead');
  }
});
