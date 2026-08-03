import { perguntar } from "../Chat/ChatAPI";
import { limparTexto } from "../Utils/TextCleaner";


export class Robot {

    constructor(
        avatar,
        speech
    ) {

        this.avatar =
            avatar;

        this.speech =
            speech;

        this.estado =
            "idle";

    }


    // ==================================================
    // PROCESSAR PERGUNTA
    // ==================================================

    async perguntar(
        texto
    ) {

        try {

            // ==================================================
            // ESTADO: THINKING
            // ==================================================

            this.estado =
                "thinking";


            console.log(
                "================================="
            );


            console.log(
                "👤 Usuário:",
                texto
            );


            this.avatar.setState(
                "thinking"
            );


            // ==================================================
            // PERGUNTAR PARA IA
            // ==================================================

            let resposta =
                await perguntar(
                    texto
                );


            // ==================================================
            // LIMPAR RESPOSTA
            // ==================================================

            resposta =
                limparTexto(
                    resposta
                );


            console.log(
                "🤖 Robô:",
                resposta
            );


            // ==================================================
            // ESTADO: SPEAKING
            // ==================================================

            this.estado =
                "speaking";


            console.log(
                "🗣️ Robô está respondendo..."
            );


            this.avatar.setState(
                "speaking"
            );


            // ==================================================
            // STATUS NA TELA
            // ==================================================

            if (
                this.speech &&
                this.speech.atualizarStatus
            ) {

                this.speech.atualizarStatus(
                    "speaking",
                    "🗣️",
                    "Estou respondendo..."
                );

            }


            // ==================================================
            // ROBÔ FALA
            // ==================================================

            await this.avatar.speak(
                resposta
            );


            // ==================================================
            // VOLTAR PARA IDLE
            // ==================================================

            this.avatar.setState(
                "idle"
            );


            this.estado =
                "idle";


            console.log(
                "✅ Conversa finalizada."
            );


            // ==================================================
            // RETORNAR RESPOSTA
            // ==================================================

            return resposta;


        } catch (
            erro
        ) {

            console.error(
                "❌ Erro no Robot:",
                erro
            );


            this.estado =
                "error";


            if (
                this.avatar
            ) {

                this.avatar.setState(
                    "idle"
                );

            }


            throw erro;

        }

    }


    // ==================================================
    // PEGAR ESTADO
    // ==================================================

    getEstado() {

        return this.estado;

    }

}