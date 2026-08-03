export default class LookAt {

    constructor(vrm) {

        this.vrm = vrm;

        this.mouseX = 0;
        this.mouseY = 0;

        window.addEventListener("mousemove", (event) => {

            this.mouseX =
                (event.clientX / window.innerWidth) * 2 - 1;

            this.mouseY =
                -(event.clientY / window.innerHeight) * 2 + 1;

        });

    }

    update() {

        if (!this.vrm) return;

        const head =
            this.vrm.humanoid?.getNormalizedBoneNode("head");

        if (!head) return;

        // Movimento suave da cabeça
        head.rotation.y +=
            ((this.mouseX * 0.30) - head.rotation.y) * 0.08;

        head.rotation.x +=
            ((this.mouseY * 0.18) - head.rotation.x) * 0.08;

    }

}