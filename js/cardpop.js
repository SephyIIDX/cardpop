
document.getElementById("input1").addEventListener("change", handleFiles, false);
document.getElementById("input2").addEventListener("change", handleFiles, false);

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
        const playerBytes = saveFileBytes.slice(0x10,0x20);
        const playerNameBytes = playerBytes.slice(0,13);
        const name = bytesToString(playerNameBytes);
        document.getElementById(playerNumber+"id").textContent = playerBytes.toHex();
        document.getElementById(playerNumber+"name").textContent = name;
    };

    reader.readAsArrayBuffer(file);
}

function bytesToString(bytes) {
    const latin = new Map([
        [0x10, "A"],
        [0x11, "B"],
        [0x12, "C"],
        [0x13, "D"],
        [0x14, "E"],
        [0x15, "F"],
        [0x16, "G"],
        [0x17, "H"],
        [0x18, "I"],
        [0x19, "J"],
        [0x1a, "K"],
        [0x1b, "L"],
        [0x1c, "M"],
        [0x1d, "N"],
        [0x1e, "O"],
        [0x1f, "P"],
        [0x20, "Q"],
        [0x21, "R"],
        [0x22, "S"],
        [0x23, "T"],
        [0x24, "U"],
        [0x25, "V"],
        [0x26, "W"],
        [0x27, "X"],
        [0x28, "Y"],
        [0x29, "Z"],
        [0x2a, "a"],
        [0x2b, "b"],
        [0x2c, "c"],
        [0x2d, "d"],
        [0x2e, "e"],
        [0x2f, "f"],
        [0x30, "g"],
        [0x31, "h"],
        [0x32, "i"],
        [0x33, "j"],
        [0x34, "k"],
        [0x35, "l"],
        [0x36, "m"],
        [0x37, "n"],
        [0x38, "o"],
        [0x39, "p"],
        [0x3a, "q"],
        [0x3b, "r"],
        [0x3c, "s"],
        [0x3d, "t"],
        [0x3e, "u"],
        [0x3f, "v"],
        [0x40, "w"],
        [0x41, "x"],
        [0x42, "y"],
        [0x43, "z"],
        [0x46, "о"],
        [0x4d, "@"],
        [0x4e, ":"],
        [0x4f, ";"],
        [0x57, "_"],
        [0x5d, "ˍ"],
        [0x5e, "&"],
        [0x5f, "*"],
        [0x60, "<"],
        [0x61, ">"],
        [0x62, "="]
    ]);

    const symbols = new Map([
        [0x01, "FIRE"],
        [0x02, "GRASS"],
        [0x03, "LIGHTNING"],
        [0x04, "WATER"],
        [0x05, "FIGHTING"],
        [0x06, "PSYCHIC"],
        [0x07, "COLORLESS"],
        [0x08, "RAINBOW"],
        [0x11, "Lv"],
        [0x13, "No"]
    ]);

    const hiragana = new Map([
        [0x10, "を"],
        [0x11, "あ"],
        [0x12, "い"],
        [0x13, "う"],
        [0x14, "え"],
        [0x15, "お"],
        [0x16, "か"],
        [0x17, "き"],
        [0x18, "く"],
        [0x19, "け"],
        [0x1a, "こ"],
        [0x1b, "さ"],
        [0x1c, "し"],
        [0x1d, "す"],
        [0x1e, "せ"],
        [0x1f, "そ"],
        [0x20, "た"],
        [0x21, "ち"],
        [0x22, "つ"],
        [0x23, "て"],
        [0x24, "と"],
        [0x25, "な"],
        [0x26, "に"],
        [0x27, "ぬ"],
        [0x28, "ね"],
        [0x29, "の"],
        [0x2a, "は"],
        [0x2b, "ひ"],
        [0x2c, "ふ"],
        [0x2d, "へ"],
        [0x2e, "ほ"],
        [0x2f, "ま"],
        [0x30, "み"],
        [0x31, "む"],
        [0x32, "め"],
        [0x33, "も"],
        [0x34, "や"],
        [0x35, "ゆ"],
        [0x36, "よ"],
        [0x37, "ら"],
        [0x38, "り"],
        [0x39, "る"],
        [0x3a, "れ"],
        [0x3b, "ろ"],
        [0x3c, "わ"],
        [0x3d, "ん"],
        [0x3e, "が"],
        [0x3f, "ぎ"],
        [0x40, "ぐ"],
        [0x41, "げ"],
        [0x42, "ご"],
        [0x43, "ざ"],
        [0x44, "じ"],
        [0x45, "ず"],
        [0x46, "ぜ"],
        [0x47, "ぞ"],
        [0x48, "だ"],
        [0x49, "ぢ"],
        [0x4a, "づ"],
        [0x4b, "で"],
        [0x4c, "ど"],
        [0x4d, "ば"],
        [0x4e, "び"],
        [0x4f, "ぶ"],
        [0x50, "べ"],
        [0x51, "ぼ"],
        [0x52, "ぱ"],
        [0x53, "ぴ"],
        [0x54, "ぷ"],
        [0x55, "ぺ"],
        [0x56, "ぽ"],
        [0x57, "ぁ"],
        [0x58, "ぃ"],
        [0x59, "ぅ"],
        [0x5a, "ぇ"],
        [0x5b, "ぉ"],
        [0x5c, "ゃ"],
        [0x5d, "ゅ"],
        [0x5e, "ょ"],
        [0x5f, "っ"],
        [0x60, "0"],
        [0x61, "1"],
        [0x62, "2"],
        [0x63, "3"],
        [0x64, "4"],
        [0x65, "5"],
        [0x66, "6"],
        [0x67, "7"],
        [0x68, "8"],
        [0x69, "9"],
        [0x6a, "+"],
        [0x6b, "-"],
        [0x6d, "/"],
        [0x6e, "!"],
        [0x6f, "?"],
        [0x70, " "],
        [0x77, "・"],
        [0x78, "ー"]
    ]);

    const katakana = new Map([
        [0x10, "ヲ"],
        [0x11, "ア"],
        [0x12, "イ"],
        [0x13, "ウ"],
        [0x14, "エ"],
        [0x15, "オ"],
        [0x16, "カ"],
        [0x17, "キ"],
        [0x18, "ク"],
        [0x19, "ケ"],
        [0x1a, "コ"],
        [0x1b, "サ"],
        [0x1c, "シ"],
        [0x1d, "ス"],
        [0x1e, "セ"],
        [0x1f, "ソ"],
        [0x20, "タ"],
        [0x21, "チ"],
        [0x22, "ツ"],
        [0x23, "テ"],
        [0x24, "ト"],
        [0x25, "ナ"],
        [0x26, "ニ"],
        [0x27, "ヌ"],
        [0x28, "ネ"],
        [0x29, "ノ"],
        [0x2a, "ハ"],
        [0x2b, "ヒ"],
        [0x2c, "フ"],
        [0x2d, "ヘ"],
        [0x2e, "ホ"],
        [0x2f, "マ"],
        [0x30, "ミ"],
        [0x31, "ム"],
        [0x32, "メ"],
        [0x33, "モ"],
        [0x34, "ヤ"],
        [0x35, "ユ"],
        [0x36, "ヨ"],
        [0x37, "ラ"],
        [0x38, "リ"],
        [0x39, "ル"],
        [0x3a, "レ"],
        [0x3b, "ロ"],
        [0x3c, "ワ"],
        [0x3d, "ン"],
        [0x3e, "ガ"],
        [0x3f, "ギ"],
        [0x40, "グ"],
        [0x41, "ゲ"],
        [0x42, "ゴ"],
        [0x43, "ザ"],
        [0x44, "ジ"],
        [0x45, "ズ"],
        [0x46, "ゼ"],
        [0x47, "ゾ"],
        [0x48, "ダ"],
        [0x49, "ヂ"],
        [0x4a, "ヅ"],
        [0x4b, "デ"],
        [0x4c, "ド"],
        [0x4d, "バ"],
        [0x4e, "ビ"],
        [0x4f, "ブ"],
        [0x50, "ベ"],
        [0x51, "ボ"],
        [0x52, "パ"],
        [0x53, "ピ"],
        [0x54, "プ"],
        [0x55, "ペ"],
        [0x56, "ポ"],
        [0x57, "ァ"],
        [0x58, "ィ"],
        [0x59, "ゥ"],
        [0x5a, "ェ"],
        [0x5b, "ォ"],
        [0x5c, "ャ"],
        [0x5d, "ュ"],
        [0x5e, "ョ"],
        [0x5f, "ッ"],
        [0x70, " "],
        [0x78, "ー"]
    ]);

    const charmaps = new Map([
        [0x04, latin],
        [0x05, symbols],
        [0x0e, hiragana],
        [0x0f, katakana]
    ]);

    let name = "";
    let charmap;
    let odd = true;
    for (const byte of bytes) {
        if (byte === 0x00)
            break;
        if (odd)
            charmap = charmaps.get(byte);
        else
            name += charmap.get(byte);
        odd = !odd;
    }
    return name;
}
