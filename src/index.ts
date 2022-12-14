import express from 'express';
import router from './router';

const app = express();

app.use(express.json());
app.use('/api/v0/', router);

app.listen(3000, () => {
  console.log('listening on port 3000');
});
