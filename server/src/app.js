import express from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import v1Router from '../src/routers/v1/index.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import path from 'node:path';

const app = express();

app.use(express.json());
app.use(hpp());
app.use(helmet());
app.use(cookieParser());

app.use('/api/v1', v1Router);
app.use('/api/v1/photos', express.static(path.join(process.cwd(), 'storage/photos')));
app.use('/api/v1/barcodes', express.static(path.join(process.cwd(), 'storage/barcodes')));

app.use((res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

app.use(globalErrorHandler);

export default app;
