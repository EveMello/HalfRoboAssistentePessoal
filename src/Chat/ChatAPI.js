const API_URL = "http://localhost:3000";


// ======================================================
// Fazer uma pergunta para o Raufi
// ======================================================

export async function perguntar(mensagem) {

    const response = await fetch(`${API_URL}/chat`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            message: mensagem

        })

    });

    const data = await response.json();

    return data.response;

}


// ======================================================
// Iniciar uma nova sessão
// ======================================================

export async function iniciarSessao() {

    console.log("🧹 Iniciando nova sessão...");

    const response = await fetch(`${API_URL}/session/start`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        }

    });

    const data = await response.json();

    console.log("🆕 Nova sessão iniciada!");

    return data;

}