import { pkg2End, pkg2Start } from "@lerna-conductor/pkg-2";
export var pkg3Start = function () { return console.log("PKG_3 START"); };
export var pkg3End = function () { return console.log("PKG_3 END"); };
export default (function () {
    console.log("PKG_3 START");
    pkg2Start();
    pkg2End();
    console.log("PKG_3 END");
});
