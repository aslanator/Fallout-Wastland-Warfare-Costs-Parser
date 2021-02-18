import {promises} from 'fs';
import Items from './Items';
import Units from './Units';
import FetchUnitsData from './FetchUnitsData'

export async function getUnits(): Promise<Map<string, Units>> {
    const unitsMap = new Map;
    unitsMap.set('survivors', await FetchUnitsData.getSurvivors());
    unitsMap.set('bos', await FetchUnitsData.getBos());
    return unitsMap;
};

export async function getItems() {
    const itemsData: Buffer = await promises.readFile(__dirname + '/data.txt');
    const itemsDataArray: string[] = itemsData.toString().split(/\r\n/);

    return new Items(itemsDataArray);
};