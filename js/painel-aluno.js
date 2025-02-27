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
            case 'informacoes':
                conteudo = `
                    <h2>Informações Pessoais</h2>
                    <p>Aqui você pode visualizar e editar suas informações pessoais.</p>
                    <form id="formInformacoes">
                        <label for="nome">Nome Completo:</label>
                        <input type="text" id="nome" name="nome" value="João Silva" required>

                        <label for="email">E-mail:</label>
                        <input type="email" id="email" name="email" value="joao.silva@example.com" required>

                        <label for="telefone">Telefone:</label>
                        <input type="tel" id="telefone" name="telefone" value="(11) 99999-9999" required>

                        <button type="submit" class="btn">Salvar Alterações</button>
                    </form>
                `;
                break;

            case 'presenca':
                conteudo = `
                    <h2>Gestão de Presença</h2>
                    <p>Informe se vai usar o transporte nos próximos dias.</p>
                    <form id="formPresenca">
                        <label for="data">Selecione a data:</label>
                        <input type="date" id="data" name="data" required>

                        <label for="usoTransporte">Vou usar o transporte:</label>
                        <select id="usoTransporte" name="usoTransporte" required>
                            <option value="sim">Sim</option>
                            <option value="nao">Não</option>
                        </select>

                        <button type="submit" class="btn">Confirmar</button>
                    </form>
                `;
                break;

            case 'rotas':
                conteudo = `
                    <h2>Rotas e Pontos de Parada</h2>
                    <p>Selecione seu ponto de embarque/desembarque.</p>
                    <form id="formRotas">
                        <label for="pontoEmbarque">Ponto de Embarque:</label>
                        <select id="pontoEmbarque" name="pontoEmbarque" required>
                            <option value="ponto1">Ponto 1</option>
                            <option value="ponto2">Ponto 2</option>
                            <option value="ponto3">Ponto 3</option>
                        </select>

                        <label for="pontoDesembarque">Ponto de Desembarque:</label>
                        <select id="pontoDesembarque" name="pontoDesembarque" required>
                            <option value="ponto1">Ponto 1</option>
                            <option value="ponto2">Ponto 2</option>
                            <option value="ponto3">Ponto 3</option>
                        </select>

                        <button type="submit" class="btn">Salvar</button>
                    </form>
                `;
                break;

            case 'rastreamento':
                conteudo = `
                    <h2>Rastreamento em Tempo Real</h2>
                    <p>Acompanhe a localização do veículo.</p>
                    <div id="mapa" style="height: 300px; background: #ccc; border-radius: 5px;"></div>
                    <p class="status-veiculo">Status do veículo: <span id="statusVeiculo">Em rota</span></p>
                `;
                break;
        }

        conteudoAba.innerHTML = conteudo;

        // Adicionar lógica específica para cada aba, se necessário
        if (aba === 'rastreamento') {
            // Simulação de rastreamento (pode ser integrado com uma API de mapas)
            const statusVeiculo = document.getElementById('statusVeiculo');
            setInterval(() => {
                statusVeiculo.textContent = 'Em rota - Próxima parada: Ponto 2';
            }, 5000);
        }
    }

    // Carregar a primeira aba por padrão
    carregarConteudoAba('informacoes');
});
