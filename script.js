const MS = 5000;
const btn = document.getElementById("btn_sort-by-distance");
let intervalId = 0;
let isClicked = false;

window.onload = () => {
    const loadingScreen = document.getElementById("loading-screen");
    const airplanes = document.getElementById("airplanes");
    const loadingScreenClass = loadingScreen.getAttribute("class");
    loadingScreen.className = loadingScreenClass.replace(/none/, '');
    loadData();
    setTimeout(() => {
        loadingScreen.setAttribute("class", "none");
        airplanes.className = "";
        setIntervalForLoadingData();
    }, MS);
};

btn.addEventListener('click', () => {
    clearInterval(intervalId);
    isClicked = !isClicked;
    loadData();
    setIntervalForLoadingData();
});

getData = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    }
    catch (error) {
        console.log(`ERROR: ${error.stack}`);
    }
};

loadData = () => {
    const url = "https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=56.84,55.27,33.48,41.48";
    getData(url).then(json => {
        const response = Object.assign({}, json);
        delete response.full_count;
        delete response.version;
        const arrPlanes = Object.values(response);
        sortByDistance(arrPlanes);
        addToTable(arrPlanes);
    })
};

setIntervalForLoadingData = () => {
    intervalId = setInterval(loadData, MS);
};

getDistance = (lat1, lon1, lat2, lon2) => {
    const RadEarth = 6371;
    const dLat = toRad(lat2-lat1);
    const dLon = toRad(lon2-lon1);
    const latitude1 = toRad(lat1);
    const latitude2 = toRad(lat2);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(latitude1) * Math.cos(latitude2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return RadEarth * c;
};

toRad = value => value * Math.PI / 180;

createTdArray = (data, tr) => {
    return data.map((currentValue, index) => {
        const td = document.createElement("td");
        const currentTd = [...tr.children].length && [...tr.children]
            .find(td => Number(td.getAttribute('id')) === index);
        if (currentTd && Number(currentTd.innerText) !== currentValue) {
            currentTd.innerText = currentValue;
        } else {
            td.setAttribute("id", index);
            td.setAttribute("class", "table__td");
            td.innerText = currentValue;
        }
        return currentTd || td;
    });
};

sortByDistance = array => {
    const latAirport = "55.410307";
    const lonAirport = "37.902451";
    return array.sort((a, b) => {
        const [ , latA, lonA ] = a;
        const [ , latB, lonB ] = b;
        if (isClicked) {
            return getDistance(latA, lonA, latAirport, lonAirport) - getDistance(latB, lonB, latAirport, lonAirport);
        } else {
            return getDistance(latB, lonB, latAirport, lonAirport) - getDistance(latA, lonA, latAirport, lonAirport);
        }
    });
};

addToTable = array => {
    const tbody = document.getElementById("tbody");
    for (let elem of array) {
        const [
            id,
            latitude,
            longitude,
            track,
            altitude,
            speed,
            , , , , ,
            codeAirportOut,
            codeAirPortIn,
            flightNumber,
        ] = elem;
        const tdData = [
            `${latitude}, ${longitude}`,
            speed,
            track,
            altitude,
            `${codeAirportOut}, ${codeAirPortIn}`,
            flightNumber,
        ];
        const tr = document.createElement("tr");
        tr.setAttribute("id", id);
        tr.setAttribute("class", "table__tr");
        const hasTheSameTr = [...tbody.children].find(el => el.getAttribute("id") === id);
        const tableRow = hasTheSameTr || tr;
        const arrayTd = createTdArray(tdData, tableRow);
        arrayTd.map(elem => tableRow.appendChild(elem));
        tbody.appendChild(tableRow);
    }
};
