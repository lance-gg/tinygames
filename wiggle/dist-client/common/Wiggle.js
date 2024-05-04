import { BaseTypes, DynamicObject } from 'lance-gg';
export default class Wiggle extends DynamicObject {
    constructor() {
        super(...arguments);
        this.bodyParts = [];
        this.bodyLength = 0;
    }
    netScheme() {
        return Object.assign({
            direction: { type: BaseTypes.Float32 },
            bodyLength: { type: BaseTypes.Int16 }
        }, super.netScheme());
    }
    syncTo(other) {
        super.syncTo(other);
        this.direction = other.direction;
        this.bodyLength = other.bodyLength;
    }
    toString() {
        return `Wiggle::${super.toString()} direction=${this.direction} length=${this.bodyLength}`;
    }
}
