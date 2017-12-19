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
    if (type === "points") {
        if (validateSize(size[0]) || validateSize(size[1])) return false;
    } else if (type === "rect") {
        if (validateSize(size[2]) || validateSize(size[3])) return false;
    } else if (type === "circle") {
        if (validateSize(size[4]) || validateSize(size[5]) || validateSize(size[6])) return false;
    } else if (type === "ellipse") {
        if (validateSize(size[4]) || validateSize(size[5]) ||
            validateSize(size[6]) || validateSize(size[7])) return false;
    } else if (type === "line") {
        if (validateSize(size[8]) || validateSize(size[9]) ||
            validateSize(size[10]) || validateSize(size[11])) return false;
    } else if (type === "polyline" || type === "polygon") {
        if (document.getElementById("pointCollection").value.split(" ") < 2) return false;
    }
    if (document.getElementById("strokeCheckbox").checked && validateSize(size[12])) return false;
}

/**
 * Checks 1 size, this makes the validate function a lot cleaner
 * @param size
 * @returns {boolean}
 */
function validateSize(size) {
    if (!size && size < 1 && size > 512) return true;
    return false;
}

