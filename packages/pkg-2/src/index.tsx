import pkg3, { pkg3Start, pkg3End } from "@lerna-conductor/pkg-3";
export const pkg2Start = () => console.log("PKG_2 START");
export const pkg2End = () => console.log("PKG_2 END");
export default () => {
  console.log("PKG_2 START");
  pkg3Start();
  pkg3();
  pkg3End();
  console.log("PKG_2 END");
};
