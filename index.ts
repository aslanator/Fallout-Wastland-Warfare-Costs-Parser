import {promises} from 'fs';
import Items from './Items';
import Units from './Units';

export async function getUnits() {
    const unitsData: Buffer = await promises.readFile('./survivors.txt');
    const unitsDataArray: string[] = unitsData.toString().split(/\r\n/);

    return new Units(unitsDataArray);
};

export async function getItems() {
    const itemsData: Buffer = await promises.readFile('./data.txt');
    const itemsDataArray: string[] = itemsData.toString().split(/\r\n/);

    return new Items(itemsDataArray);
};