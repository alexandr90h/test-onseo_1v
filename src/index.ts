import * as PIXI from 'pixi.js';
// import { HelloWorld } from './scenes/helloWorld';
const TWEEN = require('@tweenjs/tween.js')
import * as docks from '../assets/data/docks.json';
interface Ships {
    id: number;
    filled: boolean;
    color: string;
}
let docksState = docks;
let shipsState: Ships[] = []

function getRandomCoordsStartShip(min: number, max: number) {
    return Math.random() * (max - min) + min;
}
function getCoordsFullDock() {
    const dock = docksState.find(e => e.filled)
    if (dock) { return dock.berthCoordinates } else { return { x: 300, y: 200 } }
}
function getCoordsEmptyDock() {
    const dock = docksState.find(e => !e.filled)
    if (dock) { return dock.berthCoordinates } else { return { x: 300, y: 200 } }
}

function createStartShip() {
    const filled = !!Math.round(Math.random())
    const shipElement = new PIXI.Graphics()
    shipElement.lineStyle(5, filled ? 0xd12626 : 0x3bcc47, 1)
    shipElement.beginFill(filled ? 0xd12626 : 0x3a56f2)
    shipElement.drawRect(-2, 0, 60, 30)
    shipElement.endFill()
    shipElement.x = 740
    shipElement.y = 100
    app.stage.addChild(shipElement)
    shipsState.push({ id: shipsState.length + 1, filled: filled, color: filled ? 'green' : 'red' })

    const coords = { x: 740, y: getRandomCoordsStartShip(0, 570) } // Start at (0, 0)
    const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to(filled ? getCoordsEmptyDock() : getCoordsFullDock(), 10000) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(() => {
            // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
            shipElement.x = coords.x, shipElement.y = coords.y
        })
        .start() // Start the tween immediately.
}

let app = new PIXI.Application({ width: 800, height: 600, backgroundColor: 0x3a56f2 });
document.body.appendChild(app.view)

let dock1 = new PIXI.Graphics()
dock1.lineStyle(5, 0xe3e344, 1)
dock1.beginFill(docksState.find(e => e.id === 1)?.filled ? 0xe3e344 : 0x3a56f2)
dock1.drawRect(3, 2, 20, 100)
dock1.y = 70
dock1.endFill()
app.stage.addChild(dock1)

let dock2 = new PIXI.Graphics()
dock2.lineStyle(5, 0xe3e344, 1)
dock2.beginFill(docksState.find(e => e.id === 2)?.filled ? 0xe3e344 : 0x3a56f2)
dock2.drawRect(3, 2, 20, 100)
dock2.y = 190
dock2.endFill()
app.stage.addChild(dock2)

let dock3 = new PIXI.Graphics()
dock3.lineStyle(5, 0xe3e344, 1)
dock3.beginFill(docksState.find(e => e.id === 3)?.filled ? 0xe3e344 : 0x3a56f2)
dock3.drawRect(3, 2, 20, 100)
dock3.y = 310
dock3.endFill()
app.stage.addChild(dock3)

let dock4 = new PIXI.Graphics()
dock4.lineStyle(5, 0xe3e344, 1)
dock4.beginFill(docksState.find(e => e.id === 4)?.filled ? 0xe3e344 : 0x3a56f2)
dock4.drawRect(3, 2, 20, 100)
dock4.y = 430
dock4.endFill()
app.stage.addChild(dock4)

const wall_1 = new PIXI.Graphics()
wall_1.lineStyle(0, 0xe3e344, 1)
wall_1.beginFill(0xe3e344)
wall_1.drawRect(200, 0, 10, 200)
wall_1.endFill()
app.stage.addChild(wall_1)

const wall_2 = new PIXI.Graphics()
wall_2.lineStyle(0, 0xe3e344, 1)
wall_2.beginFill(0xe3e344)
wall_2.drawRect(200, 400, 10, 200)
wall_2.endFill()
app.stage.addChild(wall_2)




// Setup the animation loop.
function animate(time: any) {
    requestAnimationFrame(animate)
    TWEEN.update(time)
}
requestAnimationFrame(animate)

setInterval(() => {
    createStartShip();
    console.log('🚢:', shipsState);
}, 8000);
