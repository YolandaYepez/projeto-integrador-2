/* =========================================================
   0. RECURSOS DE ACESSIBILIDADE (FONTE, CONTRASTE INVERSO, VOZ)
   ========================================================= */
let tamanhoFonteAtual = 16;

function alterarFonte(delta) {
    tamanhoFonteAtual = Math.min(24, Math.max(12, tamanhoFonteAtual + delta));
    document.documentElement.style.fontSize = tamanhoFonteAtual + 'px';
}

function resetarFonte() {
    tamanhoFonteAtual = 16;
    document.documentElement.style.fontSize = '16px';
}

function alternarContrasteInverso() {
    document.body.classList.toggle('contraste-inverso');
    const btn = document.getElementById('btn-contraste');
    if (document.body.classList.contains('contraste-inverso')) {
        btn.textContent = '☀️ Contraste Normal';
    } else {
        btn.textContent = '🌓 Inverter Contraste';
    }
}

function lerPagina() {
    const btnVoz = document.getElementById('btn-voz');
    if ('speechSynthesis' in window) {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            btnVoz.textContent = '🔊 Ouvir Texto';
            return;
        }

        const moduloAtivo = document.querySelector('.modulo.active');
        const texto = moduloAtivo.innerText;
        const fala = new SpeechSynthesisUtterance(texto);
        fala.lang = 'pt-BR';
        
        fala.onend = () => {
            btnVoz.textContent = '🔊 Ouvir Texto';
        };

        btnVoz.textContent = '⏹️ Parar Leitura';
        window.speechSynthesis.speak(fala);
    } else {
        alert('Seu navegador não suporta leitura de voz automática.');
    }
}

/* =========================================================
   1. NAVEGAÇÃO ENTRE MÓDULOS DO PORTAL
   ========================================================= */
function mudarModulo(evento, idModulo) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        document.getElementById('btn-voz').textContent = '🔊 Ouvir Texto';
    }

    document.querySelectorAll('.modulo').forEach(mod => mod.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(idModulo).classList.add('active');
    evento.currentTarget.classList.add('active');
}

/* =========================================================
   2. ATIVIDADE 1: PERSONALOCK v1.0
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
        <p><strong>Chave Gerada:</strong> <span style="color: var(--highlight); font-weight: bold;">${chave}</span></p>
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
   3. ATIVIDADE 2: COMPARADOR DE PROMPTS (LEITURA FACILITADA)
   ========================================================= */
function alternarTesteBula(numeroTeste) {
    const box = document.getElementById('resultado-bula');
    const btn1 = document.getElementById('btn-teste1');
    const btn2 = document.getElementById('btn-teste2');

    if (numeroTeste === 1) {
        btn1.classList.add('active');
        btn2.classList.remove('active');
        box.innerHTML = `
            <h4>🤖 Teste 1: Prompt Simples</h4>
            <p><strong>Comando enviado:</strong> <code>"Resuma este trecho de bula."</code></p>
            <p style="margin: 10px 0;"><strong>Resposta da IA:</strong> <em>"O remédio não deve ser usado por quem tem alergia aos seus componentes. Também não pode ser misturado com alisquireno se o paciente tiver diabetes ou problemas graves nos rins."</em></p>
            <p><strong>Análise Crítica:</strong> Embora tenha diminuído o texto, a IA manteve o nome técnico "alisquireno" sem explicar o que é, e o formato em bloco único ainda cansa quem tem déficit de atenção ou baixa escolaridade.</p>
        `;
    } else {
        btn2.classList.add('active');
        btn1.classList.remove('active');
        box.innerHTML = `
            <h4>✨ Teste 2: Prompt Refinado (Leitura Facilitada)</h4>
            <p><strong>Comando enviado:</strong> <code>"Atue como um especialista em Leitura Facilitada. Reescreva o texto da bula abaixo para um paciente idoso com baixa escolaridade..."</code></p>
            <div style="margin: 10px 0; padding: 12px; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-color);">
                <p><strong>Quem NÃO pode tomar este remédio:</strong></p>
                <ul style="margin-top: 5px;">
                    <li><strong>Pessoas com alergia:</strong> Não tome se você já teve reação alérgica a este remédio ou a qualquer ingrediente da fórmula.</li>
                    <li><strong>Quem tem diabetes ou problema nos rins:</strong> Não tome este remédio junto com medicamentos que contêm <strong>alisquireno</strong> (um tipo de remédio usado para baixar a pressão).</li>
                </ul>
                <p style="margin-top: 8px;"><strong>Dica importante:</strong> Sempre mostre ao seu médico todos os remédios que você já toma antes de começar este tratamento.</p>
            </div>
            <p><strong>Análise Crítica:</strong> Traduziu termos médicos (<em>hipersensibilidade</em> virou <em>alergia</em>), explicou o que é o medicamento, quebrou o texto em tópicos curtos e adicionou uma orientação prática de segurança.</p>
        `;
    }
}
alternarTesteBula(2);

