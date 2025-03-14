/***************************************
 * Sistema de Preloader Animado
 ***************************************/
window.addEventListener('load', () => {
    // Se não for usar o EmailJS, você pode comentar ou remover a chamada abaixo.
    // initEmailService();

    const preloader = document.getElementById('preloader');
    if (preloader) {
        const steps = [
            "INICIALIZANDO OPERAÇÃO STRIX", 
            "DECODIFICANDO MENSAGENS", 
            "CRIPTOGRAFANDO DADOS", 
            "ATIVANDO PROTOCOLOS"
        ];
        const stepElement = document.querySelector('.mission-steps');

        steps.forEach((step, index) => {
            setTimeout(() => {
                if(stepElement) {
                    stepElement.innerHTML = `
                        <span class="gold-text">${step}</span>
                        <span class="dot-animation">${'.'.repeat(index % 4)}</span>
                    `;
                }
            }, index * 800);
        });

        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 800);
        }, 4000);
    }
});

/***************************************
 * Sistema de Agentes e Sorteio (Derangement)
 ***************************************/
let agents = [];

/**
 * Realiza um shuffle do array garantindo que nenhum elemento permaneça na mesma posição.
 * @param {Array} array - Array a ser embaralhado.
 * @returns {Array} - Novo array embaralhado sem elementos na mesma posição original.
 */
function derangementShuffle(array) {
    let shuffled;
    do {
        shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
    } while (shuffled.some((el, idx) => el === array[idx]));
    
    return shuffled;
}

/**
 * Retorna o agente alvo correspondente a partir de um shuffle seguro.
 * @param {string} agentName - Nome do agente.
 * @returns {string} - Nome do agente alvo.
 */
function getAgentTarget(agentName) {
    const agentIndex = agents.indexOf(agentName);
    const shuffled = derangementShuffle([...agents]);
    return shuffled[agentIndex];
}

/**
 * Gera o link seguro para a missão, incluindo dados codificados em base64.
 * @param {string} playerName - Nome do agente solicitante.
 * @returns {string} - URL com os dados da missão.
 * @throws {Error} - Se o agente for seu próprio alvo (auto-seleção).
 */
function generateSecretLink(playerName) {
    const target = getAgentTarget(playerName);
    if (target === playerName) {
        throw new Error('Auto-seleção detectada!');
    }
    
    const missionData = {
        name: playerName,
        target: target,
        date: new Date().toISOString()
    };
    
    return `${window.location.origin}/mission.html?data=${btoa(JSON.stringify(missionData))}`;
}

/**
 * (Opcional) Inicializa o serviço do EmailJS com a chave pública.
 * Caso opte por usar o EmailJS, descomente essa função e a chamada no load.
 */
function initEmailService() {
    emailjs.init('vFdGAk_1ToNwH5QeD'); 
}

/**
 * Valida o formato do email usando regex.
 * @param {string} email - Email a ser validado.
 * @returns {boolean} - Verdadeiro se o email for válido.
 */
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()); 
}

/**
 * Escapa caracteres especiais para evitar injeção de HTML.
 * @param {string} text - Texto a ser sanitizado.
 * @returns {string} - Texto seguro para inserção em HTML.
 */
function sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/***************************************
 * Envio de Missão via WhatsApp
 ***************************************/
/**
 * Envia a mensagem secreta via WhatsApp utilizando click-to-chat.
 * Solicita o número do WhatsApp e o nome do agente, gera a mensagem com o nome do amigo secreto,
 * e abre o WhatsApp (Desktop/Web) com a mensagem pré-preenchida.
 */
function sendSecretWhatsAppMessage() {
    // Solicita o número do WhatsApp do usuário (apenas dígitos, com código do país)
    let whatsappNumber = prompt("Insira seu número de WhatsApp (apenas números, com código do país):");
    if (!whatsappNumber) {
        alert("Número de WhatsApp é necessário!");
        return;
    }
    if (!/^\d+$/.test(whatsappNumber)) {
        alert("Por favor, insira apenas números.");
        return;
    }
    
    // Solicita o nome do agente
    const playerName = prompt("Identificação requerida:\nInsira seu nome de agente:");
    if (!playerName || !agents.some(a => a.toLowerCase() === playerName.toLowerCase())) {
        alert("Agente não encontrado!");
        return;
    }
    
    // Obtém o agente sorteado para a missão
    const missionTarget = getAgentTarget(playerName);
    const currentDate = new Date().toLocaleDateString();
    
    // Gera o link para detalhes da missão
    const missionLink = generateSecretLink(playerName);
    
    // Monta o texto da mensagem
    const message = encodeURIComponent(
        `Agente ${playerName}, sua missão foi designada:\n` +
        `🎯 Alvo: ${missionTarget}\n` +
        `Data: ${currentDate}\n\n` +
        `Detalhes: ${missionLink}`
    );
    
    // Gera o link click-to-chat do WhatsApp
    const waLink = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Abre o link em uma nova aba/janela
    window.open(waLink, '_blank');
}

