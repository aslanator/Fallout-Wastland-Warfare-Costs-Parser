import {promises} from 'fs';
import Items from './Items';
import Units from './Units';

(async function() {
    
    const itemsData: Buffer = await promises.readFile('./data.txt');
    const itemsDataArray: string[] = itemsData.toString().split(/\r\n/);

    const unitsData: Buffer = await promises.readFile('./survivors.txt');
    const unitsDataArray: string[] = unitsData.toString().split(/\r\n/);

    const items = new Items(itemsDataArray);

    const units = new Units(unitsDataArray);
})(); 