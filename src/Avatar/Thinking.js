export default class Thinking {

    constructor(vrm) {

        this.vrm = vrm;

    }

    update(delta) {

        if (!this.vrm) return;

        const head = this.vrm.humanoid?.getNormalizedBoneNode("head");

        if (!head) return;

        // inclina levemente a cabeça para baixo
        head.rotation.x += (-0.25 - head.rotation.x) * 0.05;

    }

}