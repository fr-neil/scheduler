import { User, Appointment, UserRole, AppointmentStatus } from '@prisma/client';

export type { User, Appointment };
export { UserRole, AppointmentStatus };

export type CreateUserInput = {
    name: string;
    email: string;
    password: string;
};

export type CreateAppointmentInput = {
    userId: string;
    doctorId: string;
    startTime: Date;
    endTime: Date;
    title: string;
    status: AppointmentStatus;
};
