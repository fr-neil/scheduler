import { Request, Response, NextFunction } from 'express';
import { db } from '../lib/db';
import { RequestWithUser } from '../middleware/auth';

export async function getAppointments(
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
) {
    const { startDate, endDate } = req.query;
    const userId = req.user!.id;

    try {
        const appointments = await db.appointment.findMany({
            where: {
                OR: [{ userId }, { doctorId: userId }],
                AND: [
                    { startTime: { gte: new Date(startDate as string) } },
                    { endTime: { lte: new Date(endDate as string) } },
                ],
            },
            select: {
                id: true,
                title: true,
                startTime: true,
                endTime: true,
                status: true,
                patient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                startTime: 'asc',
            },
        });

        res.json(appointments);
    } catch (error) {
        next(error);
    }
}

export async function createAppointment(
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
) {
    try {
        const { title, startTime, endTime, doctorId } = req.body;
        const appointment = await db.appointment.create({
            data: {
                title,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                userId: req.user!.id,
                doctorId,
                status: 'SCHEDULED',
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.status(201).json(appointment);
    } catch (error) {
        next(error);
    }
}

export async function updateAppointment(
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
) {
    try {
        const { id } = req.params;
        const { title, startTime, endTime, status } = req.body;

        const appointment = await db.appointment.update({
            where: {
                id,
                OR: [{ userId: req.user!.id }, { doctorId: req.user!.id }],
            },
            data: {
                title,
                startTime: startTime ? new Date(startTime) : undefined,
                endTime: endTime ? new Date(endTime) : undefined,
                status,
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(appointment);
    } catch (error) {
        next(error);
    }
}

export async function deleteAppointment(
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
) {
    try {
        const { id } = req.params;

        const appointment = await db.appointment.delete({
            where: {
                id,
                OR: [{ userId: req.user!.id }, { doctorId: req.user!.id }],
            },
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}
