// add all self written ts definitions here
/// <reference path="custom/transit-immutable-js.d.ts" />

declare module 'zone.js/dist/zone' {
    export var Zone; // this doesn't actually do anything just makes the compiler not complain about the empty module
}
declare module 'zone.js/dist/long-stack-trace-zone' {
    export var Zone; // this doesn't actually do anything just makes the compiler not complain about the empty module
}
