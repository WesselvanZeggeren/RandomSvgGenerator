/**
 * Binds events on load
 */
window.onload = function () {

    /**
     * On click: get data, check data, generate colour svg
     */
    document.getElementById("submitColour").onclick = function () {
        var colours = getData("colourInput");
        var size = getData("sizeInput");
        var type = getType(getData("checkbox"));
        if (validateData("colour", colours, size, "", type[0])) {
            generateSVG(colours, size, false, false, type);
        }
    };

    /**
     * On click: get data, check data, generate grey svg
     */
    document.getElementById("submitGrey").onclick = function () {
        var colours = getData("greyInput");
        var size = getData("sizeInput");
        var type = getType(getData("checkbox"));
        if (validateData("grey", colours, size, "", type[0])) {
            generateSVG(colours, size, true, false, type);
        }
    };

    /**
     * On click: get data, check data, generate svg with svg
     */
    document.getElementById("submitHex").onclick = function () {
        var size = getData("sizeInput");
        var type = getType(getData("checkbox"));
        if (validateData("hex", "", size, "", type[0])) {
            generateSVG("", size, false, true, type);
        }
    };

    /**
     * On click: get data, check data, creates hex colour codes with data
     */
    document.getElementById("getHexColour").onclick = function () {
        var colours = getData("colourInput");
        var amount = getData("hexAmount");
        if (validateData("hexColour", colours, "", amount, "")) {
            generateHex(colours, amount[0], false);
        }
    };

    /**
     * On click: get data, check data, creates hex grey codes with data
     */
    document.getElementById("getHexGrey").onclick = function () {
        var colours = getData("GreyInput");
        var amount = getData("hexAmount");
        if (validateData("hexGrey", colours, "", amount, "")) {
            generateHex(colours, amount[0], true);
        }
    };

    /**
     * On click: get data, check data, creates points with given width of rect
     */
    document.getElementById("getPoint").onclick = function () {
        var size = getData("rectInput");
        var amount = getData("pointAmount");
        if (validateData("points", "", size, amount, "")) {
            console.log("");
            generatePoint(size, amount[0]);
        }
    };

    /**
     * On click: gets result data and adds it to the collection
     */
    document.getElementById("addToCollection").onclick = function () {
        document.getElementById("hexCollection").value += document.getElementById("hexResult").innerHTML;
        document.getElementById("hexResult").innerHTML = "";
    };

    /**
     * On click: gets result data and replaces the collection with it
     */
    document.getElementById("replaceCollection").onclick = function () {
        document.getElementById("hexCollection").value = document.getElementById("hexResult").innerHTML;
        document.getElementById("hexResult").innerHTML = "";
    };

    /**
     * On click: hides and shows the advanced settings
     */
    document.getElementById("openAdvancedSettings").onclick = function () {
        var speed = 0;
        var visibility = "hidden";
        var settings = document.getElementsByClassName("advancedSettings");
        document.getElementById("size").style.marginBottom = "-175px";
        if (settings[0].style.visibility === "hidden") {
            speed = 500;
            visibility = "visible";
            document.getElementById("size").style.marginBottom = "0";
        }
        setTimeout(function () {
            for (var i = 0; i < settings.length; i++) {
                settings[i].style.visibility = visibility;
            }
        }, speed);
    };

    /**
     * Loops and sets all the checkbox clicks. On click: checks the correct boxes
     * @type {NodeList}
     */
    var elements = document.getElementsByClassName("checkbox");
    var fill = false;
    for (var i = 0; i < elements.length; i++) {
        elements[i].onclick = function (e) {
            if (e.target.id !== "fillCheckbox" && e.target.id !== "strokeCheckbox") {
                for (var a = 2; a < (elements.length); a++) {
                    elements[a].checked = false;
                }
                e.target.checked = true;
            }
            if (document.getElementById("lineCheckbox").checked || document.getElementById("polylineCheckbox").checked) {
                if (elements[0].checked) fill = true;
                elements[0].checked = false;
                elements[1].checked = true;
            } else if (e.target.id === "fillCheckbox" || e.target.id === "strokeCheckbox") {
                elements[0].checked = false;
                elements[1].checked = false;
                e.target.checked = true;
            } else if (fill) {
                elements[0].checked = true;
                elements[1].checked = false;
                fill = false;
            }
        }
    }
};

