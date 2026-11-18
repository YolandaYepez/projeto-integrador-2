/* =========================================================
   1. NAVEGAÇÃO ENTRE MÓDULOS DO PORTAL
   ========================================================= */
function mudarModulo(evento, idModulo) {
    document.querySelectorAll('.modulo').forEach(mod => mod.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(idModulo).classList.add('active');
    evento.currentTarget.classList.add('active');
}

/* =========================================================
   2. LÓGICA DO PERSONALOCK v1.0 (PROGRAMAÇÃO)
   ========================================================= */
const chkChaveAuto = document.getElementById('chk-chave-auto');
const sliderChave = document.getElementById('num-chave-manual');
const valorSlider = document.getElementById('valor-slider');

function abrirAbaLock(evento, idAba) {
    document.querySelectorAll('.tab-content').forEach(aba => aba.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(idAba).classList.add('active');
    evento.currentTarget.classList.add('active');
}

chkChaveAuto.addEventListener('change', function() {
    sliderChave.disabled = this.checked;
});

sliderChave.addEventListener('input', function() {
    valorSlider.textContent = this.value;
});

function transformarTexto(texto, chave, modo) {
    let resultado = '';
    const deslocamento = modo === 'proteger' ? chave : -chave;

    for (let i = 0; i < texto.length; i++) {
        let codigo = texto.charCodeAt(i);
        if (codigo >= 32 && codigo <= 126) {
            let novoCodigo = ((codigo - 32 + deslocamento) % 95);
            if (novoCodigo < 0) novoCodigo += 95;
            resultado += String.fromCharCode(novoCodigo + 32);
        } else {
            resultado += texto[i];
        }
    }
    return resultado;
}

function processarProtecao() {
    const dado = document.getElementById('txt-dado-proteger').value;
    const selectTipo = document.getElementById('drop-tipo-dado');
    const nomeTipo = selectTipo.options[selectTipo.selectedIndex].text;
    const outBox = document.getElementById('out-proteger');

    if (!dado.trim()) {
        alert('Por favor, digite algum dado para proteger.');
        return;
    }

    const chave = chkChaveAuto.checked 
        ? Math.floor(Math.random() * 25) + 1 
        : parseInt(sliderChave.value);

    const textoProtegido = transformarTexto(dado, chave, 'proteger');

    outBox.innerHTML = `
        <p><strong>Tipo:</strong> ${nomeTipo}</p>
        <p><strong>Chave Gerada:</strong> <span style="color: #38bdf8; font-weight: bold;">${chave}</span></p>
        <p style="margin-top: 8px;"><strong>Texto Protegido:</strong><br><code id="res-cripto">${textoProtegido}</code></p>
        <button class="btn-copiar" onclick="copiarTexto('res-cripto')">📋 Copiar Texto</button>
    `;
    outBox.classList.add('visivel');
}

function processarRevelacao() {
    const textoCripto = document.getElementById('txt-dado-revelar').value;
    const chave = parseInt(document.getElementById('num-chave-revelar').value);
    const outBox = document.getElementById('out-revelar');

    if (!textoCripto.trim()) {
        alert('Cole o texto criptografado primeiro.');
        return;
    }

    if (isNaN(chave) || chave < 1 || chave > 25) {
        alert('Insira uma chave válida entre 1 e 25.');
        return;
    }

    const textoRevelado = transformarTexto(textoCripto, chave, 'revelar');

    outBox.innerHTML = `
        <p><strong>Dado Revelado:</strong><br><code id="res-revelado">${textoRevelado}</code></p>
        <button class="btn-copiar" onclick="copiarTexto('res-revelado')">📋 Copiar Dado</button>
    `;
    outBox.classList.add('visivel');
}

function copiarTexto(idElemento) {
    const texto = document.getElementById(idElemento).textContent;
    navigator.clipboard.writeText(texto).then(() => {
        alert('Copiado para a área de transferência!');
    });
}

/* =========================================================
   3. SIMULADORES DE ROBÓTICA (MATRIZ LED & CÓDIGO MORSE)
   ========================================================= */
function mudarMatriz(icone, descricao, cor) {
    const display = document.getElementById('matriz-led');
    const legenda = document.getElementById('matriz-legenda');
    display.textContent = icone;
    display.style.borderColor = cor;
    display.style.boxShadow = `0 0 15px ${cor}66`;
    legenda.textContent = descricao;
}

// Emissor de SOS com Web Audio API (Buzzer) e LED visual
let tocandoSOS = false;
async function emitirSOS() {
    if (tocandoSOS) return;
    tocandoSOS = true;

    const led = document.getElementById('led-morse');
    const status = document.getElementById('morse-status');
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Padrão SOS: 3 pontos (150ms), 3 traços (450ms), 3 pontos (150ms)
    const sequencia = [150, 150, 150, 450, 450, 450, 150, 150, 150];
    status.textContent = 'Transmitindo: · · ·  - - -  · · · (SOS)';

    for (let i = 0; i < sequencia.length; i++) {
        const duracao = sequencia[i];
        
        // Liga LED e Buzzer
        led.classList.add('aceso');
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, audioCtx.currentTime); // Tom do buzzer
        osc.connect(audioCtx.destination);
        osc.start();

        await new Promise(r => setTimeout(r, duracao));

        // Desliga LED e Buzzer
        osc.stop();
        led.classList.remove('aceso');
        await new Promise(r => setTimeout(r, 150)); // Pausa entre pulsos
    }

    status.textContent = 'Sinal SOS concluído!';
    tocandoSOS = false;
}

/* =========================================================
   4. SIMULADOR DE FÍSICA (SEMÁFORO DO RUÍDO)
   ========================================================= */
function atualizarSemaforo(db) {
    const visor = document.getElementById('visor-db');
    const valorSpan = document.getElementById('valor-db');
    const statusSpan = document.getElementById('status-db');

    valorSpan.textContent = `${db} dB`;

    if (db <= 70) {
        visor.style.backgroundColor = '#065f46'; // Verde
        statusSpan.textContent = 'Seguro e Confortável (Ex: Biblioteca / Banheiro vazio)';
    } else if (db <= 84) {
        visor.style.backgroundColor = '#b45309'; // Amarelo/Laranja
        statusSpan.textContent = 'Atenção: Desconforto e Fadiga Mental (Ex: Sala da Pedagogia / Quadra)';
    } else if (db < 120) {
        visor.style.backgroundColor = '#b91c1c'; // Vermelho
        statusSpan.textContent = 'PERIGO (OMS): Risco de Perda Auditiva Irreversível (PAIR)';
    } else {
        visor.style.backgroundColor = '#7f1d1d'; // Vermelho Escuro
        statusSpan.textContent = 'LIMIAR DA DOR: Dano auditivo imediato!';
    }
}