/* =========================================================
   4. ATIVIDADE 3: NUTRITECH (CALCULADORA NUTRICIONAL)
   ========================================================= */
const tabelaAlimentos = {
    "Arroz branco cozido": { calorias: 130, carboidratos: 28.0, proteinas: 2.7, fibras: 1.6, sodio: 1 },
    "Feijão carioca cozido": { calorias: 76, carboidratos: 13.6, proteinas: 4.8, fibras: 8.5, sodio: 2 },
    "Peito de frango grelhado": { calorias: 159, carboidratos: 0.0, proteinas: 32.0, fibras: 0.0, sodio: 50 },
    "Pão francês": { calorias: 300, carboidratos: 58.6, proteinas: 8.0, fibras: 2.3, sodio: 648 },
    "Banana prata": { calorias: 98, carboidratos: 26.0, proteinas: 1.3, fibras: 2.0, sodio: 1 },
    "Queijo mussarela": { calorias: 330, carboidratos: 3.0, proteinas: 22.0, fibras: 0.0, sodio: 580 },
    "Ovo cozido": { calorias: 146, carboidratos: 0.6, proteinas: 13.3, fibras: 0.0, sodio: 140 },
    "Salada (alface e tomate)": { calorias: 15, carboidratos: 3.1, proteinas: 0.9, fibras: 1.2, sodio: 5 }
};

let refeicao = [];

function adicionarAlimento() {
    const nome = document.getElementById('nutri-alimento').value;
    const gramas = parseInt(document.getElementById('nutri-gramas').value);
    const fator = gramas / 100.0;
    const dados = tabelaAlimentos[nome];

    refeicao.push({
        nome: nome,
        g: gramas,
        cal: dados.calorias * fator,
        carb: dados.carboidratos * fator,
        prot: dados.proteinas * fator,
        fib: dados.fibras * fator,
        sod: dados.sodio * fator
    });

    atualizarNutriTech();
}

function limparPrato() {
    refeicao = [];
    atualizarNutriTech();
}

