export default class LipSync {

    constructor(vrm) {

        this.vrm = vrm;

        this.isSpeaking = false;

    }

    speak(text) {

        return new Promise((resolve) => {

            if (!this.vrm || !this.vrm.expressionManager) {

                resolve();
                return;

            }

            // Cancela qualquer fala anterior
            speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            const voices = speechSynthesis.getVoices();

            utterance.voice = voices.find(
                voice => voice.name.includes("Daniel")
            );

            utterance.lang = "pt-BR";
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;

            // Enquanto fala
            utterance.onboundary = () => {

                this.openMouth();

            };

            // Terminou de falar
            utterance.onend = () => {

                this.closeMouth();

                resolve();

            };

            speechSynthesis.speak(utterance);

        });

    }

    openMouth() {

        if (this.isSpeaking) return;

        this.isSpeaking = true;

        this.vrm.expressionManager.setValue("aa", 1);

        setTimeout(() => {

            this.closeMouth();

        }, 120);

    }

    closeMouth() {

        this.vrm.expressionManager.setValue("aa", 0);

        this.isSpeaking = false;

    }

}