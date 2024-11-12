import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';
import {
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
} from '../controllers/appointments.controller';

const router = Router();

const getUserAppointmentsSchema = z
    .object({
        query: z.object({
            startDate: z.string().datetime().optional(),
            endDate: z.string().datetime().optional(),
        }),
    })
    .refine(
        (data) => {
            if (data.query.startDate && data.query.endDate) {
                return (
                    new Date(data.query.startDate) <=
                    new Date(data.query.endDate)
                );
            }
            return true;
        },
        {
            message: 'End date must be after start date',
        },
    );

router.get(
    '/',
    authenticateToken,
    validate(getUserAppointmentsSchema),
    getAppointments,
);

router.post('/', authenticateToken, createAppointment);
router.put('/:id', authenticateToken, updateAppointment);
router.delete('/:id', authenticateToken, deleteAppointment);

export default router;
