"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { execSync } = require("child_process");
const chokidar = require("chokidar");
const { getPackages } = require("@lerna/project");
const { PackageGraph } = require("@lerna/package-graph");
const { toposort } = require("@lerna/query-graph");
const listable = require("@lerna/listable");
const { output } = require("@lerna/output");
const { getFilteredPackages } = require("@lerna/filter-options");
let storedEvents = [];
let isStarting = true;
function debounce(cb, duration) {
    let timer;
    return (...args) => {
        storedEvents.push(args);
        clearTimeout(timer);
        timer = setTimeout(() => {
            cb(...args);
        }, duration);
    };
}
function getUniques(arr) {
    return [...new Set(arr)];
}
const getPackageRoute = (storedEvent) => {
    const route = storedEvent[1].split("/");
    return `${route[0]}/${route[1]}`;
};
function getNextDependent(dep, graph, list) {
    //get the dep
    const current = graph.get(dep);
    current.localDependents.forEach((p) => {
        if (!list.has(p.name)) {
            // add it to the list
            list.add(p.name);
            // get its deps
            getNextDependent(p.name, graph, list);
        }
    });
}
function getAllDependents(runningNames, graph) {
    const dependents = new Set(runningNames);
    for (let i = 0; i < runningNames.length; i++) {
        // looping through known changed areas
        const dep = runningNames[i];
        getNextDependent(dep, graph, dependents);
    }
    return dependents;
}
function getNextDependencies(parent, graph, list) {
    //get the dep
    const current = graph.get(parent);
    current.localDependencies.forEach((p) => {
        if (!list.has(p.name)) {
            // add it to the list
            list.add(p.name);
            // get its dependencies
            getNextDependencies(p.name, graph, list);
        }
    });
}
function getAllDependencies(scope, graph) {
    const dependencies = new Set(scope);
    for (let i = 0; i < scope.length; i++) {
        // looping through known changed areas
        const parent = scope[i];
        getNextDependencies(parent, graph, dependencies);
    }
    return dependencies;
}
// args comes from the debounce function
const handleFileChange = (buildCommand, scope, packageGraph, graph, pkgs, buildDeps) => (...args) => {
    if (isStarting) {
        console.log(`ignoring initialized events ${storedEvents.length}`);
        storedEvents = [];
        isStarting = false;
    }
    else {
        if (buildDeps) {
            // run dependants
            // once we get a brake from saved changes
            // then we get get the uniq list of packages
            const packackagesToRun = getUniques(storedEvents.map(getPackageRoute));
            const names = packageGraph.map((p) => ({
                name: p.name,
                location: p.resolved.saveSpec.split(":")[1],
            }));
            let runningNames = names
                .filter((n) => packackagesToRun.includes(n.location))
                .map((n) => n.name);
            runningNames = Array.from(getAllDependents(runningNames, graph));
            // remove scope... maybe also only include things that are a dep of scope
            runningNames = runningNames.filter((n) => !scope.includes(n));
            console.log("running changes in: ", runningNames);
            packageGraph.forEach((p) => {
                if (runningNames.includes(p.name)) {
                    const call = `lerna run ${buildCommand} --scope='${p.name}'`;
                    console.log(`:: ${call} ::`);
                    const stdout = execSync(call, { encoding: "utf8" });
                    console.log(stdout);
                }
            });
        }
        else {
            // run only changed files
            let runningChunks = storedEvents.reduce((acc, current) => {
                const local = getPackageRoute(current);
                if (!acc[local]) {
                    acc[local] = [];
                }
                acc[local] = getUniques([
                    ...acc[local],
                    current[1].replace(local, "."),
                ]);
                return acc;
            }, {});
            const names = packageGraph.map((p) => ({
                name: p.name,
                location: p.resolved.saveSpec.split(":")[1],
            }));
            Object.keys(runningChunks).forEach((key) => {
                var _a;
                const packageName = ((_a = names.find((p) => p.location === key)) === null || _a === void 0 ? void 0 : _a.name) || "";
                if (!scope.includes(packageName)) {
                    const files = runningChunks[key].join(" ");
                    const call = `lerna run ${buildCommand} --scope='${packageName}'`;
                    console.log(`:: ${call} ::`);
                    const stdout = execSync(call, { encoding: "utf8" });
                    console.log(stdout);
                }
            });
        }
        // what if I save while i am running...
        storedEvents = [];
    }
};
const lernaConfig = require(`${process.cwd()}/lerna.json`);
(function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = process.cwd();
        // lets grab commands and if none then start
        let scope = [];
        let buildDeps = false;
        let [, , startCommand, buildCommand, ...args] = process.argv;
        if (!startCommand) {
            startCommand = "start";
        }
        if (!buildCommand) {
            buildCommand = "build";
        }
        args.forEach((arg) => {
            if (arg.split("=")[0] === "--scope") {
                scope = arg.split("=")[1].split(",");
            }
            if (arg.toLowerCase().includes("builddeps")) {
                buildDeps = true;
            }
        });
        // get the package jsons and graph representations like lerna does
        const pkgs = yield getPackages(cwd);
        const graph = new PackageGraph(pkgs);
        let chain = Promise.resolve();
        chain = chain.then(() => getPackages(cwd));
        chain = chain.then((packages) => {
            const packageGraph = toposort(packages);
            const names = packageGraph.map((p) => ({
                name: p.name,
                location: p.resolved.saveSpec.split(":")[1],
            }));
            let wathcingPaths = Array.from(getAllDependencies(scope, graph));
            wathcingPaths = wathcingPaths.filter((n) => !scope.includes(n));
            wathcingPaths = wathcingPaths.map((k) => {
                return `./${names.find((n) => n.name === graph.get(k).name).location}/**`;
            });
            chokidar
                .watch(wathcingPaths, 
            // need to ignore build artifacts...
            { ignored: ["**/node_modules", "**/.git", "**/dist", "**/lib"] })
                .on("all", debounce(handleFileChange(buildCommand, scope, packageGraph, graph, pkgs, buildDeps), 300));
        });
    });
})();
