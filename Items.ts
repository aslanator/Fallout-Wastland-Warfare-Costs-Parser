import { ItemsGroupedByTypes, FalloutItem } from './types';
import {ITEM_GROUPS, TYPES} from './constants';

export default class Items {
    private rawData: string[];
    private costChecker: RegExp;
    private groupChecker: RegExp;
    private itemsGroupedByTypes: ItemsGroupedByTypes = {};
    private items: FalloutItem[] = [];

    constructor(rawData: string[]) {
        this.rawData = rawData;
        this.costChecker = new RegExp(/ \d{1,3}$/);
        this.groupChecker = new RegExp(`^(${ITEM_GROUPS.join('|')}) `);
        this.setItems();
    }

    getItemsGroupedByTypes(): ItemsGroupedByTypes {
        return this.itemsGroupedByTypes;
    }

    getSumCostByNames(titles: string[]) {
        let cost = 0;
        for(const title of titles) {
            const item = this.items.find(item => item.title.toLowerCase() === title.toLowerCase());
            cost += item?.cost || 0;
        }
        return cost;
    }

    private setItems() {
        for(const type of TYPES) {
            this.itemsGroupedByTypes[type] = this.getItemsByType(type);
            this.items = this.items.concat(this.itemsGroupedByTypes[type]);
        }
    }

    private getItemsByType(type: string): FalloutItem[] {
        const itemsOfType = [];
        let isCurrentType = false;
        const typeChecker = new RegExp(`^${type}( \\(CONTINUED\\))?$`, 'i');
        let joinedItems = '';
        for(const item of this.rawData) {
            if(isCurrentType) {
                if(typeChecker.test(item)) continue;
                if(!/[a-z]+/.test(item)) break;
                if(this.costChecker.test(item)) {
                    const falloutItem = this.getFalloutItem(item, joinedItems);
                    itemsOfType.push(falloutItem);
                    joinedItems = '';
                }
                else joinedItems += `${item} `;
            }
            else if(typeChecker.test(item)) {
                isCurrentType = true;
            }
        }
        return itemsOfType;
    }

    private getFalloutItem(item: string, joinedItems: string): FalloutItem {
        const cost = this.getCost(item, this.costChecker);
        const itemWithoutCost = item.replace(this.costChecker, '');
        let title = `${joinedItems}${itemWithoutCost}`;
        const group = this.getGroupByTitle(title);
        title = title.replace(this.groupChecker, '');
        const falloutItem = { title, cost, group }
        return falloutItem;
    }

    private getCost(item: string, costChecker: RegExp) {
        const costMatch = item.match(costChecker);
        if(costMatch && costMatch[0]) return Number(costMatch[0]);
        return 0;
    }

    private getGroupByTitle(title: string): string {
        const group = title.match(this.groupChecker);
        if(group && group[0]) {
            return group[0].trim();
        }
        return '';
    }
}