import { application } from "express";
import { authRouter } from "./routes/authRouter";

export const preparePagination = (page, limit) => {
    page = Number(page);
    limit = Number(limit);

    return {
        page: page && page >= 0 ? (page -1) * limit : 0,
        limit: limit && limit > 0 ? limit : 10, 
    };
}

export const getTotalPages = (totalRecords, limit) => {
    return Math.ceil(totalRecords/limit);
}

// Connect router to express
application.use('/api/v1/auth', authRouter);