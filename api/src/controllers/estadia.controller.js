const prisma = require("../data/prisma");
 
const cadastrar = async (req, res) => {
    const { veiculoId, valorHora } = req.body;
 
    // RF002.2 entrada gerada pelo banco (@default(now()))
    // RF002.3 saida fica null
    // RF002.4 valorTotal fica null
    const item = await prisma.estadia.create({
        data: {
            veiculoId: Number(veiculoId),
            valorHora: Number(valorHora),
        },
        include: { veiculo: true }
    });
 
    res.status(201).json(item);
};
 
const listar = async (req, res) => {
    const lista = await prisma.estadia.findMany({
        include: { veiculo: true }
    });
 
    res.status(200).json(lista);
};
 
const buscar = async (req, res) => {
    const { id } = req.params;
 
    const item = await prisma.estadia.findUnique({
        where: { id: Number(id) },
        include: { veiculo: true }
    });
 
    res.status(200).json(item);
};
 
const atualizar = async (req, res) => {
    const { id } = req.params;
    const { saida, valorHora } = req.body;
 
    const atual = await prisma.estadia.findUnique({
        where: { id: Number(id) }
    });
 
    let dados = { ...req.body };
 
    // RF002.5 — se saida for enviada, calcula valorTotal
    if (saida) {
        const saidaDate = new Date(saida);
        const horaFinal = valorHora !== undefined ? Number(valorHora) : atual.valorHora;
        const diffHoras = (saidaDate.getTime() - atual.entrada.getTime()) / (1000 * 60 * 60);
        dados.saida = saidaDate;
        dados.valorTotal = parseFloat((horaFinal * diffHoras).toFixed(2));
    }
 
    const item = await prisma.estadia.update({
        where: { id: Number(id) },
        data: dados,
        include: { veiculo: true }
    });
 
    res.status(200).json(item);
};
 
const excluir = async (req, res) => {
    const { id } = req.params;
 
    const item = await prisma.estadia.delete({
        where: { id: Number(id) }
    });
 
    res.status(200).json(item);
};
 
module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};
