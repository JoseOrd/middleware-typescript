"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const JwtMIddleware_1 = require("./middlewares/JwtMIddleware");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json({ limit: '5mb' }));
app.use(JwtMIddleware_1.JwtMiddleware);
app.use('/api/v0', index_1.default);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
