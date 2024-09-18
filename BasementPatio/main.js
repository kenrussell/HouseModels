import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
//const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
//const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

const light = new THREE.DirectionalLight( 0xffffff, 1.0 );
light.position.set( 2, 1, 1 );
light.target.position.set( 0, 0, 0 );
scene.add( light );

const renderer = new THREE.WebGLRenderer();
document.body.appendChild( renderer.domElement );
renderer.setSize( window.innerWidth, window.innerHeight );

const controls = new OrbitControls( camera, renderer.domElement );

// Patio was 228-1/4" across, measured via tape measure.
// 139" from the floor of the patio to the top of the concrete.
// At the back wall, at ground level, it's currently 28-29" from the ground to the top of the concrete.

const patioWidth = 19.0208333;
const wallThickness = 1; // For both the floor and the walls
const patioHeight = 11.583333;

const patioDepth = 18;  // Not actually measured

// Stair treads are each 1' deep
// Designed to have 18 risers, 16 treads
// Each is about 7.72222" high
const treadDepth = 1;
const stairRise = 7.72222 / 12.0;
const stairWidth = 3;

const planterDepth = 1;

function makeCube( size, position ) {
  const geometry = new THREE.BoxGeometry( size.x, size.y, size.z );
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set( position.x, position.y, position.z );
  return cube;
}

function buildStair( scene, height, horizOffset ) {
  const verticalFace = makeCube(new THREE.Vector3(treadDepth, height - wallThickness, wallThickness),
                                new THREE.Vector3(treadDepth / 2 + horizOffset, (height - wallThickness) / 2, wallThickness / 2 + planterDepth));
  const tread = makeCube(new THREE.Vector3(treadDepth, wallThickness, stairWidth),
                         new THREE.Vector3(treadDepth / 2 + horizOffset, height - (wallThickness / 2), treadDepth / 2 + planterDepth + wallThickness));
  scene.add(verticalFace);
  scene.add(tread);
}


function buildPatio() {
  // Origin is at the back bottom left corner of the patio when viewed top down on Chad's plans
  // Measurements are in fractional feet

  const light = new THREE.PointLight( 0xffffff, 30, 0 );
  light.position.set(patioWidth / 2, patioHeight / 2, -patioDepth / 4);
  scene.add(light);
  
  // Floor
  // Bump it out to meet the walls at more than just an edge
  scene.add(makeCube(new THREE.Vector3(patioWidth + 2 * wallThickness, wallThickness, patioDepth + wallThickness),
                     new THREE.Vector3(patioWidth / 2, -wallThickness / 2, patioDepth / 2 - wallThickness / 2)));

  // Left wall
  scene.add(makeCube(new THREE.Vector3(wallThickness, patioHeight, patioDepth),
                     new THREE.Vector3(-wallThickness / 2, patioHeight / 2, patioDepth / 2)));

  // Right wall
  scene.add(makeCube(new THREE.Vector3(wallThickness, patioHeight, patioDepth),
                     new THREE.Vector3(patioWidth + wallThickness / 2, patioHeight / 2, patioDepth / 2)));

  // Back wall
  // Bump it out edge to edge
  scene.add(makeCube(new THREE.Vector3(patioWidth + 2 * wallThickness, patioHeight, wallThickness),
                     new THREE.Vector3(patioWidth / 2, patioHeight / 2, -wallThickness / 2)));

  // Now do the stairs...
  let horizOffset = 0;
  let curStairHeight = patioHeight;
  for (let ii = 0; ii < 18; ++ii) {
    buildStair(scene, curStairHeight, horizOffset);
    curStairHeight -= stairRise;
    horizOffset += treadDepth;
  }
}



//const geometry = new THREE.BoxGeometry( 1, 1, 1 );
//const geometry = new THREE.BoxGeometry( floorWidth, floorThickness, floorDepth );
//const cube = new THREE.Mesh( geometry, material );
//cube.position.set(new THREE.Vector3(floorWidth / 2, -floorThickness / 2, floorDepth / 2));
//cube.position.set(new THREE.Vector3(0, 0, 0));
//scene.add( cube );

buildPatio();


camera.position.x = patioWidth / 2;
camera.position.z = 50;
controls.update();

function animate() {
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
