import { DynamicObject, Renderer } from 'lance-gg';
import BrawlerRenderer from '../client/BrawlerRenderer.js';

export default class Platform extends DynamicObject {

    netScheme() {
        return super.netScheme();
    }

    onAddToWorld(gameEngine) {
        let brawlerRenderer = (<BrawlerRenderer> Renderer.getInstance());
        brawlerRenderer?.addPlatform(this);
    }

    syncTo(other) {
        super.syncTo(other);
    }

    toString() {
        return `Platform::${super.toString()} Width=${this.width} Height=${this.height}`;
    }
}