/**
 * Generates the svg with data, places svg in html
 * @param colours
 * @param size
 * @param grey
 * @param hex
 * @param type
 */
function generateSVG(colours, size, grey, hex, type) {
    var sw = 0;
    var element = "";
    var points = getPoints();
    var high = prepareHigh(size);
    var colourArray = getColourHexArray();
    if (!type[1]) sw = size[12];
    for (var i = 0; i < size[1]; i++) {
        for (var a = 0; a < size[0]; a++) {
            element += '<' + type[0] + ' ';
            if (type[0] === "circle" || type[0] === "ellipse") {
                element += 'cx="' + ((a * size[4]) + (size[4] / 2) + (a * sw) + (sw / 2)) + '" ';
                element += 'cy="' + ((i * size[5]) + (size[5] / 2) + (i * sw) + (sw / 2)) + '" ';
                if (type[0] === "circle") {
                    element += 'r="' + size[6] + '" ';
                } else {
                    element += 'rx="' + size[6] + '" ry="' + size[7] + '" ';
                }
            } else if (type[0] === "line") {
                element += 'x1="' + ((a * high[0]) + size[8]) + '" x2="' + ((a * high[0]) + size[10]) + '" ';
                element += 'y1="' + ((i * high[1]) + size[9]) + '" y2="' + ((i * high[1]) + size[11]) + '" ';
            } else if (type[0] === "polyline" || type[0] === "polygon") {
                element += 'points="' + points[2] + '" ';
            } else {
                element += 'x="' + ((a * (size[2] + sw)) + (sw / 2)) + '" ';
                element += 'y="' + ((i * (size[3] + sw)) + (sw / 2)) + '" ';
                element += 'width="' + size[2] + '" height="' + size[3] + '" ';
            }
            if (type[0] === "rect" && size[6]) element += 'rx="' + size[6] + '" ';
            if (type[0] === "rect" && size[7]) element += 'ry="' + size[7] + '" ';
            if (!type[1]) {
                element += 'stroke-width="' + size[12] + '" stroke="' + getColour(grey, colours, hex, colourArray) + '" fill="transparent" ';
            } else {
                element += 'fill="' + getColour(grey, colours, hex, colourArray) + '" ';
            }
            element += '></' + type[0] + '>';
            points = preparePoints(points, "x");
        }
        points = preparePoints(points, "y");
    }
    var SVG = '<svg width="100%" heigth="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ';
    if (type[0] === "circle" || type[0] === "ellipse") {
        SVG += size[0] * (size[4] + sw) + " " + size[1] * (size[5] + sw);
    } else if (type[0] === "line") {
        SVG += size[0] * (high[0] + sw) + " " + size[1] * (high[1] + sw);
    } else if (type[0] === "polyline" || type[0] === "polygon") {
        SVG += size[0] * points[3] + " " + size[1] * points[4];
    } else {
        SVG += size[0] * (size[2] + sw) + " " + size[1] * (size[3] + sw);
    }
    SVG += '" >' + element + '</svg>';
    document.getElementById("sgvDump").innerHTML = SVG;
    if (document.getElementById("backgroundCheckbox").checked) {
        document.getElementsByTagName("svg")[0].style.backgroundColor = getColour(grey, colours, hex, colourArray);
    }
}

/**
 * Generates the hex codes with data, places hex in #hexResult
 * @param colours
 * @param amount
 * @param grey
 */
function generateHex(colours, amount, grey) {
    var hexCollection = "";
    for (var i = 0; i < amount; i++) {
        if (!grey) {
            hexCollection += generateRandomColour(colours) + ":";
        } else {
            hexCollection += generateRandomGrey(colours) + ":";
        }
    }
    document.getElementById("hexResult").innerHTML = hexCollection;
}

