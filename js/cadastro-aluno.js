document.addEventListener('DOMContentLoaded', function () {
    // Simulação de dados pré-preenchidos (empresa e matrícula)
    const empresaRelacionamento = 'Empresa XYZ';
    const matricula = gerarMatricula(); // Gera uma matrícula única
    document.getElementById('empresaRelacionamento').value =
        empresaRelacionamento;
    document.getElementById('matricula').value = matricula;

    // Simulação de lista de faculdades (pode ser carregada dinamicamente)
    const faculdades = ['Faculdade A', 'Faculdade B', 'Faculdade C'];
    const selectFaculdade = document.getElementById('faculdade');

    faculdades.forEach((faculdade) => {
        const option = document.createElement('option');
        option.value = faculdade;
        option.textContent = faculdade;
        selectFaculdade.appendChild(option);
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

    // Formatação de CEP
    document.getElementById('cep').addEventListener('input', function (e) {
        let cep = e.target.value.replace(/\D/g, '');
        if (cep.length > 5) {
            cep = cep.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2-$3');
        } else if (cep.length > 2) {
            cep = cep.replace(/^(\d{2})(\d{3})$/, '$1.$2');
        }
        e.target.value = cep;
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

    // Formatação de Telefone
    document.getElementById('telefone').addEventListener('input', function (e) {
        let telefone = e.target.value.replace(/\D/g, '');
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
        mostrarErro('erroSenha', 'A senha deve ter no mínimo 6 caracteres.');
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
    function gerarMatricula() {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        let ultimaMatricula = 0;

        // Encontra a última matrícula cadastrada
        if (usuarios.length > 0) {
            ultimaMatricula = parseInt(
                usuarios[usuarios.length - 1].matricula,
                10
            );
        }

        // Gera a nova matrícula
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
            const usuario = {
                matricula: document.getElementById('matricula').value,
                empresaRelacionamento: document.getElementById(
                    'empresaRelacionamento'
                ).value,
                faculdade: document.getElementById('faculdade').value,
                nomeCompleto: document.getElementById('nomeCompleto').value,
                cpf: cpf,
                dataNascimento: document.getElementById('dataNascimento').value,
                email: email,
                telefone: telefone,
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
            usuarios.push(usuario);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            // Exibe a mensagem de sucesso
            const mensagemSucesso = document.getElementById('mensagemSucesso');
            mensagemSucesso.style.display = 'block';

            // Limpa o formulário após 2 segundos e redireciona para o painel do aluno
            setTimeout(() => {
                mensagemSucesso.style.display = 'none';
                document.getElementById('cadastroAlunoForm').reset();
                document.getElementById('matricula').value = gerarMatricula();

                // Redireciona para o painel de controle do aluno
                window.location.href = 'painel-aluno.html'; // Altere para o caminho correto do painel do aluno
            }, 2000);
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
});
