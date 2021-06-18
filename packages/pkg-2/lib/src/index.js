import { pkg3Start, pkg3End } from "@lerna-conductor/pkg-3";
export var pkg2Start = function () { return console.log("PKG_2 START"); };
export var pkg2End = function () { return console.log("PKG_2 END"); };
export default (function () {
    console.log("PKG_2 START");
    pkg3Start();
    pkg3End();
    console.log("PKG_2 END");
});