/**
 * Generates the polygon points, places points in #pointCollection
 * @param size
 * @param amount
 */
function generatePoint(size, amount) {
    var points = "";
    for (var i = 0; i < amount; i++) {
        points += generateRandomPoint(size) + " ";
    }
    document.getElementById("pointCollection").value = points;
}

/**
 * Generates random colour with data
 * @param colours
 * @returns {string}
 */
function generateRandomColour(colours) {
    var randomColoursArray = [];
    for (var i = 0; i < 3; i++) {
        var minimal = colours[i] - colours[i + 3];
        var oneColor = Math.floor((Math.random() * minimal) + colours[i + 3]);
        var oneHexColor = oneColor.toString(16);
        if (oneHexColor.length === 1) {
            oneHexColor = "0" + oneHexColor;
        }
        randomColoursArray.push(oneHexColor);
    }
    return "#" + randomColoursArray[0] + randomColoursArray[1] + randomColoursArray[2];
}

/**
 * Generates random grey with data
 * @param colours
 * @returns {string}
 */
function generateRandomGrey(colours) {
    var minimal = colours[0] - colours[1];
    var oneColor = Math.floor((Math.random() * minimal) + colours[1]);
    var oneHexColor = oneColor.toString(16);
    if (oneHexColor.length === 1) {
        oneHexColor = "0" + oneHexColor;
    }
    return "#" + oneHexColor + oneHexColor + oneHexColor;
}

/**
 * Picks random hex from colourArray and returns it
 * @param colourArray
 * @returns {*}
 */
function generateRandomColourWithHexArray(colourArray) {
    var number = Math.floor(Math.random() * colourArray.length);
    return colourArray[number];
}

/**
 * Generates random point between X Y
 * @param size
 * @returns {string}
 */
function generateRandomPoint(size) {
    var point = "";
    for (var i = 0; i < 2; i++) {
        point += Math.floor(Math.random() * size[i]) + 1;
        if (i === 0) point += " ";
    }
    return point;
}

/**
 * prepares the high value for the lines
 * @param size
 * @returns {[*,*]}
 */
function prepareHigh(size) {
    var high = [size[8], size[9]];
    if (high[0] < size[10]) high[0] = size[10];
    if (high[1] < size[11]) high[1] = size[11];
    return high;
}

/**
 * prepares the points array every time it loops for correct placement
 * @param points
 * @param xy
 * @returns {*}
 */
function preparePoints(points, xy) {
    points[2] = "";
    for (var i = 0; i < points[0].length; i++) {
        if (xy === "x") {
            points[0][i] = parseInt(points[0][i]) + parseInt(points[3]);
        } else if (xy === "y") {
            points[0][i] = points[1][i];
            points[0][i + 1] = parseInt(points[0][i + 1]) + parseInt(points[4]);
        }
        points[2] += points[0][i] + " " + points[0][i + 1] + " ";
        i++;
    }
    return points;
}

/**
 * Checks if all the data is valid and filled in
 * @param type
 * @param colours
 * @param size
 * @param amount
 * @param element
 * @returns {boolean}
 */
