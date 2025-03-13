// Sistema de Preloader
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if(preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 1000);
        }
    }, 3000);
});

// Sistema Principal
let agents = [];

// Adicione ao app.js

// Configuração do EmailJS (Você precisa criar conta gratuita em https://www.emailjs.com/)
function initEmailService() {
    emailjs.init('SEU_USER_ID_DO_EMAILJS'); // Substitua pelo seu ID
}

// Função para enviar emails
async function sendSecretEmail() {
    const email = document.getElementById('playerEmail').value;
    
    if(!validateEmail(email)) {
        alert('Insira um email válido!');
        return;
    }

    const playerName = prompt('Identificação requerida:\nInsira seu nome de agente:');
    
    if(!agents.includes(playerName)) {
        alert('Agente não encontrado!');
        return;
    }

    try {
        const missionLink = generateSecretLink(playerName);
        
        const response = await emailjs.send('SEU_SERVICE_ID', 'SEU_TEMPLATE_ID', {
            to_name: playerName,
            to_email: email,
            mission_link: missionLink
        });

        if(response.status === 200) {
            alert('Missão enviada para seu email secreto! Verifique sua caixa de entrada.');
        }
    } catch (error) {
        console.error('Falha na operação:', error);
        alert('Erro ao enviar missão! Tente novamente.');
    }
}

// Gerar link seguro
function generateSecretLink(playerName) {
    const missionData = {
        name: playerName,
        target: getAgentTarget(playerName),
        date: new Date().toISOString()
    };

    const encryptedData = btoa(JSON.stringify(missionData));
    return `${window.location.origin}/mission.html?data=${encryptedData}`;
}

// Função para validar email
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Nova função para buscar o alvo
function getAgentTarget(agentName) {
    const agentIndex = agents.indexOf(agentName);
    const shuffled = [...agents].sort(() => Math.random() - 0.5);
    return shuffled[(agentIndex + 1) % shuffled.length];
}

function addAgent() {
    const input = document.getElementById('agent');
    const name = input.value.trim();
    
    if(name) {
        if(!agents.includes(name)) {
            agents.push(name);
            input.value = '';
            updateList();
        } else {
            alert('Agente já recrutado!');
        }
    } else {
        alert('Insira o nome do agente!');
    }
}

function updateList() {
    const list = document.getElementById('agents');
    if(list) {
        list.innerHTML = agents.map((agent, index) => {
            const safeName = agent.replace(/'/g, "\\'");
            return `
                <li>
                    <span>${index + 1}. ${agent}</span>
                    <button onclick="removeAgent('${safeName}')">
                        <i class="fas fa-times"></i>
                    </button>
                </li>
            `;
        }).join('');
    }
}

function removeAgent(name) {
    agents = agents.filter(a => a !== name);
    updateList();
}

function startMission() {
    if(agents.length < 2) {
        alert('Mínimo de 2 agentes!');
        return;
    }
    
    try {
        const results = shuffleAgents();
        displayResults(results);
    } catch(error) {
        console.error('Erro no sorteio:', error);
        alert('Falha na operação! Reinicie o sistema.');
    }
}

// Algoritmo Fisher-Yates para embaralhamento
function shuffleAgents() {
    const shuffled = [...agents];
    for(let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return agents.map((agent, index) => ({
        from: agent,
        to: shuffled[(index + 1) % shuffled.length]
    }));
}

function displayResults(results) {
    const container = document.getElementById('results');
    if(container) {
        container.innerHTML = results.map((result, index) => `
            <li style="animation-delay: ${index * 0.1}s">
                <i class="fas fa-user-secret"></i>
                ${sanitizeHTML(result.from)} → ${sanitizeHTML(result.to)}
                <i class="fas fa-handshake"></i>
            </li>
        `).join('');
    }
}

function resetMission() {
    agents = [];
    updateList();
    const results = document.getElementById('results');
    if(results) results.innerHTML = '';
}

// Prevenção contra XSS
function sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Adicione ao JavaScript
const backgroundMusic = document.getElementById('backgroundMusic');
let isPlaying = false;

function toggleMusic() {
    const toggleButton = document.getElementById('musicToggle');
    
    if(isPlaying) {
        backgroundMusic.pause();
        toggleButton.classList.remove('playing');
    } else {
        backgroundMusic.play()
            .then(() => {
                toggleButton.classList.add('playing');
            })
            .catch(error => {
                console.log('Reprodução precisa de interação do usuário');
                toggleButton.onclick = () => {
                    backgroundMusic.play();
                    toggleButton.classList.add('playing');
                    isPlaying = true;
                }
            });
    }
    isPlaying = !isPlaying;
}

function adjustVolume(volume) {
    backgroundMusic.volume = volume;
}

// Iniciar automaticamente após interação do usuário
document.addEventListener('click', function initialMusicStart() {
    backgroundMusic.play();
    document.removeEventListener('click', initialMusicStart);
});