document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const empresaRelacionamento = urlParams.get('empresa');
    const matricula = gerarMatriculaAluno();

    const selectFaculdade = document.getElementById('faculdade');
    const empresaAtiva = JSON.parse(localStorage.getItem('empresaAtiva'));
    const instituicoes = empresaAtiva?.instituicoes || [];

    // Preenche o campo "Empresa de Relacionamento"
    document.getElementById('empresaRelacionamento').value =
        empresaRelacionamento;

    // Preenche o campo "Matrícula"
    document.getElementById('matricula').value = matricula;

    // Preenche a lista de faculdades
    selectFaculdade.innerHTML =
        '<option value="">Selecione uma faculdade</option>';
    instituicoes.forEach((instituicao) => {
        const option = document.createElement('option');
        option.value = instituicao.nomeFantasia;
        option.textContent = instituicao.nomeFantasia;
        selectFaculdade.appendChild(option);
    });

    // Validação de Nome Completo (apenas letras e mínimo de 8 caracteres)
    document
        .getElementById('nomeCompleto')
        .addEventListener('input', function (e) {
            const nomeCompleto = e.target.value;
            const regex = /^[A-Za-zÀ-ú\s]{8,}$/;
            if (!regex.test(nomeCompleto)) {
                mostrarErro(
                    'erroNomeCompleto',
                    'Nome deve conter apenas letras e no mínimo 8 caracteres.'
                );
            } else {
                esconderErro('erroNomeCompleto');
            }
        });

    // Validação da data de nascimento
    document
        .getElementById('dataNascimento')
        .addEventListener('change', function (e) {
            const dataNascimento = new Date(e.target.value);
            const hoje = new Date();
            const idadeMinima = new Date(
                hoje.getFullYear() - 110,
                hoje.getMonth(),
                hoje.getDate()
            );
            if (dataNascimento > hoje || dataNascimento < idadeMinima) {
                mostrarErro(
                    'erroDataNascimento',
                    'Data de nascimento inválida.'
                );
            } else {
                esconderErro('erroDataNascimento');
            }
        });

    // Função para mostrar mensagens de erro
    function mostrarErro(id, mensagem) {
        const erroElemento = document.getElementById(id);
        erroElemento.textContent = mensagem;
        erroElemento.style.display = 'block';
    }

    // Função para esconder mensagens de erro
    function esconderErro(id) {
        const erroElemento = document.getElementById(id);
        erroElemento.style.display = 'none';
    }

    // Formatação do CEP (igual ao do funcionário)
    document.getElementById('cep').addEventListener('input', function (e) {
        let cep = e.target.value.replace(/\D/g, '');
        if (cep.length > 8) {
            cep = cep.substring(0, 8);
        }
        if (cep.length > 5) {
            cep = cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
        }
        e.target.value = cep;

        // Validação
        if (cep.replace(/\D/g, '').length !== 8) {
            mostrarErro('erroCep', 'CEP deve ter 8 dígitos.');
        } else {
            esconderErro('erroCep');
        }
    });

    // Formatação de CPF
    document.getElementById('cpf').addEventListener('input', function (e) {
        let cpf = e.target.value.replace(/\D/g, '');
        if (cpf.length > 11) {
            cpf = cpf.substring(0, 11); // Limita a 11 dígitos
        }
        if (cpf.length > 9) {
            cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        } else if (cpf.length > 6) {
            cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1.$2.$3');
        } else if (cpf.length > 3) {
            cpf = cpf.replace(/^(\d{3})(\d{3})$/, '$1.$2');
        }
        e.target.value = cpf;

        // Valida se o CPF tem 11 dígitos
        if (cpf.replace(/\D/g, '').length !== 11) {
            mostrarErro('erroCpf', 'CPF deve ter 11 dígitos.');
        } else {
            esconderErro('erroCpf');
        }
    });

    document.getElementById('telefone').addEventListener('input', function (e) {
        // Remove todos os caracteres não numéricos
        let telefone = e.target.value.replace(/\D/g, '');

        // Validação: Verifica se o telefone tem 10 ou 11 dígitos
        if (telefone.length < 10 || telefone.length > 11) {
            mostrarErro('erroTelefone', 'Telefone deve ter 10 ou 11 dígitos.');
        } else {
            esconderErro('erroTelefone');
        }

        // Formatação: Aplica a máscara de telefone
        if (telefone.length > 10) {
            telefone = telefone.replace(
                /^(\d{2})(\d{5})(\d{4})$/,
                '($1) $2-$3'
            );
        } else if (telefone.length > 6) {
            telefone = telefone.replace(
                /^(\d{2})(\d{4})(\d{4})$/,
                '($1) $2-$3'
            );
        } else if (telefone.length > 2) {
            telefone = telefone.replace(/^(\d{2})(\d{4})$/, '($1) $2');
        }

        // Atualiza o valor do campo com a formatação aplicada
        e.target.value = telefone;
    });

    // Validação de CEP (8 dígitos)
    document.getElementById('cep').addEventListener('input', function (e) {
        let cep = e.target.value.replace(/\D/g, '');
        if (cep.length > 8) {
            cep = cep.substring(0, 8); // Limita a 8 dígitos
        }
        e.target.value = cep;
    });

    // Validação de Senha (mínimo 6 caracteres)
    document.getElementById('senha').addEventListener('input', function (e) {
        const senha = e.target.value;
        if (senha.length < 6) {
            mostrarErro(
                'erroSenha',
                'A senha deve ter no mínimo 6 caracteres.'
            );
        } else {
            esconderErro('erroSenha');
        }
    });

    // Validação de Confirmação de Senha
    document
        .getElementById('confirmarSenha')
        .addEventListener('input', function (e) {
            const senha = document.getElementById('senha').value;
            const confirmarSenha = e.target.value;
            if (senha !== confirmarSenha) {
                mostrarErro('erroConfirmarSenha', 'As senhas não coincidem.');
            } else {
                esconderErro('erroConfirmarSenha');
            }
        });

    // Validação de Data de Nascimento
    document
        .getElementById('dataNascimento')
        .addEventListener('change', function (e) {
            const dataNascimento = new Date(e.target.value);
            const hoje = new Date();
            if (dataNascimento > hoje) {
                mostrarErro(
                    'erroDataNascimento',
                    'Data de nascimento inválida.'
                );
            } else {
                esconderErro('erroDataNascimento');
            }
        });

    // Validação de CPF único
    document.getElementById('cpf').addEventListener('blur', function (e) {
        const cpf = e.target.value.replace(/\D/g, '');
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const cpfExistente = usuarios.find((usuario) => usuario.cpf === cpf);
        if (cpfExistente) {
            mostrarErro('erroCpf', 'CPF já cadastrado.');
        } else {
            esconderErro('erroCpf');
        }
    });

    // Validação de E-mail único
    document.getElementById('email').addEventListener('blur', function (e) {
        const email = e.target.value;
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const emailExistente = usuarios.find(
            (usuario) => usuario.email === email
        );
        if (emailExistente) {
            mostrarErro('erroEmail', 'E-mail já cadastrado.');
        } else {
            esconderErro('erroEmail');
        }
    });

    // Validação de Estado e Cidade (apenas letras)
    document.getElementById('uf').addEventListener('input', function (e) {
        const uf = e.target.value;
        const regex = /^[A-Za-zÀ-ú\s]{2}$/;
        if (!regex.test(uf)) {
            mostrarErro(
                'erroUf',
                'UF deve conter apenas letras e ter 2 caracteres.'
            );
        } else {
            esconderErro('erroUf');
        }
    });

    document.getElementById('cidade').addEventListener('input', function (e) {
        const cidade = e.target.value;
        const regex = /^[A-Za-zÀ-ú\s]{3,}$/;
        if (!regex.test(cidade)) {
            mostrarErro(
                'erroCidade',
                'Cidade deve conter apenas letras e no mínimo 3 caracteres.'
            );
        } else {
            esconderErro('erroCidade');
        }
    });

    // Validação de Telefone único
    document.getElementById('telefone').addEventListener('blur', function (e) {
        const telefone = e.target.value.replace(/\D/g, '');
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const telefoneExistente = usuarios.find(
            (usuario) => usuario.telefone === telefone
        );
        if (telefoneExistente) {
            mostrarErro('erroTelefone', 'Telefone já cadastrado.');
        } else {
            esconderErro('erroTelefone');
        }
    });

    // Função para gerar matrícula única
    function gerarMatriculaAluno() {
        const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
        let ultimaMatricula = 0;

        if (alunos.length > 0) {
            ultimaMatricula = parseInt(alunos[alunos.length - 1].matricula, 10);
        }

        const novaMatricula = String(ultimaMatricula + 1).padStart(4, '0');
        return novaMatricula;
    }

    // Submissão do formulário
    document
        .getElementById('cadastroAlunoForm')
        .addEventListener('submit', function (e) {
            e.preventDefault();

            // Verifica se todos os campos obrigatórios estão preenchidos
            const camposObrigatorios = document.querySelectorAll(
                'input[required], select[required]'
            );
            let formularioValido = true;

            camposObrigatorios.forEach((campo) => {
                if (!campo.value) {
                    mostrarErro(
                        `erro${
                            campo.name.charAt(0).toUpperCase() +
                            campo.name.slice(1)
                        }`,
                        'Este campo é obrigatório.'
                    );
                    formularioValido = false;
                }
            });

            if (!formularioValido) {
                return;
            }

            // Verifica se o CPF, e-mail e telefone já estão cadastrados
            const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
            const email = document.getElementById('email').value;
            const telefone = document
                .getElementById('telefone')
                .value.replace(/\D/g, '');
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const cpfExistente = usuarios.find(
                (usuario) => usuario.cpf === cpf
            );
            const emailExistente = usuarios.find(
                (usuario) => usuario.email === email
            );
            const telefoneExistente = usuarios.find(
                (usuario) => usuario.telefone === telefone
            );

            if (cpfExistente) {
                mostrarErro('erroCpf', 'CPF já cadastrado.');
                return;
            }

            if (emailExistente) {
                mostrarErro('erroEmail', 'E-mail já cadastrado.');
                return;
            }

            if (telefoneExistente) {
                mostrarErro('erroTelefone', 'Telefone já cadastrado.');
                return;
            }

            // Cria o objeto do usuário
            const aluno = {
                matricula: document.getElementById('matricula').value,
                empresaRelacionamento: document.getElementById(
                    'empresaRelacionamento'
                ).value,
                faculdade: document.getElementById('faculdade').value,
                nomeCompleto: document.getElementById('nomeCompleto').value,
                cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
                dataNascimento: document.getElementById('dataNascimento').value,
                email: document.getElementById('email').value,
                telefone: document
                    .getElementById('telefone')
                    .value.replace(/\D/g, ''),
                cep: document.getElementById('cep').value,
                rua: document.getElementById('rua').value,
                numero: document.getElementById('numero').value,
                complemento: document.getElementById('complemento').value,
                bairro: document.getElementById('bairro').value,
                uf: document.getElementById('uf').value,
                cidade: document.getElementById('cidade').value,
                senha: document.getElementById('senha').value,
            };

            // Adiciona o usuário ao localStorage
            const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
            alunos.push(aluno);
            localStorage.setItem('alunos', JSON.stringify(alunos));

            // Exibe a mensagem de sucesso
            document.getElementById('mensagemSucesso').style.display = 'block';
            setTimeout(() => {
                window.location.href = 'painel-aluno.html';
            }, 2000);
        });
});
