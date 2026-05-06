const API = 'http://localhost:3000'

function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'))
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'))
    document.getElementById(id).classList.add('active')
    event.target.classList.add('active')
    if (id === 'veiculos') carregarVeiculos()
    if (id === 'estadias') { carregarVeiculos(); carregarEstadias() }
}

function showMsg(elId, texto, tipo) {
    const el = document.getElementById(elId)
    el.innerHTML = `<div class="msg msg-${tipo}">${texto}</div>`
    setTimeout(() => el.innerHTML = '', 3000)
}

function formatData(d) {
    if (!d) return '—'
    return new Date(d).toLocaleString('pt-BR')
}


async function carregarVeiculos() {
    const res = await fetch(`${API}/veiculos`)
    const veiculos = await res.json()
    const tbody = document.getElementById('tabela-veiculos')
    const select = document.getElementById('e-veiculoId')

    tbody.innerHTML = veiculos.map(v => `
      <tr>
        <td>${v.id}</td>
        <td><strong>${v.placa}</strong></td>
        <td>${v.modelo}</td>
        <td>${v.cor || '—'}</td>
        <td>${v.ano || '—'}</td>
        <td>${v.estadias.length}</td>
        <td class="actions">
          <button class="btn btn-warning" onclick="editarVeiculo(${v.id},'${v.placa}','${v.modelo}','${v.cor || ''}','${v.ano || ''}')">Editar</button>
          <button class="btn btn-danger" onclick="deletarVeiculo(${v.id})">Excluir</button>
        </td>
      </tr>
    `).join('')

    select.innerHTML = veiculos.map(v =>
        `<option value="${v.id}">${v.placa} - ${v.modelo}</option>`
    ).join('')
}

function editarVeiculo(id, placa, modelo, cor, ano) {
    document.getElementById('v-id').value = id
    document.getElementById('v-placa').value = placa
    document.getElementById('v-modelo').value = modelo
    document.getElementById('v-cor').value = cor
    document.getElementById('v-ano').value = ano
    document.getElementById('form-veiculo-titulo').textContent = 'Editar Veículo'
}

function cancelarVeiculo() {
    document.getElementById('v-id').value = ''
    document.getElementById('v-placa').value = ''
    document.getElementById('v-modelo').value = ''
    document.getElementById('v-cor').value = ''
    document.getElementById('v-ano').value = ''
    document.getElementById('form-veiculo-titulo').textContent = 'Cadastrar Veículo'
}

async function salvarVeiculo() {
    const id = document.getElementById('v-id').value
    const body = {
        placa: document.getElementById('v-placa').value,
        modelo: document.getElementById('v-modelo').value,
        cor: document.getElementById('v-cor').value,
        ano: document.getElementById('v-ano').value
    }
    if (!body.placa || !body.modelo) return showMsg('msg-veiculo', 'Placa e Modelo são obrigatórios!', 'error')

    const url = id ? `${API}/veiculos/${id}` : `${API}/veiculos`
    const method = id ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

    if (res.ok) {
        showMsg('msg-veiculo', id ? 'Veículo atualizado!' : 'Veículo cadastrado!', 'success')
        cancelarVeiculo()
        carregarVeiculos()
    } else {
        const err = await res.json()
        showMsg('msg-veiculo', 'Erro: ' + err.erro, 'error')
    }
}

async function deletarVeiculo(id) {
    if (!confirm('Deseja excluir este veículo?')) return
    const res = await fetch(`${API}/veiculos/${id}`, { method: 'DELETE' })
    if (res.ok) { showMsg('msg-veiculo', 'Veículo excluído!', 'success'); carregarVeiculos() }
    else showMsg('msg-veiculo', 'Erro ao excluir (veículo pode ter estadias).', 'error')
}


async function carregarEstadias() {
    const res = await fetch(`${API}/estadias`)
    const estadias = await res.json()
    const tbody = document.getElementById('tabela-estadias')

    tbody.innerHTML = estadias.map(e => `
      <tr>
        <td>${e.id}</td>
        <td>${e.veiculo.placa} - ${e.veiculo.modelo}</td>
        <td>${formatData(e.entrada)}</td>
        <td>${formatData(e.saida)}</td>
        <td>R$ ${e.valorHora.toFixed(2)}</td>
        <td>${e.valorTotal != null ? 'R$ ' + e.valorTotal.toFixed(2) : '—'}</td>
        <td>
          ${e.saida
            ? '<span class="badge badge-green">Saiu</span>'
            : '<span class="badge badge-yellow">No pátio</span>'}
        </td>
        <td class="actions">
          <button class="btn btn-warning" onclick="editarEstadia(${e.id}, ${e.valorHora})">Editar</button>
          <button class="btn btn-danger" onclick="deletarEstadia(${e.id})">Excluir</button>
        </td>
      </tr>
    `).join('')
}

function editarEstadia(id, valorHora) {
    document.getElementById('e-id').value = id
    document.getElementById('e-valorHora').value = valorHora
    document.getElementById('e-saida-label').style.display = 'flex'
    document.getElementById('form-estadia-titulo').textContent = 'Registrar Saída / Editar Estadia'
}

function cancelarEstadia() {
    document.getElementById('e-id').value = ''
    document.getElementById('e-valorHora').value = ''
    document.getElementById('e-saida').value = ''
    document.getElementById('e-saida-label').style.display = 'none'
    document.getElementById('form-estadia-titulo').textContent = 'Registrar Entrada'
}

async function salvarEstadia() {
    const id = document.getElementById('e-id').value
    const body = {
        veiculoId: document.getElementById('e-veiculoId').value,
        valorHora: document.getElementById('e-valorHora').value,
        saida: document.getElementById('e-saida').value || undefined
    }
    if (!body.valorHora) return showMsg('msg-estadia', 'Valor por hora é obrigatório!', 'error')

    const url = id ? `${API}/estadias/${id}` : `${API}/estadias`
    const method = id ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

    if (res.ok) {
        showMsg('msg-estadia', id ? 'Estadia atualizada!' : 'Entrada registrada!', 'success')
        cancelarEstadia()
        carregarEstadias()
    } else {
        const err = await res.json()
        showMsg('msg-estadia', 'Erro: ' + err.erro, 'error')
    }
}

async function deletarEstadia(id) {
    if (!confirm('Deseja excluir esta estadia?')) return
    const res = await fetch(`${API}/estadias/${id}`, { method: 'DELETE' })
    if (res.ok) { showMsg('msg-estadia', 'Estadia excluída!', 'success'); carregarEstadias() }
    else showMsg('msg-estadia', 'Erro ao excluir.', 'error')
}

carregarVeiculos()