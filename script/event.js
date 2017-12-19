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
    if (validateSizes(size, "points") && validateAmount(amount)) {
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
