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
            // VALIDAR TEXTO
            // ==================================================

            if (
                typeof texto !== "string" ||
                !texto.trim()
            ) {

                throw new Error(
                    "A pergunta recebida pelo robô está vazia ou inválida."
                );

            }


            texto =
                texto.trim();


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


            if (
                this.avatar
            ) {

                this.avatar.setState(
                    "thinking"
                );

            }


            // ==================================================
            // PERGUNTAR PARA IA
            // ==================================================

            console.log(
                "🧠 Enviando pergunta para a IA..."
            );


            let resposta =
                await perguntar(
                    texto
                );


            // ==================================================
            // VALIDAR RESPOSTA
            // ==================================================

            if (
                typeof resposta !== "string" ||
                !resposta.trim()
            ) {

                throw new Error(
                    "A IA não retornou uma resposta válida."
                );

            }


            console.log(
                "📥 Resposta recebida da IA:",
                resposta
            );


            // ==================================================
            // LIMPAR RESPOSTA
            // ==================================================

            resposta =
                limparTexto(
                    resposta
                );


            // ==================================================
            // VALIDAR RESPOSTA APÓS LIMPEZA
            // ==================================================

            if (
                !resposta
            ) {

                throw new Error(
                    "A resposta da IA ficou vazia após a limpeza."
                );

            }


            console.log(
                "🤖 HALF:",
                resposta
            );


            // ==================================================
            // ESTADO: SPEAKING
            // ==================================================

            this.estado =
                "speaking";


            console.log(
                "🗣️ HALF está respondendo..."
            );


            if (
                this.avatar
            ) {

                this.avatar.setState(
                    "speaking"
                );

            }


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

            if (
                this.avatar &&
                this.avatar.speak
            ) {

                await this.avatar.speak(
                    resposta
                );

            }


            // ==================================================
            // VOLTAR PARA IDLE
            // ==================================================

            if (
                this.avatar
            ) {

                this.avatar.setState(
                    "idle"
                );

            }


            this.estado =
                "idle";


            console.log(
                "✅ Conversa finalizada."
            );


            console.log(
                "================================="
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