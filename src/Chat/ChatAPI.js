const API_URL =
    "http://localhost:3000";


// ======================================================
// FAZER UMA PERGUNTA PARA O HALF
// ======================================================

export async function perguntar(
    mensagem
) {

    // ==================================================
    // VALIDAR MENSAGEM
    // ==================================================

    if (
        typeof mensagem !== "string" ||
        !mensagem.trim()
    ) {

        throw new Error(
            "A mensagem enviada para a API está vazia ou inválida."
        );

    }


    console.log(
        "📡 Enviando mensagem para:",
        `${API_URL}/chat`
    );


    console.log(
        "📤 Mensagem:",
        mensagem
    );


    try {

        const response =
            await fetch(
                `${API_URL}/chat`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            message:
                                mensagem.trim()

                        })

                }
            );


        // ==================================================
        // TENTAR LER RESPOSTA
        // ==================================================

        let data;


        try {

            data =
                await response.json();

        } catch (
            erro
        ) {

            console.error(
                "❌ O servidor não retornou um JSON válido."
            );


            throw new Error(
                `Servidor retornou uma resposta inválida. HTTP ${response.status}.`
            );

        }


        // ==================================================
        // VERIFICAR STATUS HTTP
        // ==================================================

        if (
            !response.ok
        ) {

            console.error(
                "❌ Erro da API:",
                data
            );


            throw new Error(
                data.error ||
                `Erro HTTP ${response.status}.`
            );

        }


        // ==================================================
        // VERIFICAR RESPOSTA
        // ==================================================

        if (
            !data ||
            typeof data.response !== "string"
        ) {

            console.error(
                "❌ Resposta da API não possui o campo 'response':",
                data
            );


            throw new Error(
                "A API não retornou uma resposta válida do HALF."
            );

        }


        console.log(
            "📥 Resposta recebida da API:"
        );


        console.log(
            data.response
        );


        // ==================================================
        // RETORNAR RESPOSTA
        // ==================================================

        return data.response;


    } catch (
        erro
    ) {

        console.error(
            "❌ Erro ao comunicar com o backend:",
            erro
        );


        throw erro;

    }

}


// ======================================================
// INICIAR UMA NOVA SESSÃO
// ======================================================

export async function iniciarSessao() {

    console.log(
        "🧹 Iniciando nova sessão..."
    );


    try {

        const response =
            await fetch(
                `${API_URL}/session/start`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    }

                }
            );


        // ==================================================
        // LER RESPOSTA
        // ==================================================

        let data;


        try {

            data =
                await response.json();

        } catch (
            erro
        ) {

            throw new Error(
                `Servidor retornou uma resposta inválida ao iniciar sessão. HTTP ${response.status}.`
            );

        }


        // ==================================================
        // VERIFICAR ERRO
        // ==================================================

        if (
            !response.ok
        ) {

            console.error(
                "❌ Erro ao iniciar sessão:",
                data
            );


            throw new Error(
                data.error ||
                `Erro HTTP ${response.status}.`
            );

        }


        console.log(
            "🆕 Nova sessão iniciada!"
        );


        console.log(
            data
        );


        return data;


    } catch (
        erro
    ) {

        console.error(
            "❌ Erro ao iniciar nova sessão:",
            erro
        );


        throw erro;

    }

}