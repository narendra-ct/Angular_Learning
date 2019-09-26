export class OfferTypes {
    label: string;
    prob: number;
    dealType: string;

    constructor(label: string, prob: number,dealType: string){
        this.label = label;
        this.prob = prob;
        this.dealType = dealType;
    }
}