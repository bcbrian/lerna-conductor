import { pkg2End, pkg2Start } from "@lerna-conductor/pkg-2";
export const pkg3Start = () => console.log("PKG_3 START");
export const pkg3End = () => console.log("PKG_3 END");
export default () => {
  console.log("PKG_3 START");
  pkg2Start();
  pkg2End();
  console.log("PKG_3 END");
};
