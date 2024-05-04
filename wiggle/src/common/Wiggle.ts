import { BaseTypes, DynamicObject, TwoVector } from 'lance-gg';

export default class Wiggle extends DynamicObject {

    public bodyParts: TwoVector[] = [];
    public bodyLength: number = 0;
    public direction: number;
    public AI: boolean;
    public turnDirection: number;

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
