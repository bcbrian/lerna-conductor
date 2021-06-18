import pkg2Start from "@lerna-conductor/pkg-2";
export const pkg1Start = () => console.log("PKG_1 START");
export const pkg1End = () => console.log("PKG_1 END");
export default () => {
    console.log("PKG_1 START");
    pkg2Start();
    console.log("PKG_1 END");
}
