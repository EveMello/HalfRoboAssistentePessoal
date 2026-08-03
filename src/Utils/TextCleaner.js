export function limparTexto(texto) {

    return texto

        // Markdown
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/__/g, "")
        .replace(/`/g, "")

        // Emojis (remove praticamente todos)
        .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")

        // Quebras de linha
        .replace(/\n/g, " ")

        // Espaços repetidos
        .replace(/\s+/g, " ")

        .trim();

}