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
        // CONTROLE DO CICLO
        // ==================================================

        /*
         * Indica que queremos iniciar outro ciclo
         * de reconhecimento assim que o atual terminar.
         */

        this.deveContinuarOuvindo =
            false;


        /*
         * Indica que o reconhecimento foi parado
         * manualmente porque o HALF vai processar/falar.
         */

        this.paradaManual =
            false;


        /*
         * Indica que o usuário acabou de falar e
         * estamos esperando o Robot terminar.
         */

        this.processandoResposta =
            false;


        /*
         * Evita chamadas duplicadas de start().
         */

        this.startPendente =
            false;


        /*
         * Timer utilizado para iniciar um novo ciclo.
         */

        this.timerStart =
            null;


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

                const resultado =
                    event.results[
                        event.results.length - 1
                    ];


                if (
                    !resultado ||
                    !resultado[0]
                ) {

                    return;

                }


                const texto =
                    resultado[0].transcript
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


                        /*
                         * O ciclo atual vai terminar naturalmente.
                         * O onend cuidará de iniciar outro.
                         */

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


                    /*
                     * O usuário acabou de ativar o HALF.
                     * A partir daqui, ele não precisa mais falar
                     * "Ralf" durante essa conversa.
                     */


                    const pergunta =
                        this.removerPalavraAtivacao(
                            texto
                        );


                    // ==================================================
                    // USUÁRIO DISSE APENAS "RALF"
                    // ==================================================

                    if (!pergunta) {

                        console.log(
                            "🤖 Ralf ativado."
                        );


                        console.log(
                            "🎤 Aguardando pergunta..."
                        );


                        /*
                         * Ainda estamos em um ciclo de reconhecimento.
                         * O onend vai iniciar o próximo.
                         */

                        this.deveContinuarOuvindo =
                            true;


                        this.paradaManual =
                            false;


                        this.processandoResposta =
                            false;


                        this.resetarTimerInatividade();


                        this.atualizarStatus(
                            "listening",
                            "🟢",
                            "Pode falar..."
                        );


                        return;

                    }


                    // ==================================================
                    // RALF + PERGUNTA NA MESMA FRASE
                    // ==================================================

                    console.log(
                        "🧠 Pergunta inicial detectada:"
                    );


                    console.log(
                        pergunta
                    );


                    /*
                     * NÃO inicia outro reconhecimento agora.
                     *
                     * O main.js vai parar o reconhecimento,
                     * enviar a pergunta para o Robot e esperar
                     * o HALF terminar de falar.
                     */

                    this.deveContinuarOuvindo =
                        false;


                    this.processandoResposta =
                        true;


                    this.paradaManual =
                        true;


                    this.limparTimerInatividade();


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


                /*
                 * O usuário falou.
                 *
                 * A partir deste momento:
                 *
                 * reconhecimento
                 *       ↓
                 * processamento
                 *       ↓
                 * resposta
                 *       ↓
                 * novo reconhecimento
                 */


                this.deveContinuarOuvindo =
                    false;


                this.processandoResposta =
                    true;


                this.paradaManual =
                    true;


                /*
                 * O timer NÃO deve continuar contando
                 * enquanto o HALF está processando a pergunta.
                 */

                this.limparTimerInatividade();


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


                // ==================================================
                // NO-SPEECH
                // ==================================================

                if (
                    event.error ===
                    "no-speech"
                ) {

                    console.log(
                        "🎤 Nenhuma fala detectada."
                    );


                    /*
                     * Se estamos apenas esperando Ralf,
                     * o reconhecimento deve voltar sozinho.
                     */

                    if (
                        !this.conversaAtiva
                    ) {

                        this.deveContinuarOuvindo =
                            true;

                    }


                    /*
                     * Se estamos em uma conversa ativa
                     * e não estamos processando uma resposta,
                     * também devemos continuar ouvindo.
                     */

                    else if (
                        !this.processandoResposta
                    ) {

                        this.deveContinuarOuvindo =
                            true;

                    }


                    return;

                }


                // ==================================================
                // ABORTED
                // ==================================================

                if (
                    event.error ===
                    "aborted"
                ) {

                    console.log(
                        "🎤 Reconhecimento interrompido."
                    );


                    return;

                }


                // ==================================================
                // OUTROS ERROS
                // ==================================================

                console.error(
                    "❌ Erro inesperado no reconhecimento:",
                    event.error
                );

            };


        // ==================================================
        // RECONHECIMENTO TERMINOU
        // ==================================================

        this.recognition.onend =
            () => {

                /*
                 * Somente agora o navegador confirmou
                 * que o reconhecimento realmente terminou.
                 */

                this.isListening =
                    false;


                console.log(
                    "🎤 Ciclo do microfone encerrado."
                );


                // ==================================================
                // SE ESTÁ PROCESSANDO
                // ==================================================

                if (
                    this.processandoResposta
                ) {

                    console.log(
                        "🧠 HALF está processando. Não reiniciar microfone."
                    );


                    return;

                }


                // ==================================================
                // SE FOI PARADA MANUAL
                // ==================================================

                if (
                    this.paradaManual
                ) {

                    console.log(
                        "🛑 Reconhecimento parado manualmente."
                    );


                    return;

                }


                // ==================================================
                // CONTINUAR OUVINDO
                // ==================================================

                if (
                    this.deveContinuarOuvindo
                ) {

                    this.agendarInicio();

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
    // AGENDAR NOVO CICLO
    // ==================================================

    agendarInicio() {

        /*
         * Evita criar vários timers de start.
         */

        if (
            this.timerStart
        ) {

            return;

        }


        /*
         * Se não devemos ouvir, não fazemos nada.
         */

        if (
            !this.deveContinuarOuvindo
        ) {

            return;

        }


        /*
         * Nunca inicia enquanto o HALF estiver processando.
         */

        if (
            this.processandoResposta
        ) {

            return;

        }


        /*
         * Pequeno intervalo para permitir que o navegador
         * finalize completamente o ciclo anterior.
         */

        console.log(
            "🎤 Preparando próximo ciclo..."
        );


        this.timerStart =
            setTimeout(
                () => {

                    this.timerStart =
                        null;


                    if (
                        !this.deveContinuarOuvindo
                    ) {

                        return;

                    }


                    if (
                        this.processandoResposta
                    ) {

                        return;

                    }


                    if (
                        this.isListening
                    ) {

                        console.log(
                            "🎤 Já está ouvindo. Nenhum novo start necessário."
                        );


                        return;

                    }


                    this.start();

                },

                300

            );

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


        // ==================================================
        // NÃO INICIAR SE JÁ ESTIVER OUVINDO
        // ==================================================

        if (
            this.isListening
        ) {

            console.log(
                "🎤 Microfone já está ativo."
            );


            return;

        }


        // ==================================================
        // NÃO INICIAR DURANTE PROCESSAMENTO
        // ==================================================

        if (
            this.processandoResposta
        ) {

            console.log(
                "🧠 HALF ainda está processando. Start ignorado."
            );


            return;

        }


        // ==================================================
        // LIMPAR TIMER DE START
        // ==================================================

        if (
            this.timerStart
        ) {

            clearTimeout(
                this.timerStart
            );

            this.timerStart =
                null;

        }


        try {

            this.paradaManual =
                false;


            /*
             * Só marcamos como ouvindo antes do start.
             *
             * Se o navegador lançar erro, voltamos para false.
             */

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


            /*
             * InvalidStateError geralmente significa que o
             * navegador ainda considera o reconhecimento ativo.
             *
             * Nesse caso esperamos um pouco e tentamos novamente.
             */

            if (
                erro.name ===
                "InvalidStateError"
            ) {

                console.log(
                    "⏳ Navegador ainda está encerrando o reconhecimento. Tentando novamente..."
                );


                this.agendarInicio();

            }

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


        /*
         * IMPORTANTE:
         *
         * NÃO colocamos isListening = false aqui.
         *
         * O reconhecimento ainda pode estar ativo.
         *
         * Somente o evento onend confirma que ele terminou.
         */

        this.paradaManual =
            true;


        this.deveContinuarOuvindo =
            false;


        this.limparTimerInatividade();


        /*
         * Cancela eventual tentativa de iniciar outro ciclo.
         */

        if (
            this.timerStart
        ) {

            clearTimeout(
                this.timerStart
            );

            this.timerStart =
                null;

        }


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
    // LIMPAR TIMER DE INATIVIDADE
    // ==================================================

    limparTimerInatividade() {

        if (
            this.timerInatividade
        ) {

            clearTimeout(
                this.timerInatividade
            );

        }


        this.timerInatividade =
            null;

    }


    // ==================================================
    // RENOVAR TIMER DE INATIVIDADE
    // ==================================================

    resetarTimerInatividade() {

        this.limparTimerInatividade();


        // ==================================================
        // SÓ EXISTE TIMER DURANTE CONVERSA ATIVA
        // ==================================================

        if (
            !this.conversaAtiva
        ) {

            return;

        }


        // ==================================================
        // NÃO CONTAR DURANTE PROCESSAMENTO
        // ==================================================

        if (
            this.processandoResposta
        ) {

            return;

        }


        console.log(
            "⏱️ Timer de inatividade renovado."
        );


        this.timerInatividade =
            setTimeout(
                () => {

                    /*
                     * Segurança:
                     *
                     * Se o HALF estiver processando ou falando,
                     * não encerramos a conversa.
                     */

                    if (
                        this.processandoResposta
                    ) {

                        return;

                    }


                    this.encerrarConversa();

                },

                this.tempoInatividade

            );

    }


    // ==================================================
    // CONTINUAR CONVERSA
    // ==================================================

    continuarConversa() {

        /*
         * Este método é chamado pelo main.js
         * somente depois que o Robot terminou de responder.
         */


        // ==================================================
        // VERIFICAR CONVERSA
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
            "================================="
        );


        console.log(
            "🟢 HALF terminou de falar."
        );


        console.log(
            "🎤 Preparando para ouvir novamente..."
        );


        // ==================================================
        // LIBERAR PROCESSAMENTO
        // ==================================================

        this.processandoResposta =
            false;


        this.paradaManual =
            false;


        this.deveContinuarOuvindo =
            true;


        // ==================================================
        // RENOVAR TIMER
        // ==================================================

        this.resetarTimerInatividade();


        // ==================================================
        // STATUS
        // ==================================================

        this.atualizarStatus(
            "listening",
            "🟢",
            "Pode continuar falando..."
        );


        /*
         * Se o reconhecimento anterior ainda estiver
         * encerrando, NÃO damos start agora.
         *
         * O onend vai perceber que devemos continuar
         * e chamará agendarInicio().
         */

        if (
            this.isListening
        ) {

            console.log(
                "⏳ Reconhecimento anterior ainda está encerrando."
            );


            console.log(
                "🎤 O próximo ciclo será iniciado pelo onend."
            );


            return;

        }


        /*
         * Se já terminou, podemos iniciar o próximo ciclo.
         */

        this.agendarInicio();

    }


    // ==================================================
    // ENCERRAR CONVERSA
    // ==================================================

    encerrarConversa() {

        console.log(
            "================================="
        );


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


        this.processandoResposta =
            false;


        this.deveContinuarOuvindo =
            true;


        // ==================================================
        // CANCELAR TIMER
        // ==================================================

        this.limparTimerInatividade();


        // ==================================================
        // LIMPAR TIMER DE START
        // ==================================================

        if (
            this.timerStart
        ) {

            clearTimeout(
                this.timerStart
            );

            this.timerStart =
                null;

        }


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


        /*
         * Se o reconhecimento estiver ativo,
         * pedimos para ele parar.
         *
         * O onend será responsável por iniciar
         * novamente no modo de espera.
         */

        if (
            this.isListening
        ) {

            this.paradaManual =
                false;


            try {

                this.recognition.stop();

            } catch (
                erro
            ) {

                console.error(
                    "❌ Erro ao encerrar reconhecimento:",
                    erro
                );

            }


            return;

        }


        // ==================================================
        // SE JÁ ESTIVER PARADO
        // ==================================================

        this.agendarInicio();

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