
document.getElementById("input").addEventListener("change", handleFiles, false);

function handleFiles(event) {
    const file = event.target.files[0];

    if (!file) {
        console.error("No file selected.");
        return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const byteArray = new Uint8Array(arrayBuffer);
        const playerID = byteArray.slice(0x10,0x20);
        //console.log(playerID);
        document.getElementById("playerID").textContent = playerID.toHex();
    };

    reader.readAsArrayBuffer(file);
}
