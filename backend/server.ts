import express, { Request, Response } from 'express';
import AuthController from './src/controllers/AuthController'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.use("/user", new AuthController().Router)

app.listen(PORT, () => {
  console.log();  
});