function atualizarNutriTech() {
    const saida = document.getElementById('nutri-saida');
    const perfil = document.getElementById('nutri-perfil').value;

    if (refeicao.length === 0) {
        saida.innerHTML = `<p style="color: #666; margin: 0;">Selecione um alimento acima e clique em <b>Adicionar</b>.</p>`;
        return;
    }

    const cal = refeicao.reduce((acc, x) => acc + x.cal, 0);
    const carb = refeicao.reduce((acc, x) => acc + x.carb, 0);
    const prot = refeicao.reduce((acc, x) => acc + x.prot, 0);
    const fib = refeicao.reduce((acc, x) => acc + x.fib, 0);
    const sod = refeicao.reduce((acc, x) => acc + x.sod, 0);

    const listaHtml = refeicao.map(x => `<li><b>${x.nome}</b> (${x.g}g) — ${x.cal.toFixed(0)} kcal</li>`).join('');

    let alertaHtml = `<div class="alerta-nutri-ok">✅ <b>Refeição equilibrada!</b></div>`;
    if (sod > 600) {
        alertaHtml = `<div class="alerta-nutri-sod">⚠️ <b>ALERTA (Hipertensão):</b> Sódio elevado (${sod.toFixed(0)} mg).</div>`;
    } else if (carb > 55) {
        alertaHtml = `<div class="alerta-nutri-carb">⚠️ <b>ALERTA (Diabetes):</b> Carboidratos elevados (${carb.toFixed(1)} g).</div>`;
    }

    saida.innerHTML = `
        <h4>🍽️ Prato Atual (${perfil})</h4>
        <ul>${listaHtml}</ul>
        <div class="table-responsive">
            <table class="nutri-tabela">
                <thead>
                    <tr>
                        <th>Calorias</th>
                        <th>Carboidratos</th>
                        <th>Proteínas</th>
                        <th>Fibras</th>
                        <th>Sódio</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><b>${cal.toFixed(0)} kcal</b></td>
                        <td><b>${carb.toFixed(1)} g</b></td>
                        <td><b>${prot.toFixed(1)} g</b></td>
                        <td><b>${fib.toFixed(1)} g</b></td>
                        <td><b>${sod.toFixed(0)} mg</b></td>
                    </tr>
                </tbody>
            </table>
        </div>
        ${alertaHtml}
        <p class="aviso-etico-nutri">ℹ️ <i>Aviso ético: Ferramenta educativa, não substitui orientação médica ou nutricional.</i></p>
    `;
}
atualizarNutriTech();

/* =========================================================
   5. SIMULADORES DE ROBÓTICA (MATRIZ LED & CÓDIGO MORSE)
   ========================================================= */
function mudarMatriz(icone, descricao, cor) {
    const display = document.getElementById('matriz-led');
    const legenda = document.getElementById('matriz-legenda');
    display.textContent = icone;
    display.style.borderColor = cor;
    legenda.textContent = descricao;
}

let tocandoSOS = false;
async function emitirSOS() {
    if (tocandoSOS) return;
    tocandoSOS = true;

    const led = document.getElementById('led-morse');
    const status = document.getElementById('morse-status');
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const sequencia = [150, 150, 150, 450, 450, 450, 150, 150, 150];
    status.textContent = 'Transmitindo: · · ·  - - -  · · · (SOS)';

    for (let i = 0; i < sequencia.length; i++) {
        const duracao = sequencia[i];
        
        led.classList.add('aceso');
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, audioCtx.currentTime);
        osc.connect(audioCtx.destination);
        osc.start();

        await new Promise(r => setTimeout(r, duracao));

        osc.stop();
        led.classList.remove('aceso');
        await new Promise(r => setTimeout(r, 150));
    }

    status.textContent = 'Sinal SOS concluído!';
    tocandoSOS = false;
}

/* =========================================================
   6. SIMULADOR DE FÍSICA (SEMÁFORO DO RUÍDO)
   ========================================================= */
function atualizarSemaforo(db) {
    const visor = document.getElementById('visor-db');
    const valorSpan = document.getElementById('valor-db');
    const statusSpan = document.getElementById('status-db');

    valorSpan.textContent = `${db} dB`;

    if (db <= 70) {
        visor.style.backgroundColor = '#16a34a';
        statusSpan.textContent = 'Seguro e Confortável (Ex: Biblioteca / Banheiro vazio)';
    } else if (db <= 84) {
        visor.style.backgroundColor = '#d97706';
        statusSpan.textContent = 'Atenção: Desconforto e Fadiga Mental (Ex: Sala da Pedagogia / Quadra)';
    } else if (db < 120) {
        visor.style.backgroundColor = '#dc2626';
        statusSpan.textContent = 'PERIGO (OMS): Risco de Perda Auditiva Irreversível (PAIR)';
    } else {
        visor.style.backgroundColor = '#7f1d1d';
        statusSpan.textContent = 'LIMIAR DA DOR: Dano auditivo imediato!';
    }
}