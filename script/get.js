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
