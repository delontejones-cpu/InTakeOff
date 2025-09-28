import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'InTakeOff API' });
});

app.get('/api/patients', (req, res) => {
  res.json({ 
    patients: [],
    message: 'Patient data will be implemented here' 
  });
});

app.listen(port, () => {
  console.log(`InTakeOff API server running on port ${port}`);
});