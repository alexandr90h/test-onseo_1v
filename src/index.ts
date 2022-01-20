import * as PIXI from 'pixi.js';
var throttle = require('lodash.throttle');
const TWEEN = require('@tweenjs/tween.js')

interface Ships {
    id: number;
    filled: boolean;
    color: string;
    waiting: boolean;
    numberInLine: number;
    shipContainer: PIXI.Container;
    stoped: boolean;
}
interface Dock {
    id: number;
    name: string;
    filled: boolean;
    berthCoordinates: { x: number, y: number };
    isBusy: boolean;
}

let docksState: Dock[] = [
    {
        id: 1,
        name: "dock1",
        filled: false,
        berthCoordinates: { x: 30, y: 105 },
        isBusy: false
    },
    {
        id: 2,
        name: "dock2",
        filled: false,
        berthCoordinates: { x: 30, y: 225 },
        isBusy: false
    },
    {
        id: 3,
        name: "dock3",
        filled: false,
        berthCoordinates: { x: 30, y: 345 },
        isBusy: false
    },
    {
        id: 4,
        name: "dock4",
        filled: false,
        berthCoordinates: { x: 30, y: 465 },
        isBusy: false
    }
]
let shipsState: Ships[] = []
let passageIsBusy: boolean = false

function getDock(filled: boolean) {
    const dock = docksState.filter(e => !e.isBusy)
    // console.log('dockIsBusy:', dock.length);
    if (dock.length > 0) {
        const currentDock = filled ? dock.find(e => e.filled === false) : dock.find(e => e.filled === true)
        // console.log('currentDock:', currentDock);
        docksState = docksState.map(e => { if (e.id === currentDock?.id) { return { ...currentDock, isBusy: true } } else return e })
        return currentDock
    } else {
        return undefined
    }
}
function testForAABB(object1: PIXI.Graphics, object2: PIXI.Container) {
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

    return bounds1.x < bounds2.x + bounds2.width + 1
        && bounds1.x + bounds1.width + 1 > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds1.height > bounds2.y;
}

let app = new PIXI.Application({ width: 800, height: 600, backgroundColor: 0x3a56f2 });
document.body.appendChild(app.view)

const dock1 = new PIXI.Sprite()
const dock2 = new PIXI.Sprite()
const dock3 = new PIXI.Sprite()
const dock4 = new PIXI.Sprite()
app.stage.addChild(dock1)
app.stage.addChild(dock2)
app.stage.addChild(dock3)
app.stage.addChild(dock4)

docksState.forEach((dock, idx) => {
    const dockEmpty = new PIXI.Graphics()
    const dockFull = new PIXI.Graphics()
    dockEmpty.lineStyle(5, 0xe3e344, 1).beginFill(0x3a56f2).drawRect(3, 2, 25, 100).endFill()
    dockFull.lineStyle(5, 0xe3e344, 1).beginFill(0xe3e344).drawRect(3, 2, 25, 100).endFill()
    dockFull.alpha = 0
    if (idx === 0) {
        dock1.y = 70
        dock1.addChild(dockEmpty)
        dock1.addChild(dockFull)
    } if (idx === 1) {
        dock2.y = 190
        dock2.addChild(dockEmpty)
        dock2.addChild(dockFull)
    }
    if (idx === 2) {
        dock3.y = 310
        dock3.addChild(dockEmpty)
        dock3.addChild(dockFull)
    }
    if (idx === 3) {
        dock4.y = 430
        dock4.addChild(dockEmpty)
        dock4.addChild(dockFull)
    }

})


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

const passage = new PIXI.Graphics
passage.lineStyle(0, 0xf003fc, 1).beginFill(0xf003fc).drawRect(200, 200, 10, 200).endFill().alpha = 0
app.stage.addChild(passage)

