require('dotenv').config();
const express = require('express');
const cors = require("cors");
const path = require("path");
 
const app = express();
app.use(express.json());
app.use(cors());
 
// UI Web estática (NF001)
app.use(express.static(path.join(__dirname, 'public')));
 
const estadiaRoutes = require('./src/routes/estadia.routes');
app.use('/estadia', estadiaRoutes);
 
const veiculoRoutes = require('./src/routes/veiculo.routes');
app.use('/veiculo', veiculoRoutes);
 
const PORT = process.env.PORT || 3000;
 
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
