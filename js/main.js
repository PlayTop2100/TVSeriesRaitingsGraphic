window.onload = function () {
    document.getElementById("button").onclick = function (evt) {
        getData();
    }
}

function getData() {
    document.getElementById("title").innerHTML = "LOADING.";
    let id = document.getElementById("imdbid").innerHTML;
    let numSeasons = getSeasons(id);
    let numEpisodes = new Array(numSeasons);
    let raitings = new Array(numEpisodes);
    let table = document.querySelector("table");
    table.innerHTML = "";
    let longestSeason = 0;
    let title = getTitle(id);
    let showRaiting = getShowRaiting(id);

    for (let i = 1; i <= numSeasons; i++) {
        numEpisodes[i - 1] = getEpisodes(id, i);
        if (parseInt(numEpisodes[i - 1]) > longestSeason)
            longestSeason = numEpisodes[i - 1];
        raitings[i - 1] = new Array(parseInt(numEpisodes[i - 1]));
        getRaitings(id, i, raitings[i - 1]);
    }

    createTable(table, raitings, longestSeason);

    document.getElementById("title").innerHTML = title + " " + showRaiting + "/10";
}

function getSeasons(i) {
    let domparser = new DOMParser();
    let xhttp = new XMLHttpRequest();
    let result = 0;
    let resultNum = 0;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let doc = domparser.parseFromString(this.response, "text/html");
            result = doc.querySelector("#bySeason").childElementCount;
            resultNum = parseInt(result);
            if (resultNum != parseInt(doc.querySelector("#bySeason > option:nth-child(" + result + ")").value)) {
                resultNum--;
            }
        }
    };
    xhttp.open("GET", "https://www.imdb.com/title/" + i + "/episodes?season=1", false);
    xhttp.send();
    return resultNum;
}

function getEpisodes(i, s) {
    let domparser = new DOMParser();
    let xhttp = new XMLHttpRequest();
    let result = "ERROR";
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let doc = domparser.parseFromString(this.response, "text/html");
            result = doc.querySelector("#episodes_content > div.clear > meta").content;
        }
    };
    xhttp.open("GET", "https://www.imdb.com/title/" + i + "/episodes?season=" + s, false);
    xhttp.send();
    return result;
}

function getRaitings(i, s, r) {
    let domparser = new DOMParser();
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let doc = domparser.parseFromString(this.response, "text/html");
            for (let j = 0; j < r.length; j++) {
                try {
                    r[j] = doc.querySelector("#episodes_content > div.clear > div.list.detail.eplist > div:nth-child(" + (j + 1) + ") > div.info > div.ipl-rating-widget > div.ipl-rating-star.small > span.ipl-rating-star__rating").innerHTML;
                } catch (err) {
                    r[j] = -1;//doc.querySelector("#episodes_content > div.clear > div.list.detail.eplist > div:nth-child(" + (j + 1) + ") > div.info > div.ipl-rating-widget > div.ipl-rating-star.small > span.ipl-rating-star__rating")
                }

            }
        }
    };
    xhttp.open("GET", "https://www.imdb.com/title/" + i + "/episodes?season=" + s, false);
    xhttp.send();
}

function getTitle(i) {
    let domparser = new DOMParser();
    let xhttp = new XMLHttpRequest();
    let result = "ERROR";
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let doc = domparser.parseFromString(this.response, "text/html");
            result = doc.querySelector("#main > div.article.listo.list > div.subpage_title_block > div > div > h3 > a").innerHTML;
        }
    };
    xhttp.open("GET", "https://www.imdb.com/title/" + i + "/episodes?season=1", false);
    xhttp.send();
    return result;
}

function getShowRaiting(i) {
    let domparser = new DOMParser();
    let xhttp = new XMLHttpRequest();
    let result = "ERROR";
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let doc = domparser.parseFromString(this.response, "text/html");
            result = doc.querySelector("#title-overview-widget > div.vital > div.title_block > div > div.ratings_wrapper > div.imdbRating > div.ratingValue > strong > span").innerHTML;
        }
    };
    xhttp.open("GET", "https://www.imdb.com/title/" + i + "/", false);
    xhttp.send();
    return result;
}

function createTable(t, r, l) {
    let green = 8.5;
    let yellow = 7.5;
    let orange = 6.5;

    let rowS = t.insertRow();
    let cell = rowS.insertCell();
    for (let c = 0; c < r.length; c++) {
        let cellS = rowS.insertCell();
        let text = document.createTextNode(c+1);
        cellS.appendChild(text);
        cellS.id = "Blk";
        cellS.style = "text-align:center";
    }

    for (let c = 0; c < l; c++) {
        let row = t.insertRow();
        let cellE = row.insertCell();
        let text = document.createTextNode(c + 1);
        cellE.appendChild(text);
        cellE.id = "Blk";
        cellE.style = "text-align:center";
        for (let rw = 0; rw < r.length; rw++) {
            if (r[rw].length > c && parseFloat(r[rw][c]) >= 0) {
                let cell = row.insertCell(rw+1);
                let text = document.createTextNode(r[rw][c]);
                cell.appendChild(text);
                cell.style = "text-align:center";
                if (r[rw][c] >= green) {
                    cell.id = "Grn";
                } else if (r[rw][c] >= yellow) {
                    cell.id = "Ylo";
                } else if (r[rw][c] >= orange) {
                    cell.id = "Org";
                }
                else {
                    cell.id = "Red";
                }
            }
            else {
                let cell = row.insertCell(rw+1);
                cell.id = "blnk";
            }
        }
    }
}
