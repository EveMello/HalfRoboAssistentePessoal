import './style.css'

import * as THREE from 'three'

import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js'

import {
    VRMLoaderPlugin
} from '@pixiv/three-vrm'


import {
    iniciarSessao
} from './Chat/ChatAPI'


import Avatar
    from './Avatar/Avatar'


import {
    Robot
} from './Robot/Robot'


import SpeechRecognitionManager
    from './Speech/SpeechRecognition'


// ==================================================
// ELEMENTOS DA INTERFACE
// ==================================================

const statusIcon =
    document.getElementById(
        "status-icon"
    )


const statusText =
    document.getElementById(
        "status-text"
    )


// ==================================================
// ATUALIZAR STATUS
// ==================================================

function atualizarStatus(
    icone,
    texto
) {

    if (
        statusIcon
    ) {

        statusIcon.textContent =
            icone

    }


    if (
        statusText
    ) {

        statusText.textContent =
            texto

    }


    console.log(
        "📺 Status:",
        texto
    )

}


// ==================================================
// STATUS INICIAL
// ==================================================

atualizarStatus(
    "💤",
    'Diga "Ralf" para começar'
)


// ==================================================
// CENA
// ==================================================

const scene =
    new THREE.Scene()


scene.background =
    new THREE.Color(
        0x1b1b1b
    )


// ==================================================
// CÂMERA
// ==================================================

const camera =
    new THREE.PerspectiveCamera(

        25,

        window.innerWidth /
        window.innerHeight,

        0.1,

        1000

    )


camera.position.set(
    0,
    1.45,
    0.65
)


camera.lookAt(
    0,
    1.45,
    0
)


// ==================================================
// RENDERER
// ==================================================

const renderer =
    new THREE.WebGLRenderer({

        antialias:
            true

    })


renderer.setSize(
    window.innerWidth,
    window.innerHeight
)


renderer.setPixelRatio(
    window.devicePixelRatio
)


const avatarContainer =
    document.getElementById(
        "avatar-container"
    )


avatarContainer.appendChild(
    renderer.domElement
)


// ==================================================
// LUZES
// ==================================================

const directional =
    new THREE.DirectionalLight(

        0xffffff,

        2

    )


directional.position.set(
    1,
    2,
    2
)


scene.add(
    directional
)


const ambient =
    new THREE.AmbientLight(

        0xffffff,

        1.5

    )


scene.add(
    ambient
)


// ==================================================
// VARIÁVEIS
// ==================================================

let avatar =
    null


let robot =
    null


let speech =
    null


// ==================================================
// LOADER VRM
// ==================================================

const loader =
    new GLTFLoader()


loader.register(

    (parser) =>
        new VRMLoaderPlugin(
            parser
        )

)


// ==================================================
// CARREGAR AVATAR
// ==================================================

loader.load(

    '/BotBunny.vrm',

    async (gltf) => {


        // ==================================================
        // VRM
        // ==================================================

        const vrm =
            gltf.userData.vrm


        scene.add(
            vrm.scene
        )


        vrm.scene.rotation.y =
            Math.PI


        // ==================================================
        // AVATAR
        // ==================================================

        avatar =
            new Avatar(
                vrm
            )


        // ==================================================
        // RECONHECIMENTO
        // ==================================================

        speech =
            new SpeechRecognitionManager()


        // ==================================================
        // CALLBACK DE STATUS
        // ==================================================

        speech.onStatusChangeCallback(

            (status) => {

                atualizarStatus(

                    status.icone,

                    status.texto

                )

            }

        )


        // ==================================================
        // ROBÔ
        // ==================================================

        robot =
            new Robot(

                avatar,

                speech

            )


        // ==================================================
        // QUANDO USUÁRIO FALAR
        // ==================================================

        speech.onText(

            async (texto) => {


                console.log(
                    "👤 Usuário:",
                    texto
                )


                // ==================================================
                // PARAR MICROFONE
                // ==================================================

                speech.stop()


                // ==================================================
                // STATUS THINKING
                // ==================================================

                atualizarStatus(
                    "🧠",
                    "Estou pensando..."
                )


                try {


                    // ==================================================
                    // ENVIAR PARA ROBÔ
                    // ==================================================

                    await robot.perguntar(
                        texto
                    )


                    console.log(
                        "✅ Resposta finalizada."
                    )


                    // ==================================================
                    // VERIFICAR SE CONVERSA CONTINUA
                    // ==================================================

                    if (
                        speech.isConversationActive()
                    ) {


                        console.log(
                            "🟢 Conversa continua ativa."
                        )


                        console.log(
                            "🎤 Voltando a ouvir..."
                        )


                        // ==================================================
                        // Continua conversa
                        // ==================================================

                        speech.continuarConversa()


                    } else {


                        console.log(
                            "💤 Conversa já foi encerrada."
                        )


                        atualizarStatus(
                            "💤",
                            'Diga "Ralf" para começar'
                        )

                    }


                } catch (
                    erro
                ) {


                    console.error(
                        "❌ Erro ao processar pergunta:",
                        erro
                    )


                    atualizarStatus(
                        "⚠️",
                        "Ocorreu um erro. Tente novamente."
                    )


                    // ==================================================
                    // EM CASO DE ERRO
                    // ==================================================

                    if (
                        speech.isConversationActive()
                    ) {


                        speech.continuarConversa()


                    } else {


                        atualizarStatus(
                            "💤",
                            'Diga "Ralf" para começar'
                        )

                    }

                }

            }

        )


        // ==================================================
        // DISPONIBILIZAR PARA TESTES
        // ==================================================

        window.avatar =
            avatar


        window.robot =
            robot


        window.speech =
            speech


        window.iniciarSessao =
            iniciarSessao


        // ==================================================
        // INICIAR SESSÃO
        // ==================================================

        await iniciarSessao()


        // ==================================================
        // STATUS INICIAL
        // ==================================================

        atualizarStatus(
            "💤",
            'Diga "Ralf" para começar'
        )


        // ==================================================
        // INICIAR MICROFONE
        // ==================================================

        speech.start()


        // ==================================================
        // LOGS
        // ==================================================

        console.log(
            "===================================="
        )


        console.log(
            "🤖 Avatar carregado!"
        )


        console.log(
            "🧠 Robô iniciado!"
        )


        console.log(
            "🎤 Microfone iniciado!"
        )


        console.log(
            "💤 Aguardando palavra: Ralf"
        )


        console.log(
            "===================================="

        )

    }

)


// ==================================================
// CLOCK
// ==================================================

const clock =
    new THREE.Clock()


// ==================================================
// LOOP DE ANIMAÇÃO
// ==================================================

function animate() {

    requestAnimationFrame(
        animate
    )


    const delta =
        clock.getDelta()


    if (
        avatar
    ) {

        avatar.update(
            delta
        )

    }


    renderer.render(
        scene,
        camera
    )

}


animate()


// ==================================================
// RESIZE
// ==================================================

window.addEventListener(

    "resize",

    () => {


        camera.aspect =
            window.innerWidth /
            window.innerHeight


        camera.updateProjectionMatrix()


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        )

    }

)