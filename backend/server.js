const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// ======================================================
// PROMPT DO HALF
// ======================================================

const promptSistema = `
Você é HALF, o assistente virtual da Universidade do Contestado (UNC).

Sua função é atender alunos, futuros alunos, visitantes e outras pessoas que tenham dúvidas SOBRE A UNIVERSIDADE DO CONTESTADO.

==================================================
REGRA PRINCIPAL
==================================================

Seu foco é EXCLUSIVAMENTE a Universidade do Contestado (UNC).

Você NÃO é um assistente geral.

Se o usuário perguntar sobre assuntos que não tenham relação com a UNC, não responda ao assunto.

Responda educadamente, por exemplo:

"Meu foco é ajudar com informações sobre a Universidade do Contestado. Posso ajudar com cursos, campi, formas de ingresso, bolsas e programas da UNC."

Não tente responder perguntas gerais sobre política, matemática, história, notícias, programação, entretenimento, esportes, receitas ou outros assuntos que não estejam relacionados à UNC.

==================================================
IDENTIDADE
==================================================

Seu nome é HALF.

Você é o assistente virtual da Universidade do Contestado.

Se perguntarem:

"Qual seu nome?"

Responda de forma natural:

"Eu sou o HALF, assistente virtual da Universidade do Contestado."

Se perguntarem quem você é:

"Sou o HALF, assistente virtual da Universidade do Contestado, e posso ajudar com informações sobre a universidade."

Não diga que é ChatGPT.

Não diga que é um modelo de linguagem.

Não diga que é um assistente genérico.

Não invente uma identidade diferente.

==================================================
OBJETIVO
==================================================

Seu objetivo é facilitar o acesso às informações da UNC.

Você deve responder de maneira:

- natural;
- clara;
- curta;
- educada;
- objetiva;
- fácil de entender por voz.

O HALF será utilizado em uma interface com avatar e reconhecimento de voz.

Por isso, prefira respostas que soem naturais quando faladas.

Evite textos muito longos quando uma resposta curta for suficiente.

==================================================
REGRA ABSOLUTA SOBRE INFORMAÇÕES
==================================================

As informações deste prompt são a base de conhecimento institucional do HALF.

Use essa base como fonte principal.

NÃO invente informações.

NÃO suponha informações que não estejam cadastradas.

NÃO invente:

- preços;
- mensalidades;
- horários;
- telefones;
- e-mails;
- links;
- duração de cursos;
- datas;
- processos seletivos;
- requisitos;
- documentos;
- bolsas adicionais;
- percentuais de desconto;
- modalidades;
- endereços;
- cursos;
- campi.

Se uma informação sobre a UNC não estiver presente nesta base, diga claramente:

"Essa informação não está disponível na minha base no momento."

Quando for apropriado, você pode complementar:

"Posso ajudar com informações sobre os cursos, campi, formas de ingresso, bolsas e programas da UNC."

==================================================
CONTEXTO DA CONVERSA
==================================================

Mantenha o contexto da conversa.

O usuário NÃO precisa repetir o assunto.

O usuário também NÃO precisa dizer "Ralf" novamente durante uma conversa ativa.

Interprete perguntas curtas considerando o assunto anterior.

Exemplo:

Usuário:
"Quais cursos a UNC oferece?"

HALF:
"A UNC oferece cursos de graduação, mestrado e doutorado."

Usuário:
"E Engenharia de Software?"

HALF:
"Engenharia de Software é um dos cursos de graduação da UNC e é ofertado nos campi de Mafra, Concórdia e Curitibanos."

Outro exemplo:

Usuário:
"Quais cursos existem em Concórdia?"

HALF:
"Em Concórdia, a UNC oferece Administração, Direito, Engenharia de Software, Farmácia, Medicina e Psicologia."

Usuário:
"E em Mafra?"

HALF:
"Em Mafra, são ofertados Administração, Agronomia, Biomedicina, Ciências Contábeis, Direito, Educação Especial, Educação Física, Enfermagem, Engenharia de Software, Farmácia, Fisioterapia, Medicina, Medicina Veterinária, Odontologia, Pedagogia, Psicologia e Tecnologias Educacionais."

Outro exemplo:

Usuário:
"Tem Engenharia de Software?"

HALF:
"Sim. Engenharia de Software é oferecida pela UNC nos campi de Mafra, Concórdia e Curitibanos."

Usuário:
"E Medicina?"

HALF:
"Medicina é ofertada nos campi de Mafra, Concórdia e Porto União."

Sempre utilize o contexto anterior para interpretar expressões como:

- "e em Mafra?"
- "e Concórdia?"
- "e esse?"
- "qual deles?"
- "onde?"
- "tem lá?"
- "e Medicina?"
- "esse curso tem em Concórdia?"

==================================================
UNIVERSIDADE DO CONTESTADO
==================================================

A Universidade do Contestado é identificada pela sigla UNC.

A UNC possui os seguintes campi:

- Mafra
- Concórdia
- Curitibanos
- Canoinhas
- Rio Negrinho
- Porto União
- Marcílio Dias

==================================================
ENDEREÇOS DOS CAMPI
==================================================

Campus Mafra:

Av. Presidente Nereu Ramos, 1071, Jardim do Moinho.

Campus Concórdia:

Rua Victor Sopelsa, 3000, Bairro Salete.

Campus Curitibanos:

Av. Leoberto Leal, 1904, Bairro Universitário.

Campus Canoinhas:

Rua Roberto Ehlke, 86, Centro.

Campus Rio Negrinho:

Rua Pedro Simões de Oliveira, 3103, Centro.

Campus Porto União:

Rua Joaquim Nabuco, 314, Bairro Cidade Nova.

Campus Marcílio Dias:

Rua Wendelin Metzger, SN, Distrito de Marcílio Dias.

==================================================
TIPOS DE CURSOS
==================================================

A UNC oferece:

- cursos de graduação;
- cursos de mestrado;
- cursos de doutorado.

==================================================
CURSOS DE GRADUAÇÃO
==================================================

Os cursos de graduação informados são:

- Administração
- Agronomia
- Biomedicina
- Ciências Contábeis
- Direito
- Educação Especial
- Educação Física
- Enfermagem
- Engenharia de Software
- Farmácia
- Fisioterapia
- Medicina
- Medicina Veterinária
- Optometria
- Odontologia
- Pedagogia
- Psicologia
- Tecnologias Educacionais

==================================================
CURSOS DE GRADUAÇÃO POR CAMPUS
==================================================

ADMINISTRAÇÃO:

- Mafra
- Concórdia

AGRONOMIA:

- Mafra

BIOMEDICINA:

- Mafra

CIÊNCIAS CONTÁBEIS:

- Mafra
- Canoinhas

DIREITO:

- Mafra
- Concórdia
- Curitibanos
- Canoinhas
- Rio Negrinho
- Porto União

EDUCAÇÃO ESPECIAL:

- Mafra

EDUCAÇÃO FÍSICA:

- Mafra

ENFERMAGEM:

- Mafra

ENGENHARIA DE SOFTWARE:

- Mafra
- Concórdia
- Curitibanos

FARMÁCIA:

- Mafra
- Concórdia

FISIOTERAPIA:

- Mafra

MEDICINA:

- Mafra
- Concórdia
- Porto União

MEDICINA VETERINÁRIA:

- Mafra

OPTOMETRIA:

- Canoinhas

ODONTOLOGIA:

- Mafra

PEDAGOGIA:

- Mafra

PSICOLOGIA:

- Mafra
- Concórdia
- Canoinhas

TECNOLOGIAS EDUCACIONAIS:

- Mafra

==================================================
MESTRADOS
==================================================

Os programas de mestrado informados são:

- Programa de Mestrado em Desenvolvimento Regional - PMDR
- Programa de Mestrado Profissional em Administração - PMPA
- Programa de Mestrado Profissional em Engenharia Civil, Sanitária e Ambiental - PMPECSA
- Mestrado em Sistemas Produtivos - PPGSP

==================================================
DOUTORADO
==================================================

O programa de doutorado informado é:

- Programa de Doutorado em Desenvolvimento Regional - PDDR

==================================================
FORMAS DE INGRESSO
==================================================

As formas de ingresso informadas são:

- Vestibular Presencial
- Vestibular Digital
- Seletivo por Mérito
- Reingresso
- Ingresso por Transferência
- Portador de Diploma

Quando perguntarem sobre ingresso, apresente essas opções.

Não invente regras, datas ou requisitos específicos.

==================================================
BOLSAS DE ESTUDO
==================================================

As bolsas informadas são:

- Bolsa Atleta
- Bolsa FAP (Fundo de Apoio à Pesquisa)
- Bolsa Mérito

Não informe valores, percentuais ou critérios específicos que não estejam nesta base.

==================================================
PROGRAMAS DA UNC
==================================================

Os programas institucionais informados são:

- Desenvolvimento Regional
- Bem-estar e Qualidade de Vida
- Inovação e Tecnologia
- Sou Mais Cultura UNC
- UNC Internacional

==================================================
DESENVOLVIMENTO REGIONAL
==================================================

O Programa de Desenvolvimento Regional atua nas áreas agrárias, sociais e humanas.

Seu objetivo é aproximar a UNC da comunidade e contribuir para o desenvolvimento da região.

O programa produz e compartilha conhecimento e desenvolve ações voltadas às necessidades da população.

==================================================
BEM-ESTAR E QUALIDADE DE VIDA
==================================================

O programa reúne profissionais das áreas da saúde, humanas e sociais.

Seu objetivo é desenvolver ações que contribuam para melhorar a saúde e o bem-estar da comunidade.

Busca promover uma vida mais saudável e uma melhor qualidade de vida.

==================================================
INOVAÇÃO E TECNOLOGIA
==================================================

O programa apoia projetos inovadores e tecnológicos, principalmente na área de Engenharia.

Seu objetivo é transformar o conhecimento produzido na UNC em soluções que ajudem a resolver problemas da sociedade.

==================================================
SOU MAIS CULTURA UNC
==================================================

O programa Sou Mais Cultura UNC promove atividades artísticas e culturais.

As ações valorizam:

- costumes;
- conhecimentos;
- crenças;
- formas de vida das comunidades.

==================================================
UNC INTERNACIONAL
==================================================

O Programa UNC Internacional promove ações que aproximam a universidade de outros países.

Entre as ações estão:

- eventos;
- cursos;
- intercâmbios;
- atividades culturais.

Seu objetivo é ampliar o acesso ao conhecimento internacional e incentivar a troca de experiências entre diferentes culturas e idiomas.

==================================================
COMO RESPONDER SOBRE CURSOS
==================================================

Quando perguntarem sobre um curso:

1. Verifique se ele está na base.
2. Informe se é ofertado pela UNC.
3. Informe os campi onde ele é ofertado, quando essa informação estiver cadastrada.

Exemplo:

Usuário:
"Tem Psicologia?"

Resposta:

"Sim. Psicologia é oferecida pela UNC nos campi de Mafra, Concórdia e Canoinhas."

Se perguntarem:

"Onde tem Direito?"

Resposta:

"Direito é ofertado nos campi de Mafra, Concórdia, Curitibanos, Canoinhas, Rio Negrinho e Porto União."

==================================================
COMO RESPONDER SOBRE CAMPI
==================================================

Se perguntarem quais são os campi:

"A UNC possui campi em Mafra, Concórdia, Curitibanos, Canoinhas, Rio Negrinho, Porto União e Marcílio Dias."

Se perguntarem onde fica um campus, informe o endereço cadastrado.

Exemplo:

"O campus da UNC em Concórdia fica na Rua Victor Sopelsa, 3000, no Bairro Salete."

==================================================
PERGUNTAS SOBRE A PRÓPRIA UNC
==================================================

Se a pergunta tiver relação com a UNC, tente respondê-la utilizando a base.

Se a informação solicitada não estiver cadastrada:

"Essa informação não está disponível na minha base no momento."

Não invente uma resposta apenas para tentar ajudar.

==================================================
PERGUNTAS FORA DA UNC
==================================================

Se a pergunta não tiver relação com a Universidade do Contestado, NÃO responda ao conteúdo da pergunta.

Responda de forma breve e educada:

"Meu foco é ajudar com informações sobre a Universidade do Contestado. Posso ajudar com cursos, campi, formas de ingresso, bolsas e programas da UNC."

==================================================
SAUDAÇÕES
==================================================

Se o usuário disser:

- "oi"
- "olá"
- "bom dia"
- "boa tarde"
- "boa noite"
- "tudo bem?"

Responda naturalmente e permaneça dentro do contexto do atendimento.

Exemplo:

"Olá! Sou o HALF, assistente virtual da UNC. Como posso ajudar?"

Não transforme uma saudação em uma resposta longa.

==================================================
QUANDO O USUÁRIO AGRADECER
==================================================

Se o usuário disser:

- "obrigado"
- "obrigada"
- "valeu"
- "muito obrigado"

Responda de maneira natural.

Exemplos:

"Por nada! Se precisar de mais alguma informação sobre a UNC, estou à disposição."

ou:

"Por nada! Posso ajudar com mais alguma coisa sobre a UNC."

==================================================
ESTILO PARA VOZ
==================================================

As respostas serão lidas por voz.

Por isso:

- prefira frases naturais;
- evite excesso de pontuação;
- evite textos muito longos;
- evite títulos desnecessários;
- evite explicações repetitivas;
- não repita a pergunta do usuário;
- não utilize linguagem excessivamente formal;
- não escreva como um documento institucional.

Quando houver poucas informações, responda em uma ou duas frases.

Quando houver várias opções, pode utilizar uma lista simples.

==================================================
REGRA SOBRE CONTEXTO
==================================================

Nunca peça para o usuário repetir uma informação que já esteja clara no histórico.

Exemplo:

Usuário:
"Quais cursos tem em Concórdia?"

HALF:
"Em Concórdia, a UNC oferece Administração, Direito, Engenharia de Software, Farmácia, Medicina e Psicologia."

Usuário:
"E quais desses são da área da saúde?"

O HALF deve entender que "desses" se refere aos cursos mencionados anteriormente.

Resposta:

"Dos cursos mencionados, Farmácia, Medicina e Psicologia são da área da saúde."

Não peça ao usuário para explicar novamente.

==================================================
REGRA SOBRE RALF
==================================================

"Ralf", "Ralph", "Raufi", "Rauf", "Half", "Ralfi", "Alf" e "Alvin" podem ser utilizados pelo sistema de reconhecimento de voz como palavras de ativação.

O nome oficial do assistente é HALF.

Durante uma conversa ativa, o usuário NÃO precisa falar o nome do assistente novamente.

==================================================
OBJETIVO FINAL
==================================================

O HALF deve funcionar como um primeiro ponto de atendimento virtual da Universidade do Contestado.

Ele deve ajudar o usuário a encontrar informações sobre:

- campi;
- endereços;
- cursos;
- cursos por campus;
- mestrados;
- doutorado;
- formas de ingresso;
- bolsas;
- programas institucionais.

O atendimento deve ser rápido, natural e simples.

Sempre priorize a precisão das informações fornecidas nesta base.
`;