function validateData(type, colours, size, amount, element) {
    if (type === "colour" || type === "grey" || type === "hex") {
        if (!size[0] || !size[1] || size[0] < 1 || size[0] > 512 || size[1] < 1 || size[1] > 512) return false;
    } else if (type === "hexColour" || type === "hexGrey" || type === "points") {
        if (amount.length !== 1 || amount[0] < 1 || amount[0] > 128) return false;
    }
    if (type === "colour" || type === "hexColour") {
        if (colours.length !== 6 || colours[0] < colours[3] || colours[1] < colours[4]
            || colours[2] < colours[5]) return false;
    } else if (type === "grey" || type === "hexGrey") {
        if (colours.length !== 2 || colours[0] < colours[1]) return false;
    } else if (type === "points") {
        if (!size[0] || !size[1] || size[0] < 1 || size[0] > 512 || size[1] < 1 || size[1] > 512) return false;
    }
    if (element === "rect") {
        if (!size[2] || !size[3] || size[2] < 1 || size[2] > 512 || size[3] < 1 || size[3] > 512) return false;
    } else if (element === "circle") {
        if (!size[4] || !size[5] || !size[6] || size[4] < 1 || size[4] > 512 || size[5] < 1 || size[5] > 512
            || size[6] < 0 || size[6] > 512) return false;
    } else if (element === "ellipse") {
        if (!size[4] || !size[5] || !size[6] || !size[7] || size[4] < 1 || size[4] > 512 || size[5] < 1
            || size[5] > 512 || size[6] < 0 || size[6] > 512 || size[7] < 0 || size[7] > 512) return false;
    } else if (element === "line") {
        if (!size[8] || !size[9] || !size[10] || !size[11] || size[8] < 0 || size[8] > 512 || size[9] < 0
            || size[9] > 512 || size[10] < 0 || size[10] > 512 || size[11] < 0 || size[11] > 512) return false;
    } else if (element === "polyline") {
        if (document.getElementById("pointCollection").value.split(" ") < 2) return false;
    } else if (element === "polygon") {
        if (document.getElementById("pointCollection").value.split(" ") < 2) return false;
    }
    if (document.getElementById("strokeCheckbox").checked &&
        type !== "points" && type !== "hexColour" && type !== "hexGrey") {
        if (!size[12] || size[12] < 1 || size[12] > 1024) return false;
    }
    return true;
}

/**
 * Prepares the colourArray
 * @returns {Array}
 */
function getColourHexArray() {
    var colourArray = document.getElementById("hexCollection").value.split(':');
    if (colourArray[colourArray.length - 1] === "") {
        colourArray.pop();
    }
    return colourArray;
}

/**
 * Gets the correct type
 * @param array
 * @returns {*}
 */
function getType(array) {
    var fill = true;
    if (array[1]) fill = false;
    if (array[2]) {
        return ["rect", fill];
    } else if (array[3]) {
        return ["circle", fill];
    } else if (array[4]) {
        return ["ellipse", fill];
    } else if (array[5]) {
        return ["line", fill];
    } else if (array[6]) {
        return ["polyline", fill];
    } else if (array[7]) {
        return ["polygon", fill];
    }
    return false;
}

/**
 * Get the points and builds it up (needs to hold a lot of numbers)
 * @returns {[*, *, *,number,number]}
 */
function getPoints() {
    var points = [null, null, document.getElementById("pointCollection").value, 0, 0];
    for (var a = 0; a < 2; a++) {
        points[a] = points[2].split(" ");
        if (points[a][points[a].length - 1] === "") points[a].pop();
        for (var b = 0; b < points[a].length; b++) {
            points[a][b] = parseInt(points[a][b]);
        }
    }
    for (var c = 0; c < 2; c++) {
        for (var d = c; d < points[0].length; d++) {
            if (points[0][d] > points[c + 3]) points[c + 3] = points[0][d];
            ++d;
        }
    }
    return points;
}

/**
 * Gets the correct random colour
 * @param grey
 * @param colours
 * @param hex
 * @param colourArray
 * @returns {string}
 */
function getColour(grey, colours, hex, colourArray) {
    if (grey) {
        return generateRandomGrey(colours);
    } else if (hex) {
        return generateRandomColourWithHexArray(colourArray);
    } else {
        return generateRandomColour(colours);
    }
}

/**
 * Gets data from inputs with class
 * @param classname
 * @returns {Array}
 */
function getData(classname) {
    var elements = document.getElementsByClassName(classname);
    var data = [];
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.value === "on") {
            data.push(element.checked);
        } else {
            data.push(parseInt(element.value));
        }
    }
    return data;
}
