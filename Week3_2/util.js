const utils = {
    randomBetween:function(low, high, decMult = 100) {
        let diff = (high + 1) - low;
		return low + Math.round(decMult * Math.random()) % diff;
    },
    classes: [
        "still",
        "rotate",
        "shrink"
    ]
}

module.exports = utils;