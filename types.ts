export type ItemsGroupedByTypes = {
    [key: string]: FalloutItem[];
}

export type FalloutItem = {
    title: string,
    cost: number,
    group: string,
}

export type Unit = {
    types: string[],
    title: string,
    items: string[],
    cost: number,
    unitLine: string,
}