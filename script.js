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
        if (validateData("colour", colours, size, "", type)) {
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
        if (validateData("grey", colours, size, "", type)) {
            generateSVG(colours, size, true, false, type);
        }
    };

    /**
     * On click: get data, check data, generate svg with svg
     */
    document.getElementById("submitHex").onclick = function () {
        var colours = document.getElementById("hexCollection").value;
        var size = getData("sizeInput");
        var type = getType(getData("checkbox"));
        if (validateData("hex", colours, size, "", type)) {
            generateSVG(colours, size, false, true, type);
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

    var elements = document.getElementsByClassName("checkbox");
    for (var i = 0; i < elements.length; i++) {
        elements[i].onclick = function (e) {
            for (var a = 0; a < elements.length; a++) {
                elements[a].checked = false;
            }
            e.target.checked = true;
        }
    }
};

/**
 * Generates the svg with data places svg in html
 * @param colours
 * @param size
 * @param grey
 * @param hex
 */
function generateSVG(colours, size, grey, hex, type) {
    var element = "";
    var points = getPoints();
    var colourArray = prepareColourHexArray(colours, hex);
    var high = prepareHigh(size);
    for (var i = 0; i < size[1]; i++) {
        for (var a = 0; a < size[0]; a++) {
            if (grey) {
                var randomColour = generateRandomGrey(colours);
            } else if (hex) {
                var randomColour = generateRandomColourWithHexArray(colourArray);
            } else {
                var randomColour = generateRandomColour(colours);
            }
            element += '<' + type + ' ';
            if (type === "circle" || type === "ellipse") {
                element += 'cx="' + ((i * size[4]) + (size[4] / 2)) + '" cy="' + ((a * size[5]) + (size[5] / 2)) + '" ';
                if (type === "circle") {
                    element += 'r="' + size[6] + '" ';
                } else {
                    element += 'rx="' + size[6] + '" ry="' + size[7] + '" ';
                }
            } else if (type === "line") {
                element += 'x1="' + ((a * high[0]) + size[8]) + '" x2="' + ((a * high[0]) + size[10]) + '" ';
                element += 'y1="' + ((i * high[1]) + size[9]) + '" y2="' + ((i * high[1]) + size[11]) + '" ';
            } else if (type === "polyline" || type === "polygon") {
                element += 'points="' + points[2] + '" ';
            } else {
                element += 'x="' + i * size[2] + '" y="' + a * size[3] + '" ';
                element += 'width="' + size[2] + '" height="' + size[3] + '" ';
            }
            if (type === "rect" && size[6]) element += 'rx="' + size[6] + '" ';
            if (type === "rect" && size[7]) element += 'ry="' + size[7] + '" ';
            if (type === "line" || type === "polyline" || size[2] && type === "polygon") {
                element += 'stroke-width="' + size[2] + '" stroke="' + randomColour + '" ';
            }
            if (type === "line" || type === "polyline") {
                element += 'fill="transparent" ';
            } else {
                element += 'fill="' + randomColour + '" ';
            }
            element += '></' + type + '>';
            points = preparePoints(points, "x");
        }
        points = preparePoints(points, "y");
    }
    var SVG = '<svg width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ';
    if (type === "circle" || type === "ellipse") {
        SVG += size[0] * size[4] + " " + size[1] * size[5];
    } else if (type === "line") {
        SVG += size[0] * high[0] + " " + size[1] * high[1];
    } else if (type === "polyline" || type === "polygon") {
        SVG += size[0] * points[3] + " " + size[1] * points[4];
    } else {
        SVG += size[0] * size[2] + " " + size[1] * size[3];
    }
    SVG += '" >' + element + '</svg>';
    document.getElementById("sgvDump").innerHTML = SVG;
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
 * Prepares the colourArray
 * @param colours
 * @param hex
 * @returns {Array}
 */
function prepareColourHexArray(colours, hex) {
    if (hex) {
        var colourArray = colours.split(':');
        if (colourArray[colourArray.length - 1] === "") {
            colourArray.pop();
        }
        return colourArray;
    }
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
            || size[6] < 1 || size[6] > 512) return false;
    } else if (element === "ellipse") {
        if (!size[4] || !size[5] || !size[6] || !size[7] || size[4] < 1 || size[4] > 512 || size[5] < 1
            || size[5] > 512 || size[6] < 1 || size[6] > 512 || size[7] < 1 || size[7] > 512) return false;
    } else if (element === "line") {
        if (!size[2] || !size[8] || !size[9] || !size[10] || !size[11] || size[2] < 1 || size[2] > 512
            || size[8] < 1 || size[8] > 512 || size[9] < 1 || size[9] > 512 || size[10] < 1 || size[10] > 512
            || size[11] < 1 || size[11] > 512) return false;
    } else if (element === "polyline") {
        if (document.getElementById("pointCollection").value.split(" ") < 2
            || !size[2] || size[2] < 1 || size[2] > 512) return false;
    } else if (element === "polygon") {
        if (document.getElementById("pointCollection").value.split(" ") < 2) return false;
    }
    return true;
}

/**
 * Gets the correct type
 * @param array
 * @returns {*}
 */
function getType(array) {
    if (array[0]) {
        return "rect";
    } else if (array[1]) {
        return "circle";
    } else if (array[2]) {
        return "ellipse";
    } else if (array[3]) {
        return "line";
    } else if (array[4]) {
        return "polyline";
    } else if (array[5]) {
        return "polygon";
    }
    return false;
}

/**
 * Get the points and its size
 * @returns {[*,number,number]}
 */
function getPoints() {
    var points = [null, null, document.getElementById("pointCollection").value, 0, 0];
    points[0] = points[2].split(" ");
    points[1] = points[2].split(" ");
    if (points[0][points[0].length - 1] === "") {
        points[0].pop();
        points[1].pop();
    }
    for (var i = 0; i < points[0].length; i++) {
        if (points[0][i] > points[3]) points[3] = points[0][i];
        i++;
    }
    for (var a = 1; a < points[0].length; a++) {
        if (points[0][a] > points[4]) points[4] = points[0][a];
        a++;
    }
    return points;
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
