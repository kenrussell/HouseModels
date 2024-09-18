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

function makeCube( size, position ) {
  const geometry = new THREE.BoxGeometry( size.x, size.y, size.z );
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set( position.x, position.y, position.z );
  return cube;
}

// 19' 8 1/2" x 1' x 18'
const floorWidth = 19.708333;
const floorThickness = 1; // For both the floor and walls
const floorDepth = 18;

const wallHeight = 10;

function buildPatio() {
  // Origin is at the top left corner of the patio, floor level, when viewed top down on Chad's plans
  // Measurements are in fractional feet

  const light = new THREE.PointLight( 0xffffff, 30, 0 );
  light.position.set(floorWidth / 2, wallHeight / 2, -floorDepth / 4);
  scene.add(light);
  
  // Floor
  scene.add(makeCube(new THREE.Vector3(floorWidth, floorThickness, floorDepth), new THREE.Vector3(floorWidth / 2, -floorThickness / 2, -floorDepth / 2)));

  // Left wall
  scene.add(makeCube(new THREE.Vector3(floorThickness, wallHeight, floorDepth), new THREE.Vector3(-floorThickness / 2, wallHeight / 2, -floorDepth / 2)));

  // Right wall
  scene.add(makeCube(new THREE.Vector3(floorThickness, wallHeight, floorDepth), new THREE.Vector3(floorWidth + floorThickness / 2, wallHeight / 2, -floorDepth / 2)));

  // Back wall
  scene.add(makeCube(new THREE.Vector3(floorWidth, wallHeight, floorThickness), new THREE.Vector3(floorWidth / 2, wallHeight / 2, -floorDepth)));

  // Now do the stairs...
}



//const geometry = new THREE.BoxGeometry( 1, 1, 1 );
//const geometry = new THREE.BoxGeometry( floorWidth, floorThickness, floorDepth );
//const cube = new THREE.Mesh( geometry, material );
//cube.position.set(new THREE.Vector3(floorWidth / 2, -floorThickness / 2, floorDepth / 2));
//cube.position.set(new THREE.Vector3(0, 0, 0));
//scene.add( cube );

buildPatio();


camera.position.x = floorWidth / 2;
camera.position.z = 50;
controls.update();

function animate() {
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
