// cadastro-motorista.js
document.addEventListener('DOMContentLoaded', function () {
    // Verifica se há parâmetros na URL (acesso via link gerado pelo gestor)
    const params = new URLSearchParams(window.location.search);
    const driverId = params.get('driverId');
    if (driverId) {
        // Se existirem, preenche os campos com os dados enviados pelo gestor
        const nome = params.get('nome');
        const cnh = params.get('cnh');
        const categoria = params.get('categoria');
        const expedicao = params.get('expedicao');
        const validade = params.get('validade');

        if (nome) {
            document.getElementById('nomeCompleto').value =
                decodeURIComponent(nome);
        }
        if (cnh) {
            document.getElementById('cnh').value = decodeURIComponent(cnh);
        }
        if (categoria) {
            document.getElementById('categoria').value =
                decodeURIComponent(categoria);
        }
        if (expedicao) {
            document.getElementById('expedicao').value = expedicao;
        }
        if (validade) {
            document.getElementById('validade').value = validade;
        }

        // Bloqueia edição dos campos pré‑preenchidos
        document.getElementById('nomeCompleto').readOnly = true;
        document.getElementById('cnh').readOnly = true;
        document.getElementById('categoria').readOnly = true;
        document.getElementById('expedicao').readOnly = true;
        document.getElementById('validade').readOnly = true;
    }

    document
        .getElementById('cadastroMotoristaForm')
        .addEventListener('submit', function (event) {
            event.preventDefault();

            const senha = document.getElementById('senha').value;
            const confirmarSenha =
                document.getElementById('confirmarSenha').value;

            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem.');
                return;
            }

            // Cria objeto motorista com todos os dados
            const motorist = {
                id: driverId || Date.now().toString(),
                nomeCompleto: document.getElementById('nomeCompleto').value,
                cnh: document.getElementById('cnh').value,
                categoria: document.getElementById('categoria').value,
                expedicao: document.getElementById('expedicao').value,
                validade: document.getElementById('validade').value,
                cpf: document.getElementById('cpf').value,
                dataNascimento: document.getElementById('dataNascimento').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                endereco: {
                    cep: document.getElementById('cep').value,
                    rua: document.getElementById('rua').value,
                    numero: document.getElementById('numero').value,
                    complemento: document.getElementById('complemento').value,
                    bairro: document.getElementById('bairro').value,
                    uf: document.getElementById('uf').value,
                    cidade: document.getElementById('cidade').value,
                },
                senha: senha,
                // Após o cadastro completo, o status passa para "concluido"
                status: 'concluido',
            };

            // Atualiza ou insere o registro no array "motoristas" no localStorage
            let motoristas =
                JSON.parse(localStorage.getItem('motoristas')) || [];
            if (driverId) {
                // Atualiza o mesmo ID
                motoristas = motoristas.map((m) =>
                    m.id === driverId ? motorist : m
                );
            } else {
                // Insere novo
                motoristas.push(motorist);
            }
            localStorage.setItem('motoristas', JSON.stringify(motoristas));

            alert('Motorista cadastrado com sucesso!');
            window.location.href = 'painel-motorista.html';
        });
});
