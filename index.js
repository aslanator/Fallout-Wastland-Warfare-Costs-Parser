"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItems = exports.getUnits = void 0;
const fs_1 = require("fs");
const Items_1 = __importDefault(require("./Items"));
const Units_1 = __importDefault(require("./Units"));
async function getUnits() {
    const unitsData = await fs_1.promises.readFile('./survivors.txt');
    const unitsDataArray = unitsData.toString().split(/\r\n/);
    return new Units_1.default(unitsDataArray);
}
exports.getUnits = getUnits;
;
async function getItems() {
    const itemsData = await fs_1.promises.readFile('./data.txt');
    const itemsDataArray = itemsData.toString().split(/\r\n/);
    return new Items_1.default(itemsDataArray);
}
exports.getItems = getItems;
;
