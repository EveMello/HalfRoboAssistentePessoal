import Idle from "./Idle";
import LookAt from "./LookAt";
import Blink from "./Blink";
import LipSync from "./LipSync";
import Thinking from "./Thinking";

export default class Avatar {

    constructor(vrm) {

        this.vrm = vrm;

        this.state = "idle";

        this.idle = new Idle(vrm);
        this.lookAt = new LookAt(vrm);
        this.blink = new Blink(vrm);
        this.lipSync = new LipSync(vrm);
        this.thinking = new Thinking(vrm);

    }

    setState(state) {

        if (this.state === state) return;

        this.state = state;

        console.log("🤖 Estado:", state);

    }

    getState() {

        return this.state;

    }

    update(delta) {

    if (!this.vrm) return;

    this.vrm.update(delta);

    // Pisca em qualquer estado
    this.blink.update(delta);

    switch (this.state) {

        case "idle":

            this.idle.update(delta);
            this.lookAt.update(delta);

            break;

        case "thinking":

            this.idle.update(delta);
            this.thinking.update(delta);

            break;

        case "speaking":

            this.idle.update(delta);
            this.lookAt.update(delta);

            break;

        default:

            this.idle.update(delta);
            this.lookAt.update(delta);

            break;

    }

}

    async speak(text) {

        this.setState("speaking");

        await this.lipSync.speak(text);

        // volta para idle quando terminar
        setTimeout(() => {

            this.setState("idle");

        }, Math.max(text.length * 70, 1000));

    }

}