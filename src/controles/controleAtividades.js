import { openDatabase } from "../database.js";


export const atividadeCheckin = async (request, response) => {
    const { motorista } = request.body;

    const db = await openDatabase();
    const veiculo = await db.get(`
        SELECT * FROM veiculos WHERE motorista = ?
    `, [motorista]);

    if(veiculo) {
        const horaInicio = (new Date()).getTime()
        const data = await db.run(`
            INSERT INTO atividades (veiculo_id, hora_inicio)
            VALUES (?, ?)
        `, [veiculo.id, horaInicio]);
        db.close();
        response.send({
            veiculo_id: veiculo.id,
            hora_inicio: horaInicio,
            message: `[${veiculo.motorista}] iniciou o trabalho.`
        });
        return;
    }

    db.close();
    response.status(400).send({
        message: `Motorista [${motorista}] não cadastrado.`
    });
};

export const atividadeCheckout = async (request, response) => {
    const { motorista, preco } = request.body;

    const db = await openDatabase();
    const veiculo = await db.get(`
        SELECT * FROM veiculos WHERE motorista = ?
    `, [motorista]);

    if(veiculo) {
        const atividadeAberta = await db.get(`
            SELECT * 
              FROM atividades 
             WHERE veiculo_id = ?
              AND hora_fim IS NULL
        `, [veiculo.id]);

        if(atividadeAberta) {
            const horaFim = (new Date()).getTime();
            const data = await db.run(`
                UPDATE atividades 
                  SET hora_fim = ?,
                      preco = ?
                 WHERE id = ?
            `, [horaFim, preco, atividadeAberta.id]);
        db.close();
        response.send({
            veiculo_id: veiculo.id,
            hora_Fim: horaFim,
            preco: preco,
            message: `[${veiculo.motorista}] encerrou o trabalho.`
        });
        return;
        }

        db.close();
        response.status(400).send({
            message: `Motorista [${motorista}] não começou nenhum trabalho.`
        });
        return;        
    }

    db.close();
    response.status(400).send({
        message: `Motorista [${motorista}] não cadastrado.`
    });   
};

export const removerAtividade = async (request, response) => {
    const { id } = request.params;
    const db = await openDatabase();
    const data = await db.run(`
        DELETE FROM atividades
         WHERE id = ?
    `, [id]);
    db.close();
    response.send({
        id,
        message: `Atividade [${id}] removida com sucesso`
    });
};

export const listaAtividades = async (request, response) => {
    const db = await openDatabase();
    const atividades = await db.all(`
        SELECT * FROM atividades
    `);
    db.close();
    response.send(atividades); 
};