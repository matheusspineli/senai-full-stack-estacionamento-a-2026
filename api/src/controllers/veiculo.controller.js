const prisma = require("../data/prisma");
 
const cadastrar = async (req, res) => {
    const { placa, modelo, marca, cor, ano } = req.body;
 
    const item = await prisma.veiculo.create({
        data: {
            placa: placa.toUpperCase(),
            modelo,
            marca,
            cor: cor ?? null,     // RF001.1 — opcional
            ano: ano ?? null,     // RF001.1 — opcional
        }
    });
 
    res.status(201).json(item);
};
 
const listar = async (req, res) => {
    const lista = await prisma.veiculo.findMany({
        include: { estadias: true }
    });
 
    res.status(200).json(lista);
};
 
// RF001.2 — busca por placa e retorna estadias do veículo
const buscarPorPlaca = async (req, res) => {
    const { placa } = req.params;
 
    const item = await prisma.veiculo.findUnique({
        where: { placa: placa.toUpperCase() },
        include: { estadias: true }
    });
 
    res.status(200).json(item);
};
 
const buscar = async (req, res) => {
    const { id } = req.params;
 
    const item = await prisma.veiculo.findUnique({
        where: { id: Number(id) },
        include: { estadias: true }
    });
 
    res.status(200).json(item);
};
 
const atualizar = async (req, res) => {
    const { id } = req.params;
    const { placa, modelo, marca, cor, ano } = req.body;
 
    const item = await prisma.veiculo.update({
        where: { id: Number(id) },
        data: {
            ...(placa   && { placa: placa.toUpperCase() }),
            ...(modelo  && { modelo }),
            ...(marca   && { marca }),
            ...(cor  !== undefined && { cor }),
            ...(ano  !== undefined && { ano }),
        }
    });
 
    res.status(200).json(item);
};
 
const excluir = async (req, res) => {
    const { id } = req.params;
 
    const item = await prisma.veiculo.delete({
        where: { id: Number(id) }
    });
 
    res.status(200).json(item);
};
 
module.exports = {
    cadastrar,
    listar,
    buscarPorPlaca,
    buscar,
    atualizar,
    excluir
};
