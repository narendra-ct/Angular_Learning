import { OfferTypes } from './OfferTypes';

export class Wheel {
    drinkTypes: OfferTypes[];

    constructor(drinkTypes: OfferTypes[]) {
        this.drinkTypes = drinkTypes;
    }
}