function overloadDock(dockObj: PIXI.Sprite, filled: boolean) {
    filled ? dockObj.children[1].alpha = 1 : dockObj.children[1].alpha = 0
}
function onShipWithLine(ship: PIXI.Container, dock: Dock, shipFilled: boolean, red: PIXI.Sprite, green: PIXI.Sprite) {
    const coordsC = { x: 220, y: shipFilled ? 220 : 350 }
    const tweenC = new TWEEN.Tween(coordsC)
        .to({ x: 30, y: dock.id * 105 + ((dock.id - 1) * 15) }, 2000)
        .onUpdate(() => {
            ship.x = coordsC.x, ship.y = coordsC.y
        })
        .onComplete(() => {
            // console.log('onComplete');
            // dockCoord = docks[dock.id - 1].berthCoordinates
            shipFilled ? overloadShip(red, shipFilled) : overloadShip(green, shipFilled)
            tweenD.delay(1000)
            setTimeout(() => {
                if (shipFilled) {
                    docksState.forEach(e => { if (e.id === dock.id) { e.filled = true; e.isBusy = false } })

                }
                else {
                    docksState.forEach(e => { if (e.id === dock.id) { e.filled = false; e.isBusy = false } })

                }
                switch (dock.id) {
                    case 1:
                        overloadDock(dock1, shipFilled)
                        break;
                    case 2:
                        overloadDock(dock2, shipFilled)
                        break;
                    case 3:
                        overloadDock(dock3, shipFilled)
                        break;
                    case 4:
                        overloadDock(dock4, shipFilled)
                        break;
                    default:
                        break;
                }
            }, 1000);
        })
    const coordsD = { x: 30, y: dock.id * 105 + ((dock.id - 1) * 15) }
    const tweenD = new TWEEN.Tween(coordsD)
        .to({ x: 170, y: 295 }, 2000)
        .onUpdate(() => {
            ship.x = coordsD.x, ship.y = coordsD.y
        })
    const coordsE = { x: 170, y: 295 }
    const tweenE = new TWEEN.Tween(coordsE)
        .to({ x: 810, y: 295 }, 4000)
        .onUpdate(() => {
            ship.x = coordsE.x, ship.y = coordsE.y
        }).onComplete(() => {
            ship.destroy()
        })

    // tweenB.chain(tweenC)
    tweenC.chain(tweenD)
    tweenD.chain(tweenE)
    tweenC.start()

}

function changePlaceInLine(ship: PIXI.Container, shipObj: Ships, delay: number) {
    shipsState.forEach(e => { if (e.id === shipObj.id) { e.numberInLine = shipObj.numberInLine - 1 } })
    const coordsA = { x: shipObj.numberInLine * 80 + 220 }
    const tweenA = new TWEEN.Tween(coordsA)
        .to({ x: (shipObj.numberInLine * 80 + 220) - 80 }, 1000)
        .onUpdate(() => {
            ship.x = coordsA.x
        }).delay(delay).onComplete(() => {
        })
    tweenA.start()
}

declare global {
    interface Window {
        api?: any;
    }
}
function overloadShip(params: PIXI.Sprite, filled: boolean) {
    const size = { s: filled ? 60 : 0 }
    const tween = new TWEEN.Tween(size) // Create a new tween that modifies 'coords'.
        .to({ s: filled ? 0 : 60 }, 1000) // Move to (300, 200) in 1 second.
        .onUpdate(() => {
            params.width = size.s
        })
    tween.start()

}


