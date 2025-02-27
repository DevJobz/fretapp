document.addEventListener('DOMContentLoaded', function () {
    const abas = document.querySelectorAll('.aba');
    const conteudoAba = document.getElementById('conteudoAba');

    abas.forEach((aba) => {
        aba.addEventListener('click', function () {
            const abaSelecionada = this.getAttribute('data-aba');
            carregarConteudoAba(abaSelecionada);
        });
    });

    function carregarConteudoAba(aba) {
        let conteudo = '';

        switch (aba) {
            case 'participantes':
                conteudo = `
                    <h2>Gestão de Participantes</h2>
                    <p>Aqui você pode gerenciar os participantes do evento.</p>
                    <ul id="listaParticipantes">
                        <li>João Silva</li>
                        <li>Maria Souza</li>
                        <li>Carlos Oliveira</li>
                    </ul>
                    <button class="btn" id="adicionarParticipante">Adicionar Participante</button>
                `;
                break;

            case 'rotas':
                conteudo = `
                    <h2>Gestão de Rotas</h2>
                    <p>Defina e otimize as rotas de transporte para o evento.</p>
                    <div id="mapa" style="height: 300px; background: #ccc; border-radius: 5px;"></div>
                    <p class="status-rota">Status da rota: <span id="statusRota">Em andamento</span></p>
                `;
                break;

            case 'relatorios':
                conteudo = `
                    <h2>Relatórios</h2>
                    <p>Visualize relatórios detalhados sobre o evento.</p>
                    <ul id="listaRelatorios">
                        <li>Relatório de Participação</li>
                        <li>Relatório Financeiro</li>
                    </ul>
                    <button class="btn" id="gerarRelatorio">Gerar Relatório</button>
                `;
                break;

            case 'alertas':
                conteudo = `
                    <h2>Enviar Alertas</h2>
                    <p>Envie alertas para os participantes do evento.</p>
                    <form id="formAlertas">
                        <label for="mensagem">Mensagem:</label>
                        <textarea id="mensagem" name="mensagem" rows="4" required></textarea>
                        <button type="submit" class="btn">Enviar Alerta</button>
                    </form>
                `;
                break;
        }

        conteudoAba.innerHTML = conteudo;

        // Adicionar lógica específica para cada aba, se necessário
        if (aba === 'rotas') {
            const statusRota = document.getElementById('statusRota');
            setInterval(() => {
                statusRota.textContent =
                    'Em andamento - Próxima parada: Ponto 2';
            }, 5000);
        }

        if (aba === 'alertas') {
            document
                .getElementById('formAlertas')
                .addEventListener('submit', function (event) {
                    event.preventDefault();
                    const mensagem = document.getElementById('mensagem').value;
                    alert(`Alerta enviado: ${mensagem}`);
                });
        }

        if (aba === 'participantes') {
            document
                .getElementById('adicionarParticipante')
                .addEventListener('click', function () {
                    alert(
                        'Funcionalidade de adicionar participante em desenvolvimento.'
                    );
                });
        }

        if (aba === 'relatorios') {
            document
                .getElementById('gerarRelatorio')
                .addEventListener('click', function () {
                    alert(
                        'Funcionalidade de gerar relatório em desenvolvimento.'
                    );
                });
        }
    }

    // Carregar a primeira aba por padrão
    carregarConteudoAba('participantes');
});