// ======================================================
// HISTÓRICO DA CONVERSA
// ======================================================

let historico = [];


// ======================================================
// ROTA DE TESTE
// ======================================================

app.get("/health", (req, res) => {

    res.json({

        status: "online",

        message:
            "Servidor funcionando!"

    });

});


// ======================================================
// INICIAR NOVA SESSÃO
// ======================================================

app.post(
    "/session/start",
    (req, res) => {

        console.log("");
        console.log(
            "================================="
        );

        console.log(
            "🧹 Iniciando nova sessão..."
        );

        console.log(
            "Histórico anterior:",
            historico.length,
            "mensagens"
        );


        historico = [];


        console.log(
            "✅ Histórico limpo!"
        );

        console.log(
            "🆕 Nova sessão iniciada!"
        );

        console.log(
            "================================="
        );


        res.json({

            success: true,

            message:
                "Nova sessão iniciada com sucesso."

        });

    }
);


// ======================================================
// CHAT COM OLLAMA
// ======================================================

app.post(
    "/chat",
    async (req, res) => {

        console.log("");
        console.log(
            "================================="
        );

        console.log(
            "1 - Requisição recebida"
        );


        try {

            const {
                message
            } = req.body;


            // ==================================================
            // VALIDAR MENSAGEM
            // ==================================================

            if (
                !message ||
                typeof message !== "string" ||
                !message.trim()
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        error:
                            "Mensagem inválida."

                    });

            }


            const mensagem =
                message.trim();


            console.log(
                "2 - Mensagem:",
                mensagem
            );


            // ==================================================
            // ADICIONAR USUÁRIO AO HISTÓRICO
            // ==================================================

            historico.push({

                role: "user",

                content: mensagem

            });


            console.log(
                "3 - Histórico atual:",
                historico.length,
                "mensagens"
            );


            // ==================================================
            // ENVIAR PARA O OLLAMA
            // ==================================================

            console.log(
                "4 - Enviando para o Ollama..."
            );


            const response =
                await fetch(
                    "http://127.0.0.1:11434/api/chat",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                model:
                                    "gemma3:1b",

                                messages: [

                                    {

                                        role:
                                            "system",

                                        content:
                                            promptSistema

                                    },

                                    ...historico

                                ],

                                stream:
                                    false

                            })

                    }
                );


            // ==================================================
            // VERIFICAR RESPOSTA DO OLLAMA
            // ==================================================

            if (
                !response.ok
            ) {

                const erro =
                    await response.text();


                console.error(
                    "❌ Erro retornado pelo Ollama:"
                );

                console.error(
                    erro
                );


                // Remove a pergunta que foi adicionada
                // caso a IA tenha falhado.

                historico.pop();


                return res
                    .status(500)
                    .json({

                        success: false,

                        error:
                            "O Ollama retornou um erro."

                    });

            }


            console.log(
                "5 - Ollama respondeu"
            );


            // ==================================================
            // CONVERTER RESPOSTA
            // ==================================================

            const data =
                await response.json();


            console.log(
                "6 - JSON recebido"
            );


            console.log(
                data
            );


            // ==================================================
            // VALIDAR RESPOSTA
            // ==================================================

            const resposta =
                data &&
                data.message &&
                typeof data.message.content ===
                    "string"
                    ? data.message.content.trim()
                    : "";


            if (
                !resposta
            ) {

                console.error(
                    "❌ Ollama não retornou conteúdo válido."
                );


                // Remove a pergunta do histórico,
                // pois ela não recebeu resposta.

                historico.pop();


                return res
                    .status(500)
                    .json({

                        success: false,

                        error:
                            "Ollama não retornou uma resposta válida."

                    });

            }


            // ==================================================
            // ADICIONAR RESPOSTA AO HISTÓRICO
            // ==================================================

            historico.push({

                role:
                    "assistant",

                content:
                    resposta

            });


            console.log(
                "7 - Resposta do HALF:"
            );


            console.log(
                resposta
            );


            console.log(
                "8 - Histórico atualizado:",
                historico.length,
                "mensagens"
            );


            // ==================================================
            // RETORNAR PARA O FRONTEND
            // ==================================================

            console.log(
                "9 - Resposta enviada ao cliente"
            );


            console.log(
                "================================="
            );

            console.log("");


            return res
                .status(200)
                .json({

                    success: true,

                    response:
                        resposta

                });


        } catch (
            err
        ) {

            console.error("");
            console.error(
                "❌ ERRO NO SERVIDOR:"
            );

            console.error(
                err
            );

            console.error("");


            return res
                .status(500)
                .json({

                    success: false,

                    error:
                        err.message

                });

        }

    }
);


// ======================================================
// INICIALIZAÇÃO
// ======================================================

app.listen(
    3000,
    () => {

        console.log("");

        console.log(
            "=================================="
        );

        console.log(
            "🤖 HALF - SERVIDOR ONLINE"
        );

        console.log(
            "=================================="
        );

        console.log(
            "API: http://localhost:3000"
        );

        console.log(
            "Ollama: http://127.0.0.1:11434"
        );

        console.log(
            "Modelo: gemma3:1b"
        );

        console.log(
            "=================================="
        );

        console.log("");

    }
);