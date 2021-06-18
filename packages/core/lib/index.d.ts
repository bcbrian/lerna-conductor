declare const execSync: any;
declare const chokidar: any;
declare const getPackages: any;
declare const PackageGraph: any;
declare const toposort: any;
declare const listable: any;
declare const output: any;
declare const getFilteredPackages: any;
declare let storedEvents: any;
declare let isStarting: boolean;
declare function debounce(cb: (...args: any) => any, duration: number): (...args: any[]) => void;
declare function getUniques(arr: any[]): any[];
declare const getPackageRoute: (storedEvent: any[]) => string;
declare function getNextDependent(dep: any, graph: any, list: Set<string>): void;
declare function getAllDependents(runningNames: any, graph: any): Set<string>;
declare function getNextDependencies(parent: any, graph: any, list: Set<string>): void;
declare function getAllDependencies(scope: any, graph: any): Set<string>;
declare const handleFileChange: (buildCommand: string, scope: string[], packageGraph: any, graph: any, pkgs: any, buildDeps: boolean) => (...args: any[]) => any;
declare const lernaConfig: any;
interface Package {
    name: string;
    dependencies: any;
}
