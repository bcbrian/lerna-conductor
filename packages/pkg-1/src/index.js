"use strict";
exports.__esModule = true;
exports.pkg1End = exports.pkg1Start = void 0;
var pkg_2_1 = require("@lerna-conductor/pkg-2");
var pkg1Start = function () { return console.log("PKG_1 START"); };
exports.pkg1Start = pkg1Start;
var pkg1End = function () { return console.log("PKG_1 END"); };
exports.pkg1End = pkg1End;
exports["default"] = (function () {
    console.log("PKG_1 START");
    pkg_2_1["default"]();
    console.log("PKG_1 END");
});
