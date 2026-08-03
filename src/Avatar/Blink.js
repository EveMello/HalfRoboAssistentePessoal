export default class Blink {

    constructor(vrm) {

        this.vrm = vrm;

        this.nextBlink = this.randomTime();

        this.isBlinking = false;

    }

    randomTime() {

        // Entre 3 e 6 segundos
        return performance.now() + (3000 + Math.random() * 3000);

    }

    update() {

        if (!this.vrm) return;

        if (!this.vrm.expressionManager) return;

        const now = performance.now();

        if (!this.isBlinking && now >= this.nextBlink) {

            this.isBlinking = true;

            // Fecha os olhos
            this.vrm.expressionManager.setValue("blink", 1);

            setTimeout(() => {

                // Abre novamente
                this.vrm.expressionManager.setValue("blink", 0);

                this.isBlinking = false;

                this.nextBlink = this.randomTime();

            }, 140);

        }

    }

}