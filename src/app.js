import express from 'express'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import { __dirname } from './utils.js'
import socketProducts from './listener/socketProducts.js'
import socketChat from './listener/socketChat.js'
import connectDB from './config/db.js'
import { appConfig, mailerConfig, passportConfig, sessionConfig } from './config/app.config.js'
import { initializeRoutes } from './routes/index.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080


const startServer = async () => {
    try {
        appConfig(app)
        await connectDB()
        sessionConfig(app)
        passportConfig(app)

        initializeRoutes(app)

        const transport = mailerConfig()
        
        app.get("/mail", async (req, res) => {
            let result = await transport.sendMail({
                from: "claudio@coder.com",
                to: "claudiom.garcia77@gmail.com",
                subject: "Prueba de funcionamiento",
                html: `<div>
                <h1>Orden # ${ticket.code}</h1>
                <p>Total de compra $ ${ticket.amount}.-</p>
                <p>Gracias por su compra</p>
                </div>`
            })
        
        })

        const httpServer = app.listen(PORT, console.log(`Server running on: http://localhost:${PORT}`))

        const socketServer = new Server(httpServer)
        socketProducts(socketServer)
        socketChat(socketServer)
    } catch (error) {
        console.error('Failed to connect to the database', error)
        process.exit(1)
    }
}

startServer()