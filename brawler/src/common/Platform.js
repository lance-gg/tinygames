import DynamicObject from 'lance/serialize/DynamicObject';
import Renderer from 'lance/render/Renderer';

export default class Platform extends DynamicObject {

    static get netScheme() {
        return super.netScheme;
    }

    onAddToWorld(gameEngine) {
        let renderer = Renderer.getInstance();
        if (renderer) renderer.addPlatform(this);
    }

    syncTo(other) {
        super.syncTo(other);
    }

    toString() {
        return `Platform::${super.toString()} Width=${this.width} Height=${this.height}`;
    }
}
