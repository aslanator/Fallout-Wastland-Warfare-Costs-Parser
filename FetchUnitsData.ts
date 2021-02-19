import {promises} from 'fs';
import Units from './Units';
import { Unit } from './types';


export default class FetchUnitsData {

    static async getUnits(key: string): Promise<Units> {
        const unitsData: Buffer = await promises.readFile(`${__dirname}/units_data/${key}.txt`);
        const unitsDataArray: string[] = unitsData.toString().split(/\r\n/);
        return new Units(unitsDataArray);
    }
    
    static async getSurvivors(): Promise<Unit[]> {
        return (await FetchUnitsData.getUnits('survivors')).units;
    }

    static async getBos(): Promise<Unit[]> {
        return (await FetchUnitsData.getUnits('bos')).units;
    }
}