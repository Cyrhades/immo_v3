frames['homeRoughEditor'].addEventListener('DOMContentLoaded', () => {

    document.querySelector("#saveHomeRough").addEventListener('click', () => {
        document.querySelector("#homeRoughData").textContent = frames['homeRoughEditor'].document.querySelector("#history").value;
    });

    document.querySelector("#openHomeRoughEditor").addEventListener('click', (e) => {
        frames['homeRoughEditor'].document.querySelector("#history").textContent = document.querySelector("#homeRoughData").value;
        frames['homeRoughEditor'].initHistory(); 
    });
});

