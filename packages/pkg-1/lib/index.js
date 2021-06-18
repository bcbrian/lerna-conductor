import pkg2Start from "@lerna-conductor/pkg-2";
export var pkg1Start = function () { return console.log("PKG_1 START"); };
export var pkg1End = function () { return console.log("PKG_1 END"); };
export default (function () {
    console.log("PKG_1 START");
    pkg2Start();
    console.log("PKG_1 END");
});
