/**
 * When window loads:
 */
window.onload = function () {
    /**
     * On click: get data, check data, generate colour svg
     */
    document.getElementById("submitColour").onclick = function () {
        var colours = getData("colourInput");
        var size = getData("sizeInput");
        var type = getType(getData("checkbox"));
        if (validateColour(colours, "colour") && validateSizes(size, type)) {
            generateSVG(colours, size, type, "colour");
        }
    };

    /**
     * On click: get data, check data, generate grey svg
     */
    document.getElementById("submitGrey").onclick = function () {
        var colours = getData("greyInput");
        var size = getData("sizeInput");
        var type = getType(getData("checkbox"));
        if (validateColour(colours, "grey") && validateSizes(size, type)) {
            generateSVG(colours, size, type, "grey");
        }
    };

    /**
     * On click: get data, check data, generate svg with svg
     */
    document.getElementById("submitHex").onclick = function () {
        var size = getData("sizeInput");
        var type = getType(getData("checkbox"));
        if (validateSizes(size, type)) {
            generateSVG("", size, type, "hex");
        }
    };

    /**
     * On click: get data, check data, creates hex colour codes with data
     */
    document.getElementById("getHexColour").onclick = function () {
        var colours = getData("colourInput");
        var amount = getData("hexAmount");
        if (validateColour(colours, "Colour") && validateAmount(amount)) {
            generateHex(colours, amount[0], false);
        }
    };

    /**
     * On click: get data, check data, creates hex grey codes with data
     */
    document.getElementById("getHexGrey").onclick = function () {
        var colours = getData("GreyInput");
        var amount = getData("hexAmount");
        if (validateColour(colours, "grey") && validateAmount(amount)) {
            generateHex(colours, amount[0], true);
        }
    };

    /**
     * On click: get data, check data, creates points with given width of rect
     */
    document.getElementById("getPoint").onclick = function () {
        var size = getData("rectInput");
        var amount = getData("pointAmount");
        if (validateSizes(size, "") && validateAmount(amount)) {
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
     * Copy the base64 of the svg
     */
    document.getElementById("copybase64").onclick = function () {
        getDataInClipboard("svgbase64");
        alert("You copied the base64 of the svg");
    };

    /**
     * Copy the html of the svg
     */
    document.getElementById("copyhtml").onclick = function () {
        getDataInClipboard("svghtml");
        alert("You copied the html of the svg");
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
                if (elements[0].checked && !elements[1].checked) fill = true;
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
        };
    }
};

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
 * @param element
 * @param high
 * @param points
 * @returns {string}
 */
function generateSVGElement(size, strokeWidth, type, element, high, points) {
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
    placeSVG(SVG);
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
        for (var a = 0; a < 2; a++) {
            points += Math.floor(Math.random() * size[a]) + 1;
            points += " ";
        }
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
 * Places the SVG in the html and changes some elements
 * @param SVG
 */
function placeSVG(SVG) {
    document.getElementById("svg").style.visibility = "visible";
    document.getElementById("svg").style.marginBottom = "-25px";
    document.getElementById("svgbase64").innerHTML = btoa(SVG);
    document.getElementById("svghtml").innerHTML = SVG;
    document.getElementById("svgDump").innerHTML = SVG;
}

/**
 * Checks if the colours are filled in correctly
 * @param colours
 * @param type
 * @return {boolean}
 */
function validateColour(colours, type) {
    if (type === "colour") {
        if (colours.length !== 6 || colours[0] < colours[3] || colours[1] < colours[4]
            || colours[2] < colours[5]) return false;
    } else if (type === "grey") {
        if (colours.length !== 2 || colours[0] < colours[1]) return false;
    }
    return true;
}

/**
 * Checks if the amounts are filled in correctly
 * @param amount
 * @returns {boolean}
 */
function validateAmount(amount) {
    if (amount.length !== 1 || amount[0] < 1 || amount[0] > 128) return false;
    return true;
}

/**
 * Checks if the sizes are filled in correctly
 * @param size
 * @param type
 * @returns {boolean}
 */
function validateSizes(size, type) {
    if (validateSize(size[0]) || validateSize(size[1])) return false;
    if (type === "rect") {
        if (validateSize(size[2]) || validateSize(size[3])) return false;
    } else if (type === "circle") {
        if (validateSize(size[4]) || validateSize(size[5]) || validateSize(size[6])) return false;
    } else if (type === "ellipse") {
        if (validateSize(size[4]) || validateSize(size[5]) || validateSize(size[6]) || validateSize(size[7])) return false;
    } else if (type === "line") {
        if (validateSize(size[8]) || validateSize(size[9]) || validateSize(size[10]) || validateSize(size[11])) return false;
    } else if (type === "polyline" || type === "polygon") {
        if (document.getElementById("pointCollection").value.split(" ") < 2) return false;
    }
    if (document.getElementById("strokeCheckbox").checked && validateSize(size[12])) return false;
    return true;
}

/**
 * Checks 1 size, this makes the validate function a lot cleaner
 * @param size
 * @returns {boolean}
 */
function validateSize(size) {
    if (!size || size < 1 || size > 512) return true;
    return false;
}

/**
 * gets the high value for the lines
 * @param size
 * @returns {[*,*]}
 */
function getHigh(size) {
    var high = [size[8], size[9]];
    if (high[0] < size[10]) high[0] = size[10];
    if (high[1] < size[11]) high[1] = size[11];
    return high;
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
 * @param checkbox
 * @returns {*}
 */
function getType(checkbox) {
    if (checkbox.length === 8) {
        if (checkbox[2]) {
            return "rect";
        } else if (checkbox[3]) {
            return "circle";
        } else if (checkbox[4]) {
            return "ellipse";
        } else if (checkbox[5]) {
            return "line";
        } else if (checkbox[6]) {
            return "polyline";
        } else if (checkbox[7]) {
            return "polygon";
        }
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
 * @param colours
 * @param colourArray
 * @param colourType
 * @returns {string}
 */
function getColour(colours, colourArray, colourType) {
    if (colourType === "grey") {
        return generateRandomGrey(colours);
    } else if (colourType === "hex") {
        return generateRandomColourWithHexArray(colourArray);
    } else {
        return generateRandomColour(colours);
    }
}

/**
 * Places the data of an textarea in your clipboard
 * @param classname
 */
function getDataInClipboard(classname) {
    var temp = document.createElement("INPUT");
    document.getElementsByTagName("body")[0].appendChild(temp);
    temp.value = document.getElementById(classname).innerHTML;
    temp.select();
    document.execCommand("copy");
    temp.remove();
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
