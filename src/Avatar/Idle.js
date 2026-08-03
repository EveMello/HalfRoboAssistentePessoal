export default class Idle {

    constructor(vrm) {

        this.vrm = vrm;

    }

    update() {

        if (!this.vrm) return;

        const t = performance.now() * 0.001;

        // Respiração (sobe e desce)
        this.vrm.scene.position.y = Math.sin(t * 1.8) * 0.008;

        // Movimento muito leve para frente/trás
        this.vrm.scene.rotation.x = Math.sin(t * 0.8) * 0.01;

    }

}