/**
 * Generates the svg with data, places svg in html
 * @param colours
 * @param size
 * @param type
 * @param colourType
 */
function generateSVG(colours, size, type, colourType) {
    var element = "";
    var strokeWidth = 0;
    var high = getHigh(size);
    var points = getPoints();
    var colourArray = getColourHexArray();
    if (document.getElementById("strokeCheckbox").checked) strokeWidth = size[12];
    for (var i = 0; i < size[1]; i++) {
        for (var a = 0; a < size[0]; a++) {
            if (type === "rect") {
                element += generateRect(size, strokeWidth, i, a);
            } else if (type === "circle") {
                element += generateCircle(size, strokeWidth, i, a);
            } else if (type === "ellipse") {
                element += generateEllipse(size, strokeWidth, i, a);
            } else if (type === "line") {
                element += generateLine(size, high, i, a);
            } else if (type === "polyline" || type === "polygon") {
                element += generatePolylinePolygon(points[2], type);
            }
            if (strokeWidth !== 0) {
                element += 'stroke-width="' + size[12] + '" ';
                element += 'stroke="' + getColour(colours, colourArray, colourType) + '" fill="transparent" ';
            } else {
                element += 'fill="' + getColour(colours, colourArray, colourType) + '" ';
            }
            element += '></' + type + '>';
            points = preparePoints(points, "x");
        }
        points = preparePoints(points, "y");
    }
    generateSVGElement(size, strokeWidth, type, element, high, points);
    if (document.getElementById("backgroundCheckbox").checked) {
        document.getElementsByTagName("svg")[0].style.backgroundColor = getColour(colours, colourArray, colourType);
    }
}

/**
 * Generate a rect
 * @param size
 * @param strokeWidth
 * @param y
 * @param x
 * @returns {string}
 */
function generateRect(size, strokeWidth, y, x) {
    var element = "<rect ";
    element += 'x="' + ((x * (size[2] + strokeWidth)) + (strokeWidth / 2)) + '" ';
    element += 'y="' + ((y * (size[3] + strokeWidth)) + (strokeWidth / 2)) + '" ';
    element += 'width="' + size[2] + '" height="' + size[3] + '" ';
    if (size[6]) element += 'rx="' + size[6] + '" ';
    if (size[7]) element += 'ry="' + size[7] + '" ';
    return element;
}

/**
 * Generate a Circle
 * @param size
 * @param strokeWidth
 * @param y
 * @param x
 * @returns {string}
 */
function generateCircle(size, strokeWidth, y, x) {
    var element = "<circle ";
    element += 'cx="' + ((x * size[4]) + (size[4] / 2) + (x * strokeWidth) + (strokeWidth / 2)) + '" ';
    element += 'cy="' + ((y * size[5]) + (size[5] / 2) + (y * strokeWidth) + (strokeWidth / 2)) + '" ';
    element += 'r="' + size[6] + '" ';
    return element;
}

/**
 * Generate a Ellipse
 * @param size
 * @param strokeWidth
 * @param y
 * @param x
 * @returns {string}
 */
function generateEllipse(size, strokeWidth, y, x) {
    var element = "<ellipse ";
    element += 'cx="' + ((x * size[4]) + (size[4] / 2) + (x * strokeWidth) + (strokeWidth / 2)) + '" ';
    element += 'cy="' + ((y * size[5]) + (size[5] / 2) + (y * strokeWidth) + (strokeWidth / 2)) + '" ';
    element += 'rx="' + size[6] + '" ry="' + size[7] + '" ';
    return element;
}

/**
 * Generate a Line
 * @param size
 * @param high
 * @param y
 * @param x
 * @returns {string}
 */
function generateLine(size, high, y, x) {
    var element = "<line ";
    element += 'x1="' + ((x * high[0]) + size[8]) + '" x2="' + ((x * high[0]) + size[10]) + '" ';
    element += 'y1="' + ((y * high[1]) + size[9]) + '" y2="' + ((y * high[1]) + size[11]) + '" ';
    return element;
}

/**
 * Generate a Polyline or a Polygon
 * @param points
 * @param type
 * @returns {string}
 */
function generatePolylinePolygon(points, type) {
    var element = "<" + type + " ";
    element += 'points="' + points + '" ';
    return element;
}

/**
 * Generate the SVG
 * @param size
 * @param strokeWidth
 * @param type
 * @param high
 * @param element
 * @param points
 * @returns {string}
 */
function generateSVGElement(size, strokeWidth, type, high, element, points) {
    var SVG = '<svg width="100%" heigth="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ';
    if (type === "circle" || type === "ellipse") {
        SVG += size[0] * (size[4] + strokeWidth) + " " + size[1] * (size[5] + strokeWidth);
    } else if (type === "line") {
        SVG += size[0] * (high[0] + strokeWidth) + " " + size[1] * (high[1] + strokeWidth);
    } else if (type === "polyline" || type === "polygon") {
        SVG += size[0] * points[3] + " " + size[1] * points[4];
    } else {
        SVG += size[0] * (size[2] + strokeWidth) + " " + size[1] * (size[3] + strokeWidth);
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
