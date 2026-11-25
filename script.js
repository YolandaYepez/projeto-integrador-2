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
   3. ATIVIDADE 2: LEITURA FACILITADA
   ========================================================= */

const textoLosartanaOriginal =
    "Este medicamento é contraindicado em pacientes com " +
    "hipersensibilidade conhecida à substância ativa ou a " +
    "qualquer um dos excipientes. A coadministração com " +
    "alisquireno é contraindicada em pacientes com diabetes " +
    "mellitus ou insuficiência renal (TFG < 60 mL/min/1,73 m²).";

const textoLosartanaSimples =
    "O remédio não deve ser usado por quem tem alergia aos " +
    "seus componentes. Também não pode ser misturado com " +
    "alisquireno se o paciente tiver diabetes ou problemas " +
    "graves nos rins.";

const textoLosartanaRefinado = `
    <h4>✨ Quem NÃO pode tomar este remédio:</h4>

    <ul>
        <li>
            <strong>Pessoas com alergia:</strong>
            Não tome se você já teve reação alérgica
            a este remédio ou a algum ingrediente da fórmula.
        </li>

        <li>
            <strong>Quem tem diabetes ou problema nos rins:</strong>
            Não tome este remédio junto com medicamentos
            que contêm alisquireno, um tipo de remédio
            usado para baixar a pressão.
        </li>
    </ul>

    <p>
        <strong>⚠️ Importante:</strong>
        Mostre ao médico todos os medicamentos que você usa.
        Não altere seu tratamento por conta própria.
    </p>
`;

function alternarTesteBula(numeroTeste) {
    const box = document.getElementById("resultado-bula");

    const botoes = [
        document.getElementById("btn-bula-0"),
        document.getElementById("btn-bula-1"),
        document.getElementById("btn-bula-2")
    ];

    if (!box) return;

    botoes.forEach(botao => {
        if (botao) botao.classList.remove("active");
    });

    if (botoes[numeroTeste]) {
        botoes[numeroTeste].classList.add("active");
    }

    if (numeroTeste === 0) {
        box.innerHTML = `
            <h4>📄 Texto Original (Complexo)</h4>
            <p>${textoLosartanaOriginal}</p>
        `;
    }

    if (numeroTeste === 1) {
        box.innerHTML = `
            <h4>🤖 Teste 1: Prompt Simples</h4>

            <p>
                <strong>Comando enviado:</strong>
                "Resuma este trecho de bula."
            </p>

            <p>
                <strong>Resposta gerada:</strong>
                ${textoLosartanaSimples}
            </p>

            <p>
                <strong>🔎 Análise:</strong>
                O texto ficou menor, mas manteve o termo
                "alisquireno" sem explicação e ficou em
                um único bloco de texto.
            </p>
        `;
    }

    if (numeroTeste === 2) {
        box.innerHTML = `
            <h4>✨ Teste 2: Prompt Refinado</h4>

            <p>
                <strong>Comando enviado:</strong>
                Reescreva o texto em linguagem simples,
                com frases curtas, explicação de termos
                médicos e tópicos com alertas visuais.
            </p>

            ${textoLosartanaRefinado}

            <p>
                <strong>🔎 Análise:</strong>
                O resultado usa tópicos, explica termos
                e destaca informações importantes.
            </p>
        `;
    }
}

/* EXEMPLOS PARA O CONVERSOR */

function carregarExemploBula() {
    const select = document.getElementById("select-exemplo-bula");
    const campo = document.getElementById("txt-bula-usuario");
    const saida = document.getElementById("saida-simulador-bula");

    if (!select || !campo) return;

    const exemplos = {
        losartana: textoLosartanaOriginal,

        amoxicilina:
            "A administração concomitante deste medicamento " +
            "com determinadas substâncias pode modificar " +
            "sua absorção e seus efeitos.",

        dipirona:
            "Podem ocorrer reações de hipersensibilidade, " +
            "incluindo manifestações cutâneas e alterações " +
            "na pressão arterial.",

        livre: ""
    };

    campo.value = exemplos[select.value] || "";

    if (saida) {
        saida.style.display = "none";
        saida.innerHTML = "";
    }
}

/* SIMULAÇÃO DE LEITURA FACILITADA */

function simularPromptBula(tipo) {
    const campo = document.getElementById("txt-bula-usuario");
    const saida = document.getElementById("saida-simulador-bula");

    if (!campo || !saida) return;

    const texto = campo.value.trim();

    if (!texto) {
        alert("Digite ou cole um texto primeiro.");
        return;
    }

    saida.style.display = "block";

    if (tipo === "simples") {
        saida.innerHTML = `
            <h4>🤖 Resultado: Prompt Simples</h4>
            <p>${escaparHTMLBula(texto)}</p>

            <p>
                <strong>Análise:</strong>
                O texto foi apresentado sem uma orientação
                específica de acessibilidade.
            </p>
        `;
        return;
    }

    const textoFacilitado = simplificarTextoBula(texto);

    saida.innerHTML = `
        <h4>✨ Resultado: Leitura Facilitada</h4>

        <p>
            <strong>Texto adaptado para leitura:</strong>
        </p>

        <div class="curiosidade-box">
            ${escaparHTMLBula(textoFacilitado).replace(/\n/g, "<br>")}
        </div>

        <p>
            <strong>ℹ️ Como funciona:</strong>
            Esta é uma simulação local de simplificação.
            Ela não consulta uma inteligência artificial real.
        </p>
    `;
}