/***************************************
 * Gerenciamento de Agentes
 ***************************************/
/**
 * Adiciona um novo agente à lista, após validações.
 */
function addAgent() {
    const input = document.getElementById('agent');
    const name = input.value.trim();
    
    if (name) {
        // Verificação case-insensitive para evitar duplicatas
        const exists = agents.some(a => a.toLowerCase() === name.toLowerCase());
        
        if (exists) {
            alert('Agente já recrutado!');
            return;
        }
        
        agents.push(name);
        input.value = '';
        updateList();
    } else {
        alert('Insira o nome do agente!');
    }
}

/**
 * Atualiza a lista de agentes exibida na interface.
 */
function updateList() {
    const list = document.getElementById('agents');
    list.innerHTML = agents.map((agent, index) => `
        <li>
            <span>${index + 1}. ${sanitizeHTML(agent)}</span>
            <button onclick="removeAgent('${sanitizeHTML(agent)}')">
                <i class="fas fa-times"></i>
            </button>
        </li>
    `).join('');
}

/**
 * Remove um agente da lista, após confirmação.
 * @param {string} name - Nome do agente a ser removido.
 */
function removeAgent(name) {
    if (confirm(`Tem certeza que deseja remover ${name}?`)) {
        agents = agents.filter(a => a !== name);
        updateList();
    }
}

/**
 * Reinicia a missão, limpando a lista de agentes, os resultados e o campo de entrada.
 * Essa função é chamada pelo botão "Reiniciar" na interface.
 */
function resetMission() {
    if (confirm('Isso apagará todos os agentes! Continuar?')) {
        agents = [];
        updateList();
        document.getElementById('results').innerHTML = '';
        document.getElementById('playerEmail').value = '';
    }
}

/***************************************
 * Sistema de Sorteio e Exibição de Resultados
 ***************************************/
/**
 * Inicia a missão, verificando se há agentes suficientes e gerando as atribuições.
 */
function startMission() {
    if (agents.length < 2) {
        alert('Mínimo de 2 agentes!');
        return;
    }
    
    try {
        const assignments = derangementShuffle([...agents]);
        displayResults(assignments);
    } catch (error) {
        console.error('Erro no sorteio:', error);
        alert('Falha na operação! Reinicie o sistema.');
    }
}

/**
 * Exibe os resultados do sorteio na tela.
 * @param {Array} assignments - Array com os nomes dos alvos para cada agente.
 */
function displayResults(assignments) {
    const container = document.getElementById('results');
    container.innerHTML = agents.map((agent, index) => {
        const target = assignments[index];
        const isValid = agent !== target;
        
        return `
            <li class="${isValid ? '' : 'invalid'}" style="animation-delay: ${index * 0.1}s">
                <i class="fas fa-user-secret"></i>
                ${sanitizeHTML(agent)} → ${sanitizeHTML(target)}
                ${!isValid ? '<i class="fas fa-exclamation-triangle"></i>' : ''}
            </li>
        `;
    }).join('');
}

/***************************************
 * Sistema de Áudio
 ***************************************/
const backgroundMusic = document.getElementById('backgroundMusic');
let isPlaying = false;

/**
 * Alterna a reprodução da música de fundo.
 */
function toggleMusic() {
    const toggleButton = document.getElementById('musicToggle');
    
    if (isPlaying) {
        backgroundMusic.pause();
        toggleButton.classList.remove('playing');
    } else {
        backgroundMusic.play()
            .then(() => toggleButton.classList.add('playing'))
            .catch(error => {
                console.log('Reprodução precisa de interação do usuário');
                toggleButton.onclick = () => {
                    backgroundMusic.play();
                    toggleButton.classList.add('playing');
                    isPlaying = true;
                };
            });
    }
    isPlaying = !isPlaying;
}

/**
 * Ajusta o volume da música de fundo.
 * @param {number} volume - Valor de volume (entre 0 e 1).
 */
function adjustVolume(volume) {
    backgroundMusic.volume = volume;
}

// Inicializa a reprodução da música após a primeira interação do usuário
document.addEventListener('click', function initialMusicStart() {
    backgroundMusic.play();
    document.removeEventListener('click', initialMusicStart);
});
