import { DynamicObject } from 'lance-gg';

export default class Food extends DynamicObject {

    netScheme() {
        return Object.assign({
            // add serializable properties here
        }, super.netScheme());
    }

    syncTo(other: Food) {
        super.syncTo(other);
    }
}
