import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { Mesh, UVMapping } from 'three'

// Texture Loaders
const loader = new THREE.TextureLoader()
const cross = loader.load('./Star.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('./Globe.jpg')
})
)

scene.add(sphere)

// Particles
const particlesGeometry = new THREE.BufferGeometry;
const particlesCnt = 2500;
const posArray = new Float32Array(particlesCnt * 3);

for(let i = 0; i < particlesCnt * 3; i++){
posArray[i] = (Math.random() - 0.5) * 100
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray,3))

// Particles Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.2,
    map: cross,
    transparent: true,
    color: 'white'
})

// Particles Mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add( particlesMesh );

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -6
camera.position.y = 0
camera.position.z = 15

scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(new THREE.Color('#000000'), 1)

// Mouse
 document.addEventListener('mousemove', onDocumentMouseMove)

 let mouseX = 0;
 let mouseY = 0;

 let targetX = 0;
 let targetY = 0;
 
 const windowX = window.innerWidth / 2;
 const windowY = window.innerHeight / 2;
 
 function onDocumentMouseMove(event) {
     mouseX = (event.clientX - windowX)
     mouseY = (event.clientY - windowY)
 }

// Mousemove
const clock = new THREE.Clock()

const tick = () =>
{
    targetX = mouseX * .0008
    targetY = mouseY * .0008

    const elapsedTime = clock.getElapsedTime()

    // Mousemove Sphere
    sphere.rotation.y = .07 * elapsedTime
    sphere.rotation.y += .2* (targetX - sphere.rotation.y)
    sphere.rotation.x += .02 * (targetY - sphere.rotation.x)
    sphere.position.z += .01 * (targetY - sphere.rotation.x)

    // Mousemove Particles
    particlesMesh.rotation.y = mouseX * (elapsedTime * 0.000035)
    particlesMesh.rotation.x = mouseY * (elapsedTime * 0.000035)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()