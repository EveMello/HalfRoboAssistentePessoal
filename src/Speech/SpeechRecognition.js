export default class SpeechRecognitionManager {

    constructor() {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        // ==================================================
        // VERIFICAR SUPORTE
        // ==================================================

        if (!SpeechRecognition) {

            alert(
                "Seu navegador não suporta reconhecimento de voz."
            );

            return;

        }


        // ==================================================
        // CONFIGURAR RECONHECIMENTO
        // ==================================================

        this.recognition =
            new SpeechRecognition();

        this.recognition.lang =
            "pt-BR";

        this.recognition.continuous =
            false;

        this.recognition.interimResults =
            false;


        // ==================================================
        // PALAVRAS DE ATIVAÇÃO
        // ==================================================

        this.palavrasAtivacao = [

            "ralf",
            "ralph",
            "raufi",
            "rauf",
            "half",
            "ralfi",
            "alf",
            "alvin"

        ];


        // ==================================================
        // TEMPO DE INATIVIDADE
        // ==================================================

        this.tempoInatividade =
            15000;


        // ==================================================
        // ESTADOS
        // ==================================================

        this.isListening =
            false;

        this.conversaAtiva =
            false;

        this.timerInatividade =
            null;


        // ==================================================
        // CONTROLE DO RECONHECIMENTO
        // ==================================================

        this.deveContinuarOuvindo =
            false;

        this.paradaManual =
            false;


        // ==================================================
        // CALLBACKS
        // ==================================================

        this.onResult =
            null;

        this.onStatusChange =
            null;


        // ==================================================
        // RESULTADO DO RECONHECIMENTO
        // ==================================================

        this.recognition.onresult =
            (event) => {

                const texto =
                    event.results[0][0].transcript
                        .toLowerCase()
                        .trim();


                console.log(
                    "🎤 Você disse:",
                    texto
                );


                // ==================================================
                // CONVERSA NÃO ESTÁ ATIVA
                // ==================================================

                if (
                    !this.conversaAtiva
                ) {

                    const ativou =
                        this.detectarPalavraAtivacao(
                            texto
                        );


                    // ==================================================
                    // NÃO DETECTOU RALF
                    // ==================================================

                    if (!ativou) {

                        console.log(
                            "💤 Palavra de ativação não detectada."
                        );


                        // Continua aguardando Ralf

                        this.deveContinuarOuvindo =
                            true;

                        return;

                    }


                    // ==================================================
                    // RALF FOI DETECTADO
                    // ==================================================

                    console.log(
                        "🤖 Palavra de ativação detectada!"
                    );


                    this.conversaAtiva =
                        true;


                    // ==================================================
                    // INICIAR / RENOVAR TIMER
                    // ==================================================

                    this.resetarTimerInatividade();


                    // ==================================================
                    // REMOVER RALF DO TEXTO
                    // ==================================================

                    const pergunta =
                        this.removerPalavraAtivacao(
                            texto
                        );


                    // ==================================================
                    // USUÁRIO DISSE APENAS:
                    // "RALF"
                    // ==================================================

                    if (!pergunta) {

                        console.log(
                            "🤖 Ralf ativado."
                        );

                        console.log(
                            "🎤 Aguardando pergunta..."
                        );


                        this.atualizarStatus(
                            "listening",
                            "🟢",
                            "Pode falar..."
                        );


                        // O ciclo atual termina,
                        // mas devemos ouvir novamente.

                        this.deveContinuarOuvindo =
                            true;


                        return;

                    }


                    // ==================================================
                    // USUÁRIO DISSE:
                    // "RALF, ONDE FICA A BIBLIOTECA?"
                    // ==================================================

                    console.log(
                        "🧠 Pergunta inicial detectada:"
                    );

                    console.log(
                        pergunta
                    );


                    this.deveContinuarOuvindo =
                        false;


                    this.resetarTimerInatividade();


                    this.atualizarStatus(
                        "thinking",
                        "🧠",
                        "Estou pensando..."
                    );


                    if (
                        this.onResult
                    ) {

                        this.onResult(
                            pergunta
                        );

                    }


                    return;

                }


                // ==================================================
                // CONVERSA JÁ ESTÁ ATIVA
                // ==================================================

                console.log(
                    "🟢 Conversa ativa."
                );


                console.log(
                    "🧠 Nova pergunta detectada:"
                );


                console.log(
                    texto
                );


                // ==================================================
                // MUITO IMPORTANTE
                //
                // Toda vez que o usuário falar,
                // o timer de 15 segundos é reiniciado.
                // ==================================================

                this.resetarTimerInatividade();


                // ==================================================
                // PARAR REINÍCIO AUTOMÁTICO
                //
                // O main.js vai processar a pergunta.
                // ==================================================

                this.deveContinuarOuvindo =
                    false;


                this.atualizarStatus(
                    "thinking",
                    "🧠",
                    "Estou pensando..."
                );


                if (
                    this.onResult
                ) {

                    this.onResult(
                        texto
                    );

                }

            };


        // ==================================================
        // ERRO
        // ==================================================

        this.recognition.onerror =
            (event) => {

                console.error(
                    "❌ Erro no microfone:",
                    event.error
                );


                this.isListening =
                    false;


                // ==================================================
                // NENHUMA FALA
                // ==================================================

                if (
                    event.error ===
                    "no-speech"
                ) {

                    console.log(
                        "🎤 Nenhuma fala detectada."
                    );


                    // Se estiver aguardando Ralf,
                    // continua ouvindo.

                    if (
                        !this.conversaAtiva
                    ) {

                        this.deveContinuarOuvindo =
                            true;

                    }

                }


                // ==================================================
                // MICROFONE ABORTADO
                // ==================================================

                if (
                    event.error ===
                    "aborted"
                ) {

                    console.log(
                        "🎤 Reconhecimento interrompido."
                    );

                }

            };


        // ==================================================
        // RECONHECIMENTO TERMINOU
        // ==================================================

        this.recognition.onend =
            () => {

                this.isListening =
                    false;


                console.log(
                    "🎤 Ciclo do microfone encerrado."
                );


                // ==================================================
                // REINICIAR AUTOMATICAMENTE
                // ==================================================

                if (
                    this.deveContinuarOuvindo &&
                    !this.paradaManual
                ) {

                    console.log(
                        "🎤 Voltando a ouvir..."
                    );


                    setTimeout(
                        () => {

                            this.start();

                        },
                        300
                    );

                }

            };

    }


    // ==================================================
    // DETECTAR PALAVRA DE ATIVAÇÃO
    // ==================================================

    detectarPalavraAtivacao(
        texto
    ) {

        return this.palavrasAtivacao.some(
            palavra =>
                texto.includes(
                    palavra
                )
        );

    }


    // ==================================================
    // REMOVER PALAVRA DE ATIVAÇÃO
    // ==================================================

    removerPalavraAtivacao(
        texto
    ) {

        let resultado =
            texto;


        this.palavrasAtivacao.forEach(
            palavra => {

                resultado =
                    resultado.replace(
                        palavra,
                        ""
                    );

            }
        );


        return resultado
            .replace(
                /^[,\s]+/,
                ""
            )
            .trim();

    }


    // ==================================================
    // ATUALIZAR STATUS
    // ==================================================

    atualizarStatus(
        estado,
        icone,
        texto
    ) {

        console.log(
            "📺 Status:",
            estado,
            texto
        );


        if (
            this.onStatusChange
        ) {

            this.onStatusChange(
                {
                    estado,
                    icone,
                    texto
                }
            );

        }

    }


    // ==================================================
    // INICIAR MICROFONE
    // ==================================================

    start() {

        if (
            !this.recognition
        ) {

            return;

        }


        if (
            this.isListening
        ) {

            return;

        }


        try {

            // ==================================================
            // IMPORTANTE
            //
            // start() pode ser chamado tanto:
            //
            // 1. esperando Ralf
            // 2. durante conversa ativa
            //
            // Nunca altera conversaAtiva.
            // ==================================================

            this.paradaManual =
                false;


            this.isListening =
                true;


            console.log(
                "🎤 Microfone ativo."
            );


            // ==================================================
            // STATUS
            // ==================================================

            if (
                this.conversaAtiva
            ) {

                this.atualizarStatus(
                    "listening",
                    "🟢",
                    "Pode continuar falando..."
                );

            } else {

                this.atualizarStatus(
                    "waiting",
                    "💤",
                    'Diga "Ralf" para começar'
                );

            }


            // ==================================================
            // INICIAR RECONHECIMENTO
            // ==================================================

            this.recognition.start();


        } catch (
            erro
        ) {

            console.error(
                "❌ Erro ao iniciar microfone:",
                erro
            );


            this.isListening =
                false;

        }

    }


    // ==================================================
    // PARAR MICROFONE TEMPORARIAMENTE
    // ==================================================

    stop() {

        if (
            !this.recognition
        ) {

            return;

        }


        console.log(
            "🛑 Parando microfone temporariamente..."
        );


        // ==================================================
        // IMPORTANTE
        //
        // NÃO encerra conversa.
        //
        // Apenas pausa reconhecimento enquanto
        // o robô processa e fala.
        // ==================================================

        this.paradaManual =
            true;


        this.deveContinuarOuvindo =
            false;


        this.isListening =
            false;


        try {

            this.recognition.stop();

        } catch (
            erro
        ) {

            console.error(
                "❌ Erro ao parar microfone:",
                erro
            );

        }

    }


    // ==================================================
    // RENOVAR TIMER DE INATIVIDADE
    // ==================================================

    resetarTimerInatividade() {

        // ==================================================
        // Cancela timer anterior
        // ==================================================

        clearTimeout(
            this.timerInatividade
        );


        // ==================================================
        // Só cria timer se a conversa estiver ativa
        // ==================================================

        if (
            !this.conversaAtiva
        ) {

            return;

        }


        console.log(
            "⏱️ Timer de inatividade renovado."
        );


        this.timerInatividade =
            setTimeout(
                () => {

                    this.encerrarConversa();

                },

                this.tempoInatividade

            );

    }


    // ==================================================
    // MÉTODO PARA CHAMAR QUANDO ROBÔ TERMINAR DE FALAR
    // ==================================================

    continuarConversa() {

        // ==================================================
        // Se a conversa já foi encerrada,
        // não volta a ouvir.
        // ==================================================

        if (
            !this.conversaAtiva
        ) {

            console.log(
                "💤 Conversa não está mais ativa."
            );

            return;

        }


        console.log(
            "🟢 Conversa continua ativa."
        );


        // ==================================================
        // MUITO IMPORTANTE
        //
        // Renova os 15 segundos DEPOIS da resposta.
        //
        // Isso evita que o timer antigo encerre a conversa
        // enquanto o robô está falando.
        // ==================================================

        this.resetarTimerInatividade();


        this.deveContinuarOuvindo =
            true;


        this.atualizarStatus(
            "listening",
            "🟢",
            "Pode continuar falando..."
        );


        // ==================================================
        // Iniciar novo ciclo de reconhecimento
        // ==================================================

        if (
            !this.isListening
        ) {

            this.start();

        }

    }


    // ==================================================
    // ENCERRAR CONVERSA
    // ==================================================

    encerrarConversa() {

        console.log(
            "⏱️ Tempo de inatividade atingido."
        );


        console.log(
            "💤 Conversa encerrada."
        );


        // ==================================================
        // DESATIVAR CONVERSA
        // ==================================================

        this.conversaAtiva =
            false;


        // ==================================================
        // CANCELAR TIMER
        // ==================================================

        clearTimeout(
            this.timerInatividade
        );


        this.timerInatividade =
            null;


        // ==================================================
        // PARAR CONTROLE AUTOMÁTICO
        // ==================================================

        this.deveContinuarOuvindo =
            true;


        // ==================================================
        // LIMPAR HISTÓRICO DA IA
        // ==================================================

        console.log(
            "🧹 Histórico da conversa será limpo."
        );


        if (
            window.iniciarSessao
        ) {

            window.iniciarSessao();

        }


        // ==================================================
        // STATUS
        // ==================================================

        this.atualizarStatus(
            "waiting",
            "💤",
            'Diga "Ralf" para começar'
        );


        console.log(
            "💤 Aguardando nova palavra: Ralf"
        );


        // ==================================================
        // VOLTAR A OUVIR
        // ==================================================

        if (
            !this.isListening
        ) {

            this.start();

        }

    }


    // ==================================================
    // VERIFICAR SE CONVERSA ESTÁ ATIVA
    // ==================================================

    isConversationActive() {

        return this.conversaAtiva;

    }


    // ==================================================
    // CALLBACK DE TEXTO
    // ==================================================

    onText(
        callback
    ) {

        this.onResult =
            callback;

    }


    // ==================================================
    // CALLBACK DE STATUS
    // ==================================================

    onStatusChangeCallback(
        callback
    ) {

        this.onStatusChange =
            callback;

    }

}