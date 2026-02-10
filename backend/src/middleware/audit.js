import prisma from "../config/db.js";

export const audit = (action, entity) => async (req, res, next) => {
    // Only audit if user is authenticated
    if (req.user && req.user.id) {
        try {
            await prisma.auditLog.create({
                data: {
                    adminId: req.user.id,
                    action,
                    entity
                }
            });
        } catch (err) {
            console.error("Audit log failed:", err);
            // Don't block the request if audit fails
        }
    }
    next();
};
