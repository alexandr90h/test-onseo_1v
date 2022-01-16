import * as PIXI from 'pixi.js';
// import { HelloWorld } from './scenes/helloWorld';
const TWEEN = require('@tweenjs/tween.js')
import * as docks from '../assets/data/docks.json';
interface Ships {
    id: number;
    filled: boolean;
    color: string;
    waiting: boolean;
    objectShip: PIXI.Graphics;
}
let docksState = docks;
let shipsState: Ships[] = []

function getDock(filled: boolean) {
    const dock = docksState.filter(e => !e.isBusy)
    console.log('dockIsBusy:', dock.length);
    if (dock.length > 0) {
        const currentDock = filled ? dock.find(e => e.filled === false) : dock.find(e => e.filled === true)
        console.log('currentDock:', currentDock);
        docksState = docksState.map(e => { if (e.id === currentDock?.id) { return { ...currentDock, isBusy: true } } else return e })
        return currentDock
    } else {
        return undefined
    }
}
function getInLine(filled: boolean) {
    if (filled) { return !docksState.some(e => e.isBusy === false && e.filled === false) }
    else {
        return !docksState.some(e => e.isBusy === false && e.filled === true)
    }
}
// function testForAABB(object1: PIXI.Graphics, object2: PIXI.Graphics) {
//     const bounds1 = object1.getBounds();
//     const bounds2 = object2.getBounds();

//     return bounds1.x < bounds2.x + bounds2.width + 1
//         && bounds1.x + bounds1.width + 1 > bounds2.x
//         && bounds1.y < bounds2.y + bounds2.height
//         && bounds1.y + bounds1.height > bounds2.y;
// }

let app = new PIXI.Application({ width: 800, height: 600, backgroundColor: 0x3a56f2 });
document.body.appendChild(app.view)

const dock1 = new PIXI.Graphics()
dock1.lineStyle(5, 0xe3e344, 1)
dock1.beginFill(docksState.find(e => e.id === 1)?.filled ? 0xe3e344 : 0x3a56f2)
dock1.drawRect(3, 2, 20, 100)
dock1.y = 70
dock1.endFill()
app.stage.addChild(dock1)

const dock2 = new PIXI.Graphics()
dock2.lineStyle(5, 0xe3e344, 1)
dock2.beginFill(docksState.find(e => e.id === 2)?.filled ? 0xe3e344 : 0x3a56f2)
dock2.drawRect(3, 2, 20, 100)
dock2.y = 190
dock2.endFill()
app.stage.addChild(dock2)

const dock3 = new PIXI.Graphics()
dock3.lineStyle(5, 0xe3e344, 1)
dock3.beginFill(docksState.find(e => e.id === 3)?.filled ? 0xe3e344 : 0x3a56f2)
dock3.drawRect(3, 2, 20, 100)
dock3.y = 310
dock3.endFill()
app.stage.addChild(dock3)

const dock4 = new PIXI.Graphics()
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

function createStartShip() {
    const filled = !!Math.round(Math.random())
    const shipId = shipsState.length + 1
    const dock = getDock(filled)
    const dockCoord = dock?.berthCoordinates;
    const shipElement = new PIXI.Graphics()
    shipElement.lineStyle(5, filled ? 0xd12626 : 0x3bcc47, 1)
    shipElement.beginFill(filled ? 0xd12626 : 0x3a56f2)
    shipElement.drawRect(-2, 0, 60, 30)
    shipElement.endFill()
    shipElement.x = 800
    app.stage.addChild(shipElement)
    shipsState.push({ id: shipId, filled: filled, color: filled ? 'green' : 'red', waiting: !dock, objectShip: shipElement })
    console.log('getInLine(filled):', getInLine(filled));
    console.log('shipsState-waiting:', shipsState.filter(ship => ship.waiting).length);
    // console.log(!!dock);

    if (!!dock) {
        const coordsA = { x: 810, y: 300 } // Start at (0, 0)
        const tweenA = new TWEEN.Tween(coordsA) // Create a new tween that modifies 'coords'.
            .to({ x: 200, y: 300 }, 6000) // Move to (300, 200) in 1 second.
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                shipElement.x = coordsA.x, shipElement.y = coordsA.y
            })
        const coordsB = { x: 200, y: 300 }
        const tweenB = new TWEEN.Tween(coordsB) // Create a new tween that modifies 'coords'.
            .to(dockCoord, 4000) // Move to (300, 200) in 1 second.
            .onUpdate(() => {
                console.log(dockCoord);
                shipElement.x = coordsB.x, shipElement.y = coordsB.y
            }).onComplete(() => {
                console.log('onComplete');
                tweenC.delay(5000)
                setTimeout(() => {
                    if (filled) {
                        docksState.forEach(e => { if (e.id === dock?.id) { e.filled = true; e.isBusy = false } })

                    }
                    else {
                        docksState.forEach(e => { if (e.id === dock?.id) { e.filled = false; e.isBusy = false } })

                    }
                    switch (dock.id) {
                        case 1:
                            filled ? dock1.tint = 0xe3e344 : dock1.tint = 0xffffff
                            break;
                        case 2:
                            filled ? dock2.tint = 0xe3e344 : dock2.tint = 0xffffff
                            break;
                        case 3:
                            filled ? dock3.tint = 0xe3e344 : dock3.tint = 0xffffff
                            break;
                        case 4:
                            filled ? dock4.tint = 0xe3e344 : dock4.tint = 0xffffff
                            break;
                        default:
                            break;
                    }
                }, 5000);
                // tweenC.start()
            })

        const coordsC = dock.berthCoordinates
        const tweenC = new TWEEN.Tween(coordsC) // Create a new tween that modifies 'coords'.
            .to({ x: 170, y: 220 }, 4000) // Move to (300, 200) in 1 second.
            .onUpdate(() => {
                shipElement.x = coordsC.x, shipElement.y = coordsC.y
            })
        const coordsD = { x: 170, y: 220 }
        const tweenD = new TWEEN.Tween(coordsD) // Create a new tween that modifies 'coords'.
            .to({ x: 810, y: 220 }, 4000) // Move to (300, 200) in 1 second.
            .onUpdate(() => {
                shipElement.x = coordsD.x, shipElement.y = coordsD.y
            })


        tweenA.chain(tweenB)
        tweenB.chain(tweenC)
        tweenC.chain(tweenD)
        tweenA.start()
    }
    else {
        const coordsA = { x: 810, y: 300 } // Start at (0, 0)
        const tweenA = new TWEEN.Tween(coordsA) // Create a new tween that modifies 'coords'.
            .to({ x: (shipsState.filter(ship => ship.waiting).length * 80) + 200, y: 350 }, 6000) // Move to (300, 200) in 1 second.
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                // Called after tween.js updates 'coords'.
                // Move 'box' to the position described by 'coords' with a CSS translation.
                shipElement.x = coordsA.x, shipElement.y = coordsA.y
            })
        tweenA.start()
    }
}



// Setup the animation loop.
function animate(time: any) {
    requestAnimationFrame(animate)
    TWEEN.update(time)
}
requestAnimationFrame(animate)

setInterval(() => {
    createStartShip();
    // console.log('🗼🗼🗼', docksState[0]);
    // console.log('🚢:', shipsState);
}, 8000);

