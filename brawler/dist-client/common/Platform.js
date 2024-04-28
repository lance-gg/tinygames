import { DynamicObject, Renderer } from 'lance-gg';
export default class Platform extends DynamicObject {
    netScheme() {
        return super.netScheme();
    }
    onAddToWorld(gameEngine) {
        let brawlerRenderer = Renderer.getInstance();
        brawlerRenderer === null || brawlerRenderer === void 0 ? void 0 : brawlerRenderer.addPlatform(this);
    }
    syncTo(other) {
        super.syncTo(other);
    }
    toString() {
        return `Platform::${super.toString()} Width=${this.width} Height=${this.height}`;
    }
}
