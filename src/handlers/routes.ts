import express, { Request, Response } from "express";
import { AppDataSource } from "../database/database";
import { Room } from "../database/entities/room";
import { generateValidationErrorMessage } from "./validators/generate-validation-message";
import { roomValidation } from "./validators/room-validator";

export const initRoutes = (app: express.Express) => {
    app.get("/health", (req: Request, res: Response) => {
        res.send({ "message": "Cinema: Nothingbetterthanal" })
    })
    app.post("/rooms", async (req: Request, res: Response) => {
        const validation = roomValidation.validate(req.body)
    
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }
    
        const roomRequest = validation.value
        const roomRepo = AppDataSource.getRepository(Room)
        try {
            const roomCreated = await roomRepo.save(
                roomRequest
            )
            res.status(201).send(roomCreated)
        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })
    
}