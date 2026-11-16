// --- FUNÇÕES LÓGICAS DO PERSONALOCK ---
function criptografar(texto, chave = 3) {
    let resultado = "";
    // Garante que chaves negativas funcionem igual ao Python
    const deslocamento = ((chave % 26) + 26) % 26;

    for (let i = 0; i < texto.length; i++) {
        const char = texto[i];
        if (/[a-zA-Z]/.test(char)) {
            const base = char === char.toUpperCase() ? 65 : 97;
            const codigo = ((char.charCodeAt(0) - base + deslocamento) % 26) + base;
            resultado += String.fromCharCode(codigo);
        } else {
            resultado += char;
        }
    }
    return resultado;
}

function descriptografar(texto, chave = 3) {
    return criptografar(texto, -chave);
}

// --- CONTROLE DA INTERFACE ---

// Alternar entre as abas
function abrirAba(evento, nomeAba) {
    const conteudos = document.querySelectorAll(".tab-content");
    conteudos.forEach(c => c.classList.remove("active"));

    const botoes = document.querySelectorAll(".tab-btn");
    botoes.forEach(b => b.classList.remove("active"));

    document.getElementById(nomeAba).classList.add("active");
    evento.currentTarget.classList.add("active");
}

// Habilitar/Desabilitar slider da chave manual e atualizar número na tela
const chkChaveAuto = document.getElementById("chk-chave-auto");
const numChaveManual = document.getElementById("num-chave-manual");
const valorSlider = document.getElementById("valor-slider");

chkChaveAuto.addEventListener("change", function() {
    numChaveManual.disabled = this.checked;
});

numChaveManual.addEventListener("input", function() {
    valorSlider.textContent = this.value;
});

// --- PROCESSAR PROTEÇÃO (ABA 1) ---
function processarProtecao() {
    const outProteger = document.getElementById("out-proteger");
    const dado = document.getElementById("txt-dado-proteger").value.trim();

    if (!dado) {
        outProteger.innerHTML = `<p class="alerta-erro">❌ Por favor, digite o dado que deseja proteger.</p>`;
        return;
    }

    // Gera número aleatório entre 5 e 25 ou pega o valor manual
    const chave = chkChaveAuto.checked 
        ? Math.floor(Math.random() * (25 - 5 + 1)) + 5 
        : parseInt(numChaveManual.value);

    const resultado = criptografar(dado, chave);

    outProteger.innerHTML = `
        <div class="card-sucesso">
            <b>🔑 CHAVE DE LIBERAÇÃO:</b> 
            <span style="color: #D97706; font-size: 15px; font-weight: bold;">${chave}</span> 
            <i>(Guarde este número!)</i><br><br>
            <b>📦 TEXTO EMBALADO (CRIPTOGRAFADO):</b><br>
            <code>${resultado}</code>
        </div>
    `;
}

// --- PROCESSAR REVELAÇÃO (ABA 2) ---
function processarRevelacao() {
    const outRevelar = document.getElementById("out-revelar");
    const dadoCripto = document.getElementById("txt-dado-revelar").value.trim();
    const chave = parseInt(document.getElementById("num-chave-revelar").value);

    if (!dadoCripto) {
        outRevelar.innerHTML = `<p class="alerta-erro">❌ Por favor, insira o texto criptografado.</p>`;
        return;
    }
    if (!chave || chave === 0) {
        outRevelar.innerHTML = `<p class="alerta-erro">❌ Por favor, insira a chave numérica correta.</p>`;
        return;
    }

    const resultado = descriptografar(dadoCripto, chave);

    outRevelar.innerHTML = `
        <div class="card-revelado">
            <b>🔓 DADO REVELADO ORIGINÁRIO:</b><br>
            <span style="font-size: 15px; font-weight: bold; color: #1E40AF;">${resultado}</span>
        </div>
    `;
}
