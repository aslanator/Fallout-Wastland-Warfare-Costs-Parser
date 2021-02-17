import { TYPES } from './constants';
import { Unit } from './types';

export default class Units {
    private rawData: string[];
    private costChecker: RegExp;
    private trashRemover: RegExp;
    private typeChecker: RegExp;
    private _units: Unit[] = [];

    constructor(rawData: string[]) {
        this.rawData = rawData;
        this.typeChecker = new RegExp(` ?(${TYPES.join('|')}),? ?`, 'gi');
        this.costChecker = new RegExp(/ ?\d{1,3}$/);
        this.trashRemover = new RegExp(/\*/g);
        this.setUnits();
    }

    get units() {
        return this._units;
    }

    private setUnits() {
        const unitLines = this.getUnitLines();
        const units: Unit[] = [];
        for(const unitLine of unitLines) {
            const types = this.getTypesByUnitLine(unitLine);
            const title = this.getTitleByUnitLine(unitLine);
            const cost = this.getCostByUnitLine(unitLine);
            const items = this.getItemsByUnitLine(unitLine);
            const unit = {
                types,
                title,
                unitLine,
                cost,
                items,
            }
            units.push(unit);
        }
        this._units = units;
    }

    private getUnitLines(): string[] {
        let joinedUnit = '';
        const unitLines = [];
        for(const unit of this.rawData) {
            if(this.costChecker.test(unit)) {
                const unitLine = `${joinedUnit}${unit}`.replace(this.trashRemover, '');
                unitLines.push(unitLine);
                joinedUnit = '';
            }
            else {
                joinedUnit = `${joinedUnit}${unit} `;
            }
        }
        return unitLines;
    }

    private getTypesByUnitLine(unitLine: string): string[] {
        const types = [];
        const typeMatches = unitLine.matchAll(this.typeChecker);
        for(const type of typeMatches) {
            types.push(type[1]);
        }
        return types;
    }

    private getCostByUnitLine(unitLine: string): number {
        let cost = 0;
        const costMatch = unitLine.match(this.costChecker);
        if(costMatch && costMatch[0]) {
            cost = Number(costMatch[0].trim());
        }
        return cost;
    }

    private getTitleByUnitLine(unitLine: string): string {
        const regExp = new RegExp(`^([\\w\\d-_ ]+) (${TYPES.join('|')})`, 'i');
        const titleMatch = unitLine.match(regExp);
        if(titleMatch && titleMatch[1]) {
            return titleMatch[1];
        }
        return '';
    }

    private getItemsByUnitLine(unitLine: string): string[] {
        const regExp = new RegExp(` (${TYPES.join('|')}) ([\\w, ]+|-) \\d{1,3}$`, 'i');
        const itemsMatch = unitLine.match(regExp);
        if(itemsMatch && itemsMatch[2] && itemsMatch[2] !== '-') {
            return itemsMatch[2].split(',');
        }
        return [];
    }
}