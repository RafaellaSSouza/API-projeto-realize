import express from 'express';
import { response,  } from 'express';
import { request } from 'express';
import { atividadeCheckin, atividadeCheckout, listaAtividades, removerAtividade } from './controles/ControleAtividades.js';
import { inserirVeiculos, 
         listaVeiculos, 
         removerVeiculo, 
         updateVeiculos } from './controles/controleVeiculos.js';
import { openDatabase } from './database.js';

const app = express();

app.use(express.json());

app.get('/api/ping', (request, response) => {
    response.send({
        mesage: 'pong'
    })
});

//veiculos
app.get('/api/veiculos', listaVeiculos);
app.post('/api/veiculos', inserirVeiculos);
app.put('/api/veiculos/:id', updateVeiculos);
app.delete('/api/veiculos/:id', removerVeiculo);

//atividades
app.post('/api/atividades/checkin', atividadeCheckin);
app.put('/api/atividades/checkout', atividadeCheckout);
app.delete('/api/atividades/:id', removerAtividade);
app.get('/api/atividades', listaAtividades);

app.listen(8000, ()=> {
    console.log("Servidor rodando na porta 8000...");
});