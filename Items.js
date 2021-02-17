"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
class Items {
    constructor(rawData) {
        this.itemsGroupedByTypes = {};
        this.items = [];
        this.rawData = rawData;
        this.costChecker = new RegExp(/ \d{1,3}$/);
        this.groupChecker = new RegExp(`^(${constants_1.ITEM_GROUPS.join('|')}) `);
        this.setItems();
    }
    getItemsGroupedByTypes() {
        return this.itemsGroupedByTypes;
    }
    getSumCostByNames(titles) {
        let cost = 0;
        for (const title of titles) {
            const item = this.items.find(item => item.title.toLowerCase() === title.toLowerCase());
            cost += item?.cost || 0;
        }
        return cost;
    }
    setItems() {
        for (const type of constants_1.TYPES) {
            this.itemsGroupedByTypes[type] = this.getItemsByType(type);
            this.items = this.items.concat(this.itemsGroupedByTypes[type]);
        }
    }
    getItemsByType(type) {
        const itemsOfType = [];
        let isCurrentType = false;
        const typeChecker = new RegExp(`^${type}( \\(CONTINUED\\))?$`, 'i');
        let joinedItems = '';
        for (const item of this.rawData) {
            if (isCurrentType) {
                if (typeChecker.test(item))
                    continue;
                if (!/[a-z]+/.test(item))
                    break;
                if (this.costChecker.test(item)) {
                    const falloutItem = this.getFalloutItem(item, joinedItems);
                    itemsOfType.push(falloutItem);
                    joinedItems = '';
                }
                else
                    joinedItems += `${item} `;
            }
            else if (typeChecker.test(item)) {
                isCurrentType = true;
            }
        }
        return itemsOfType;
    }
    getFalloutItem(item, joinedItems) {
        const cost = this.getCost(item, this.costChecker);
        const itemWithoutCost = item.replace(this.costChecker, '');
        let title = `${joinedItems}${itemWithoutCost}`;
        const group = this.getGroupByTitle(title);
        title = title.replace(this.groupChecker, '');
        const falloutItem = { title, cost, group };
        return falloutItem;
    }
    getCost(item, costChecker) {
        const costMatch = item.match(costChecker);
        if (costMatch && costMatch[0])
            return Number(costMatch[0]);
        return 0;
    }
    getGroupByTitle(title) {
        const group = title.match(this.groupChecker);
        if (group && group[0]) {
            return group[0].trim();
        }
        return '';
    }
}
exports.default = Items;