function createStartShip() {
    const filled = !!Math.round(Math.random())
    const shipId = shipsState.length + 1
    const dock = getDock(filled)
    const shipElement = new PIXI.Container();
    shipElement.position = new PIXI.Point(810, 300);
    app.stage.addChild(shipElement);
    const empty_Green = PIXI.Sprite.from('assets/images/green-ship-empty.png');
    empty_Green.width = 60;
    empty_Green.height = 30;
    const full_Green = PIXI.Sprite.from('assets/images/green-ship-full.png');
    full_Green.width = 0;
    full_Green.height = 30;
    const empty_Red = PIXI.Sprite.from('assets/images/red-ship-empty.png');
    empty_Red.width = 60;
    empty_Red.height = 30;
    const full_Red = PIXI.Sprite.from('assets/images/red-ship-full.png');
    full_Red.width = 60;
    full_Red.height = 30;
    if (filled) {
        shipElement.addChild(empty_Red);
        shipElement.addChild(full_Red);
    } else {
        shipElement.addChild(empty_Green);
        shipElement.addChild(full_Green);

    }

    const currentShip = {
        id: shipId,
        filled: filled,
        color: filled ? 'red' : 'green',
        waiting: !dock,
        numberInLine: !!dock ? 0 : shipsState.filter(ship => ship.waiting == true && ship.filled === filled).length + 1,
        shipContainer: shipElement,
        stoped: false
    }
    // console.table(currentShip)
    shipsState.push(currentShip)

    // app.ticker.add((delta) => {
    //     if (testForAABB(passage, shipElement)) {
    //         passage.tint = 0x000000
    //     } else passage.tint = 0xffffff
    // })

    if (!!dock) {
        const coordsA = { x: 810, y: 260 }
        const tweenA = new TWEEN.Tween(coordsA)
            .to({ x: 210, y: 260 }, 5000)
            // .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                shipElement.x = coordsA.x, shipElement.y = coordsA.y
            })
        const coordsB = { x: 210, y: 260 }
        const tweenB = new TWEEN.Tween(coordsB)
            .to({ x: 30, y: dock.id * 105 + ((dock.id - 1) * 15) }, 2000)
            .onUpdate(() => {
                if (testForAABB(passage, shipElement)) {
                    passageIsBusy = true
                } else { passageIsBusy = false }
                shipElement.x = coordsB.x, shipElement.y = coordsB.y
            })
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                // console.log('onComplete');
                filled ? overloadShip(full_Red, filled) : overloadShip(full_Green, filled)
                tweenC.delay(1000)
                setTimeout(() => {
                    if (filled) {
                        docksState.forEach(e => { if (e.id === dock?.id) { e.filled = true; e.isBusy = false } })
                    }
                    else {
                        docksState.forEach(e => { if (e.id === dock?.id) { e.filled = false; e.isBusy = false } })
                    }
                    switch (dock.id) {
                        case 1:
                            overloadDock(dock1, filled)
                            break;
                        case 2:
                            overloadDock(dock2, filled)
                            break;
                        case 3:
                            overloadDock(dock3, filled)
                            break;
                        case 4:
                            overloadDock(dock4, filled)
                            break;
                        default:
                            break;
                    }
                }, 1000);
                // tweenC.start()
            })

        const coordsC = { x: 30, y: dock.id * 105 + ((dock.id - 1) * 15) }
        const tweenC = new TWEEN.Tween(coordsC)
            .to({ x: 170, y: 295 }, 2000)
            .onUpdate(() => {
                shipElement.x = coordsC.x, shipElement.y = coordsC.y
            })
        const coordsD = { x: 170, y: 295 }
        const tweenD = new TWEEN.Tween(coordsD)
            .to({ x: 810, y: 295 }, 4000)
            .onUpdate(() => {
                shipElement.x = coordsD.x, shipElement.y = coordsD.y
            }).onComplete(() => {
                shipElement.destroy()
            })

        tweenA.chain(tweenB)
        tweenB.chain(tweenC)
        tweenC.chain(tweenD)
        tweenA.start()
    }
    else {
        const coordsA = { x: 810, y: 300 }
        const tweenA = new TWEEN.Tween(coordsA)
            .to({ x: (shipsState.filter(ship => ship.waiting).length * 80 - 80) + 220, y: currentShip.filled ? 220 : 350 }, 5000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                shipElement.x = coordsA.x, shipElement.y = coordsA.y
            }).onComplete(() => {
                app.ticker.add(() => {
                    if (shipsState.find(e => e.id === currentShip.id && e.numberInLine === 1)) {
                        const freeDock = getDock(filled)
                        if (!!freeDock) {
                            shipsState.forEach(e => { if (e.id === shipId) { e.waiting = false; e.numberInLine = 0 } })
                            onShipWithLine(shipElement, freeDock, filled, full_Red, full_Green)
                            const shipsInLineNow = shipsState.filter(e => e.waiting === true && e.filled === !freeDock.filled && e.stoped === true)
                            for (let i = 0; i < shipsInLineNow.length; i++) {
                                changePlaceInLine(shipsInLineNow[i].shipContainer, shipsInLineNow[i], 1000);
                            }
                        }
                    }
                })
                // if (shipsState.find(e => e.id === currentShip.id && e.numberInLine === 2) && shipsState.some(e => e.waiting === true && e.filled === filled && e.numberInLine !== 1)) {
                //     changePlaceInLine(shipElement, currentShip, 0);
                // }
                shipsState.forEach(e => { if (e.id === shipId) e.stoped = true })
                if ((currentShip.numberInLine - shipsState.filter(e => e.waiting === true && e.filled === filled).length) >= 1) { changePlaceInLine(shipElement, currentShip, 0); }
            })
        tweenA.start()
    }
    // console.log(app.stage.children);
}

const throttleCreateShip = throttle(createStartShip, 8000)

// Setup the animation loop.
function animate(time: any) {
    throttleCreateShip()
    requestAnimationFrame(animate)
    TWEEN.update(time)
}
requestAnimationFrame(animate)

// setInterval(() => {
//     const arr = shipsState.filter(e => e.waiting === true)
//     if (arr.length > 0)
//         console.table(arr)
// }, 2000);

