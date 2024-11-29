document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario');
    const formEdicao = document.getElementById('formulario-edicao');
    const resultados = document.getElementById('resultados');
    const editarItemDiv = document.getElementById('editar-item');
    let token = localStorage.getItem('token');

    // Função para enviar dados do formulário e cadastrar um novo item
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const response = await fetch('/api/itens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nome: formData.get('nome'),
                descricao: formData.get('descricao')
            })
        });

        const result = await response.json();
        console.log(result.id);

        // Atualizar a lista de itens após o cadastro
        fetchItens();
        form.reset();
    });

    // Função para buscar e listar itens cadastrados
    async function fetchItens() {
        const response = await fetch('/api/itens');
        const itens = await response.json();
        resultados.innerHTML = itens.map(item => `
            <div>
                <h3>${item.nome}</h3>
                <p>${item.descricao}</p>
                ${token ? `<button onclick="editarItem(${item.id}, '${item.nome}', '${item.descricao}')">Editar</button>
                <button onclick="deletarItem(${item.id})">Deletar</button>` : ''}
            </div>
        `).join('');
    }

    // Função para mostrar o formulário de edição com os dados do item
    window.editarItem = function(id, nome, descricao) {
        formEdicao.id.value = id;
        formEdicao.nome.value = nome;
        formEdicao.descricao.value = descricao;
        editarItemDiv.style.display = 'block';
    }

    // Função para enviar dados atualizados do formulário de edição
    formEdicao.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(formEdicao);
        const response = await fetch(`/api/itens/${formEdicao.id.value}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nome: formData.get('nome'),
                descricao: formData.get('descricao')
            })
        });

        const result = await response.json();
        console.log(result.message);

        // Atualizar a lista de itens após a edição
        fetchItens();
        formEdicao.reset();
        editarItemDiv.style.display = 'none';
    });

    // Função para deletar um item
    window.deletarItem = async function(id) {
        const response = await fetch(`/api/itens/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();
        console.log(result.message);

        // Atualizar a lista de itens após a exclusão
        fetchItens();
    }

    // Buscar e listar itens ao carregar a página
    fetchItens();
});
