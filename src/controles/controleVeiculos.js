import { openDatabase } from "../database.js";



export const listaVeiculos = async (request, response) => {
    const db = await openDatabase();
    const veiculos = await db.all(`
        SELECT * FROM veiculos
    `);
    db.close();
    response.send(veiculos);
};

export const inserirVeiculos = async (request, response) => {
    const { modelo, tipo, motorista, observacao  } = request.body;
    const db = await openDatabase();
    const data = await db.run(`
        INSERT INTO veiculos (modelo, tipo, motorista, observacao)
        VALUES (?, ?, ?, ?)
    `, [modelo, tipo, motorista, observacao ]);
    db.close();
    response.send({
        id: data.lastID,
        modelo, 
        tipo, 
        motorista, 
        observacao
    });
};

export const updateVeiculos = async (request, response) => {
    const { modelo, tipo, motorista, observacao  } = request.body;
    const { id } = request.params;

    const db = await openDatabase();

    const veiculo = await db.get(`
        SELECT * FROM veiculos WHERE id = ?
    `, [id]);

    if (veiculo) {
        const data = await db.run(`
            UPDATE veiculos
                SET modelo = ?,
                    tipo = ?,
                    motorista = ?,
                    observacao = ?
            WHERE id = ? 
        `, [modelo, tipo, motorista, observacao, id]);

        db.close();
        response.send({
            id,
            modelo,
            tipo,
            motorista,
            observacao
        });
        return;
    }

    db.close();
    response.send(veiculo || {});
};

export const removerVeiculo = async (request, response) => {
    const { id } = request.params;
    const db = await openDatabase();
    const data = await db.run(`
        DELETE FROM veiculos
         WHERE id = ?
    `, [id]);
    db.close();
    response.send({
        id,
        message: `veículo [${id}] removido com sucesso`
    });
}