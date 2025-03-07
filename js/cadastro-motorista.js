document.addEventListener('DOMContentLoaded', function () {
    // Se o acesso vier via link gerado pelo gestor, preenche os campos e bloqueia edição
    const params = new URLSearchParams(window.location.search);
    const driverId = params.get('driverId');
    if (driverId) {
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

        // Se os parâmetros extras do Curso de T.C. estiverem na URL, pré-preenche
        const cursoTC = params.get('cursoTC');
        if (cursoTC) {
            const cursoTCElement = document.getElementById('cursoTC');
            if (cursoTCElement) {
                cursoTCElement.value = cursoTC;
                cursoTCElement.dispatchEvent(new Event('change'));
            }
        }
        if (params.get('certificado')) {
            document.getElementById('certificado').value = decodeURIComponent(
                params.get('certificado')
            );
        }
        if (params.get('validadeCTC')) {
            document.getElementById('validadeCTC').value =
                params.get('validadeCTC');
        }

        // Bloqueia edição dos campos pré‑preenchidos
        document.getElementById('nomeCompleto').readOnly = true;
        document.getElementById('cnh').readOnly = true;
        document.getElementById('categoria').readOnly = true;
        document.getElementById('expedicao').readOnly = true;
        document.getElementById('validade').readOnly = true;
    }

    // Ao alterar o campo categoria, se contiver a letra "D", exibe (ou insere) o bloco de Curso de T.C.
    const categoriaInput = document.getElementById('categoria');
    if (categoriaInput) {
        categoriaInput.addEventListener('input', function () {
            const categoria = categoriaInput.value;
            let divCursoTC = document.getElementById('divCursoTC');
            // Se a nova categoria inclui "D" e o bloco não existe, injetamos-o
            if (/d/i.test(categoria)) {
                if (!divCursoTC) {
                    divCursoTC = document.createElement('div');
                    divCursoTC.id = 'divCursoTC';
                    divCursoTC.innerHTML = `
                        <label>Curso de T.C. (sim/não):</label>
                        <select id="cursoTC" required>
                          <option value="">Selecione...</option>
                          <option value="sim">Sim</option>
                          <option value="nao">Não</option>
                        </select>
                        <div id="divCertificado" style="display:none;">
                          <label>Certificado:</label>
                          <input type="text" id="certificado" maxlength="15" required>
                          <label>Validade do CTC:</label>
                          <input type="date" id="validadeCTC" required>
                        </div>
                    `;
                    // Insere o bloco logo após o campo categoria ou antes do botão de submit
                    const form = document.getElementById(
                        'cadastroMotoristaForm'
                    );
                    form.insertBefore(
                        divCursoTC,
                        form.querySelector('button[type="submit"]')
                    );
                    // Adiciona o listener para exibir/esconder os campos de certificado
                    document
                        .getElementById('cursoTC')
                        .addEventListener('change', function () {
                            const divCertificado =
                                document.getElementById('divCertificado');
                            if (this.value === 'sim') {
                                divCertificado.style.display = 'block';
                                document
                                    .getElementById('certificado')
                                    .setAttribute('required', '');
                                document
                                    .getElementById('validadeCTC')
                                    .setAttribute('required', '');
                            } else {
                                divCertificado.style.display = 'none';
                                document
                                    .getElementById('certificado')
                                    .removeAttribute('required');
                                document
                                    .getElementById('validadeCTC')
                                    .removeAttribute('required');
                            }
                        });
                }
            } else {
                // Se a nova categoria NÃO inclui "D", remove o bloco se existir
                if (divCursoTC) {
                    divCursoTC.remove();
                }
            }
        });
    }

    // Exibe/esconde os campos do certificado conforme seleção do Curso de T.C.
    const cursoTCSelect = document.getElementById('cursoTC');
    if (cursoTCSelect) {
        cursoTCSelect.addEventListener('change', function () {
            const divCertificado = document.getElementById('divCertificado');
            if (divCertificado) {
                if (this.value === 'sim') {
                    divCertificado.style.display = 'block';
                    document
                        .getElementById('certificado')
                        .setAttribute('required', '');
                    document
                        .getElementById('validadeCTC')
                        .setAttribute('required', '');
                } else {
                    divCertificado.style.display = 'none';
                    document
                        .getElementById('certificado')
                        .removeAttribute('required');
                    document
                        .getElementById('validadeCTC')
                        .removeAttribute('required');
                }
            }
        });
    }

    // Funções para mostrar/ocultar mensagens de erro
    function mostrarErro(id, mensagem) {
        const erroElemento = document.getElementById(id);
        if (erroElemento) {
            erroElemento.textContent = mensagem;
            erroElemento.style.display = 'block';
        }
    }

    function esconderErro(id) {
        const erroElemento = document.getElementById(id);
        if (erroElemento) {
            erroElemento.style.display = 'none';
        }
    }

    // Função para validar que uma string contém apenas letras e espaços
    function validarNome(nome) {
        return /^[A-Za-zÀ-ú\s]{8,}$/.test(nome);
    }

    // Validação para CNH: exatamente 11 dígitos
    function validarCNH(cnh) {
        return /^\d{11}$/.test(cnh);
    }

    // Validação para categoria: apenas letras, de 1 a 5 caracteres
    function validarCategoria(cat) {
        return /^[A-Za-zÀ-ú]{1,5}$/.test(cat);
    }

    // Formatação de CPF, telefone, CEP
    function formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length > 11) cpf = cpf.substring(0, 11);
        if (cpf.length > 9) {
            cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        } else if (cpf.length > 6) {
            cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1.$2.$3');
        } else if (cpf.length > 3) {
            cpf = cpf.replace(/^(\d{3})(\d{3})$/, '$1.$2');
        }
        return cpf;
    }

    function formatarTelefone(telefone) {
        telefone = telefone.replace(/\D/g, '');
        if (telefone.length > 11) telefone = telefone.substring(0, 11);
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
        return telefone;
    }

    function formatarCEP(cep) {
        cep = cep.replace(/\D/g, '');
        if (cep.length > 8) cep = cep.substring(0, 8);
        if (cep.length > 5) {
            cep = cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
        }
        return cep;
    }

    // Validação de confirmação de senha
    const confirmarSenhaInput = document.getElementById('confirmarSenha');
    if (confirmarSenhaInput) {
        confirmarSenhaInput.addEventListener('input', function () {
            const senha = document.getElementById('senha').value;
            const confirmarSenha = confirmarSenhaInput.value;
            if (senha !== confirmarSenha) {
                mostrarErro('erroConfirmarSenha', 'As senhas não coincidem.');
            } else {
                esconderErro('erroConfirmarSenha');
            }
        });
    }

    // Outras validações de formatação e campos obrigatórios
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function (e) {
            e.target.value = formatarCPF(e.target.value);
            if (e.target.value.replace(/\D/g, '').length !== 11) {
                mostrarErro('erroCpf', 'CPF deve ter 11 dígitos.');
            } else {
                esconderErro('erroCpf');
            }
        });
    }

    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function (e) {
            e.target.value = formatarTelefone(e.target.value);
            const telNum = e.target.value.replace(/\D/g, '');
            if (telNum.length < 10 || telNum.length > 11) {
                mostrarErro(
                    'erroTelefone',
                    'Telefone deve ter 10 ou 11 dígitos.'
                );
            } else {
                esconderErro('erroTelefone');
            }
        });
    }

    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function (e) {
            e.target.value = formatarCEP(e.target.value);
            if (e.target.value.replace(/\D/g, '').length !== 8) {
                mostrarErro('erroCep', 'CEP deve ter 8 dígitos.');
            } else {
                esconderErro('erroCep');
            }
        });
    }

    const nomeCompletoInput = document.getElementById('nomeCompleto');
    if (nomeCompletoInput) {
        nomeCompletoInput.addEventListener('input', function (e) {
            if (!validarNome(e.target.value)) {
                mostrarErro(
                    'erroNomeCompleto',
                    'Nome deve ter no mínimo 8 caracteres e conter apenas letras.'
                );
            } else {
                esconderErro('erroNomeCompleto');
            }
        });
    }

    const cnhInput = document.getElementById('cnh');
    if (cnhInput) {
        cnhInput.addEventListener('input', function (e) {
            if (!validarCNH(e.target.value)) {
                mostrarErro(
                    'erroCNH',
                    'CNH deve conter exatamente 11 dígitos.'
                );
            } else {
                esconderErro('erroCNH');
            }
        });
    }

    const categoriaInputCadastro = document.getElementById('categoria');
    if (categoriaInputCadastro) {
        categoriaInputCadastro.addEventListener('input', function (e) {
            if (!validarCategoria(e.target.value)) {
                mostrarErro(
                    'erroCategoria',
                    'Categoria deve conter apenas letras e ter de 1 a 5 caracteres.'
                );
            } else {
                esconderErro('erroCategoria');
            }
        });
    }

    // SUBMISSÃO DO FORMULÁRIO – LÓGICA DIFERENCIADA PARA FINALIZAÇÃO
    const cadastroMotoristaForm = document.getElementById(
        'cadastroMotoristaForm'
    );
    if (cadastroMotoristaForm) {
        cadastroMotoristaForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Verifica campos obrigatórios
            const camposObrigatorios = document.querySelectorAll(
                'input[required], select[required]'
            );
            let formularioValido = true;
            camposObrigatorios.forEach((campo) => {
                if (!campo.value) {
                    mostrarErro('erro' + campo.id, 'Este campo é obrigatório.');
                    formularioValido = false;
                }
            });
            if (!formularioValido) return;

            // Verifica confirmação de senha
            const senha = document.getElementById('senha').value;
            const confirmarSenha =
                document.getElementById('confirmarSenha').value;
            if (senha !== confirmarSenha) {
                mostrarErro('erroConfirmarSenha', 'As senhas não coincidem.');
                return;
            }

            // Valida Nome Completo, CNH e Categoria
            if (!validarNome(document.getElementById('nomeCompleto').value)) {
                alert('Nome Completo inválido.');
                return;
            }
            if (!validarCNH(document.getElementById('cnh').value)) {
                alert('CNH inválida. Deve conter exatamente 11 dígitos.');
                return;
            }
            if (!validarCategoria(document.getElementById('categoria').value)) {
                alert('Categoria inválida.');
                return;
            }

            // Se a categoria contiver "D", valida os campos do Curso de T.C.
            if (/d/i.test(document.getElementById('categoria').value)) {
                const cursoTC = document.getElementById('cursoTC').value;
                if (!cursoTC) {
                    alert('Selecione se possui Curso de T.C.');
                    return;
                }
                if (cursoTC === 'sim') {
                    const certificado = document
                        .getElementById('certificado')
                        .value.trim();
                    const validadeCTC =
                        document.getElementById('validadeCTC').value;
                    if (!certificado || !validadeCTC) {
                        alert('Preencha o certificado e a validade do CTC.');
                        return;
                    }
                    if (!/^[A-Za-z0-9]{1,15}$/.test(certificado)) {
                        alert(
                            'Certificado deve conter apenas letras e números, até 15 caracteres.'
                        );
                        return;
                    }
                    if (new Date(validadeCTC) <= new Date()) {
                        alert('Validade do CTC deve ser uma data futura.');
                        return;
                    }
                }
            }

            // Cria objeto motorista com os dados coletados
            const motoristData = {
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
                status: 'concluido', // Ao finalizar, o status passa a ser "concluido"
            };

            // Se a categoria possui "D", inclui os dados do Curso de T.C.
            if (/d/i.test(motoristData.categoria)) {
                motoristData.cursoTC = document.getElementById('cursoTC').value;
                if (motoristData.cursoTC === 'sim') {
                    motoristData.certificado = document
                        .getElementById('certificado')
                        .value.trim();
                    motoristData.validadeCTC =
                        document.getElementById('validadeCTC').value;
                }
            }

            let motoristas =
                JSON.parse(localStorage.getItem('motoristas')) || [];
            if (driverId) {
                // Se driverId existe, é uma finalização – atualiza o registro existente
                const index = motoristas.findIndex((m) => m.id === driverId);
                if (index !== -1) {
                    // Atualiza os dados do registro pendente
                    motoristas[index] = {
                        ...motoristas[index],
                        ...motoristData,
                    };
                    localStorage.setItem(
                        'motoristas',
                        JSON.stringify(motoristas)
                    );
                    alert('Cadastro concluído com sucesso!');
                    window.location.href = 'painel-motorista.html';
                } else {
                    // Caso não encontre, adiciona como novo (caso excepcional)
                    motoristas.push(motoristData);
                    localStorage.setItem(
                        'motoristas',
                        JSON.stringify(motoristas)
                    );
                    alert('Cadastro concluído com sucesso!');
                    window.location.href = 'painel-motorista.html';
                }
            } else {
                // Para novo cadastro, verifica duplicidade de CNH
                if (motoristas.some((m) => m.cnh === motoristData.cnh)) {
                    alert('Já existe um motorista cadastrado com essa CNH.');
                    return;
                }
                motoristas.push(motoristData);
                localStorage.setItem('motoristas', JSON.stringify(motoristas));
                alert('Motorista cadastrado com sucesso!');
                window.location.href = 'painel-motorista.html';
            }
        });
    } else {
        console.error('Formulário de cadastro não encontrado!');
    }
});