/* SIMPLIFICAÇÃO EDUCATIVA BÁSICA */

function simplificarTextoBula(texto) {
    let resultado = texto;

    const substituicoes = [
        [/hipersensibilidade/gi, "alergia"],
        [/contraindicado/gi, "não deve ser usado"],
        [/contraindicada/gi, "não deve ser usada"],
        [/coadministração/gi, "uso junto com outro remédio"],
        [/administração concomitante/gi, "uso ao mesmo tempo"],
        [/insuficiência renal/gi, "problema nos rins"],
        [/diabetes mellitus/gi, "diabetes"],
        [/substância ativa/gi, "ingrediente que faz efeito"],
        [/excipientes/gi, "outros ingredientes do remédio"],
        [/manifestações cutâneas/gi, "reações na pele"],
        [/absorção/gi, "entrada do medicamento no organismo"]
    ];

    substituicoes.forEach(([termo, explicacao]) => {
        resultado = resultado.replace(termo, explicacao);
    });

    resultado = resultado
        .replace(/;\s*/g, ".\n")
        .replace(/\.\s*/g, ".\n")
        .replace(/\n{2,}/g, "\n")
        .trim();

    return resultado;
}

/* EVITA QUE O TEXTO DIGITADO SEJA INTERPRETADO COMO HTML */

function escaparHTMLBula(texto) {
    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* COPIAR PROMPTS */

function copiarPromptBula(tipo) {
    let prompt = "";

    if (tipo === "simples") {
        prompt = "Resuma este trecho de bula.";
    } else {
        prompt =
            "Atue como um especialista em Leitura Facilitada. " +
            "Reescreva o texto para uma pessoa idosa com baixa " +
            "escolaridade. Use linguagem simples, frases curtas, " +
            "explique termos médicos entre parênteses e organize " +
            "em tópicos com alertas visuais. Não invente informações " +
            "nem retire contraindicações importantes.";
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(prompt)
            .then(() => alert("Prompt copiado!"))
            .catch(() => alert("Não foi possível copiar. Selecione e copie o texto."));
    } else {
        alert("Copie o prompt selecionando o texto na página.");
    }
}

/* INICIAR COM O TESTE REFINADO */

alternarTesteBula(2);
carregarExemploBula();

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
   5. SIMULADORES DE ROBÓTICA (MATRIZ LED, MORSE & DISPLAY)
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

function atualizarDisplayManual() {
    const l1 = document.getElementById('input-disp-l1').value;
    const l2 = document.getElementById('input-disp-l2').value;

    document.getElementById('display-linha1').textContent = l1.trim() !== '' ? l1 : '[ SOS / AJUDA ATIVADA ]';
    document.getElementById('display-linha2').textContent = l2.trim() !== '' ? l2 : 'Atendente a caminho!';
}

function mudarTipoDisplay(tipo) {
    const tela = document.getElementById('tela-display');
    const btnLcd = document.getElementById('btn-modo-lcd');
    const btnOled = document.getElementById('btn-modo-oled');

    if (tipo === 'lcd') {
        tela.className = 'tela-display lcd';
        btnLcd.classList.add('active');
        btnOled.classList.remove('active');
    } else {
        tela.className = 'tela-display oled';
        btnOled.classList.add('active');
        btnLcd.classList.remove('active');
    }
}

function mensagemPadraoDisplay() {
    document.getElementById('input-disp-l1').value = '';
    document.getElementById('input-disp-l2').value = '';
    document.getElementById('display-linha1').textContent = '[ SOS / AJUDA ATIVADA ]';
    document.getElementById('display-linha2').textContent = 'Atendente a caminho!';
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

/* =========================================================
   7. DESAFIO INTERATIVO POR MATÉRIA (QUIZ)
   ========================================================= */
function verificarQuiz(botao, acertou, idPergunta) {
    const feedback = document.getElementById(idPergunta + '-feedback');
    const grupo = botao.parentElement;

    grupo.querySelectorAll('.btn-mini').forEach(b => {
        b.style.backgroundColor = '';
        b.style.color = '';
        b.style.borderColor = '';
    });

    if (acertou) {
        botao.style.backgroundColor = '#16a34a';
        botao.style.color = '#ffffff';
        botao.style.borderColor = '#16a34a';
        feedback.style.color = '#15803d';
        feedback.textContent = '✅ Resposta correta! Excelente observação.';
    } else {
        botao.style.backgroundColor = '#dc2626';
        botao.style.color = '#ffffff';
        botao.style.borderColor = '#dc2626';
        feedback.style.color = '#b91c1c';
        feedback.textContent = '❌ Ops! Dica: confira os detalhes nos cartões acima e tente de novo.';
    }
}