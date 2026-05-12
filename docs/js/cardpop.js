// Card Pop Calculator - Business Logic and UI Handlers
// Exports: calculateCardPop(), handleFiles()

import { cardData, cardNames, cardDataRarity, cardDataSet, cardDataTypes } from './cardData.js';
import { bytesToString } from './bytesToString.js';

document.getElementById("input1").addEventListener("change", handleFiles, false);
document.getElementById("input2").addEventListener("change", handleFiles, false);

let p1bytes;
let p2bytes;

function handleFiles(event) {
    const file = event.target.files[0];

    if (!file) {
        console.error("No file selected.");
        return;
    }

    const playerNumber = this.getAttribute("player");
    const reader = new FileReader();

    reader.onload = (event) => {
        const saveFile = event.target.result;
        const saveFileBytes = new Uint8Array(saveFile);
        const playerBytes = saveFileBytes.slice(0x10, 0x20);
        if (playerNumber === "p1")
            p1bytes = playerBytes;
        else
            p2bytes = playerBytes;

        const playerNameBytes = playerBytes.slice(0, 13);
        const name = bytesToString(playerNameBytes);
        document.getElementById(playerNumber + "id").textContent = playerBytes.toHex();
        document.getElementById(playerNumber + "name").textContent = name;

        if ((p1bytes == null) || (p2bytes == null))
            return;

        document.getElementById("p1card").textContent = calculateCardPop(p1bytes, p2bytes, IRPARAM_CARD_POP);
        document.getElementById("p2card").textContent = calculateCardPop(p2bytes, p1bytes, IRPARAM_CARD_POP);
    };

    reader.readAsArrayBuffer(file);
}

function createCardPopCandidateList(a, b, c) {
    if (a === 0xff) {
        // Only energy cards
        return [
            "GRASS_ENERGY", "FIRE_ENERGY", "WATER_ENERGY", "LIGHTNING_ENERGY", "FIGHTING_ENERGY", "PSYCHIC_ENERGY",
            "GRASS_ENERGY", "FIRE_ENERGY", "WATER_ENERGY", "LIGHTNING_ENERGY", "FIGHTING_ENERGY", "PSYCHIC_ENERGY"
        ];
    }

    if (a === 0xfe) {
        // Only Phantom cards
        return [
            "VENUSAUR_LV64", "MEW_LV15", "HERE_COMES_TEAM_ROCKET", "LUGIA",
            "VENUSAUR_LV64", "MEW_LV15", "HERE_COMES_TEAM_ROCKET", "LUGIA"
        ];
    }

    // Otherwise, filter cards by rarity and set
    let wCardPopCandidateList = [];
    for (const card of cardData) {
        if (card.rarity === a && b <= card.set && card.set <= c) {
            wCardPopCandidateList.push(cardNames[card.id]);
        }
    }
    return wCardPopCandidateList;
}

// Card pop rarity
const CIRCLE = 0x0;
const DIAMOND = 0x1;
const STAR = 0x2;
const PHANTOM = 0xfe;
const ENERGY = 0xff;

// Card sets
const BEGINNING_POKEMON = 0;
const LEGENDARY_POWER = 1;
const ISLAND_OF_FOSSIL = 2;
const PSYCHIC_BATTLE = 3;
const SKY_FLYING_POKEMON = 4;
const WE_ARE_TEAM_ROCKET = 5;
const TEAM_ROCKETS_AMBITION = 6;
const PROMOTIONAL = 7;

// IR type
const IRPARAM_CARD_POP = 1;
const IRPARAM_SEND_CARDS = 2;
const IRPARAM_SEND_DECK = 3;
const IRPARAM_RARE_CARD_POP = 4;

const CIRCLE_CARD_LIST = createCardPopCandidateList(CIRCLE, BEGINNING_POKEMON, TEAM_ROCKETS_AMBITION);
const DIAMOND_CARD_LIST = createCardPopCandidateList(DIAMOND, BEGINNING_POKEMON, TEAM_ROCKETS_AMBITION);
const STAR_CARD_LIST = createCardPopCandidateList(STAR, BEGINNING_POKEMON, TEAM_ROCKETS_AMBITION);
const PHANTOM_CARD_LIST = createCardPopCandidateList(PHANTOM, BEGINNING_POKEMON, TEAM_ROCKETS_AMBITION);
const ENERGY_CARD_LIST = createCardPopCandidateList(ENERGY, BEGINNING_POKEMON, TEAM_ROCKETS_AMBITION);

const cardPopCandidateLists = new Map([
    [CIRCLE, CIRCLE_CARD_LIST],
    [DIAMOND, DIAMOND_CARD_LIST],
    [STAR, STAR_CARD_LIST],
    [PHANTOM, PHANTOM_CARD_LIST],
    [ENERGY, ENERGY_CARD_LIST],
]);

function hashName(nameBuffer) {
    let d = 0x0;
    let e = 0x0;
    for (const byte of nameBuffer) {
        e += byte;
        e &= 0xff;
        d ^= byte;
    }
    return [d, e];
}

function setRng(b, c, d, e) {
    const wRNG1 = (b - d) & 0xff;
    const wRNG2 = (c - e) & 0xff;
    const wRNGCounter = (wRNG2 + wRNG1) & 0xff;
    return [wRNG1, wRNG2, wRNGCounter];
}

function rotateLeft(n, d) {
    return ((n << d) | (n >>> (8 - d))) & 0xff;
}

function rotateLeftThroughCarry(n, carry) {
    n = (n << 1) | carry;
    carry = (n >>> 8) & 1;
    n &= 0xff;
    return [n, carry];
}

function updateRngSources(wRNG1, wRNG2, wRNGCounter) {
    let d = wRNG2;
    let e = wRNG1;
    let a = d;

    a = rotateLeft(a, 2);
    a ^= e;

    let carry = a & 1;
    a = (a >>> 1) & 0xff;

    d ^= e;
    let tmp = wRNGCounter;
    tmp ^= e;
    e = tmp;

    [e, carry] = rotateLeftThroughCarry(e, carry);
    [d, carry] = rotateLeftThroughCarry(d, carry);
    a = d;
    a ^= e;

    wRNGCounter += 1;
    wRNGCounter &= 0xff;
    wRNG2 = d;
    wRNG1 = e;
    return [a, wRNG1, wRNG2, wRNGCounter];
}

function random(h, wRNG1, wRNG2, wRNGCounter) {
    let l;
    [l, wRNG1, wRNG2, wRNGCounter] = updateRngSources(wRNG1, wRNG2, wRNGCounter);

    const hl = (h * l) & 0xffff;
    h = (hl >>> 8) & 0xff;
    return [h, wRNG1, wRNG2, wRNGCounter];
}

function getRarity(e, wCardPopType) {
    return e === 5 ? PHANTOM
         : wCardPopType === IRPARAM_RARE_CARD_POP || e < 64 ? STAR
         : e < 154 ? DIAMOND
         : CIRCLE;
}

function calculateCardPop(p1NameBuffer, p2NameBuffer, wCardPopType) {
    const [b, c] = hashName(p1NameBuffer);
    const [d, e] = hashName(p2NameBuffer);

    let [wRNG1, wRNG2, wRNGCounter] = setRng(b, c, d, e);

    const rarity = getRarity(wRNG2, wCardPopType);

    const  wCardPopCandidateList = cardPopCandidateLists.get(rarity);

    const [hl] = random(wCardPopCandidateList.length, wRNG1, wRNG2, wRNGCounter);
    return wCardPopCandidateList[hl];
}
