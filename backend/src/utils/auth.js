import jwt from "jsonwebtoken";

export const generateToken = (userId, role = "admin") => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

export const protectAdmin = (req, res, next) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Unauthorized: No token provided",
            code: "NO_TOKEN"
        });
    }

    const token = authHeader.split(" ")[1];

    // PRODUCTION SECURITY: Remove dev bypass in production
    // Only allow dev bypass if explicitly in development mode
    if (process.env.NODE_ENV === "development" && token === "dev-token-bypass") {
        req.user = { id: "dev", role: "admin" };
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // STRICT ADMIN CHECK: Only allow admin role
        if (!decoded.role || (decoded.role !== "admin" && decoded.role !== "ADMIN")) {
            return res.status(403).json({
                message: "Forbidden: Admin access required",
                code: "NOT_ADMIN"
            });
        }

        // Attach user info to request
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Unauthorized: Token expired",
                code: "TOKEN_EXPIRED"
            });
        }
        return res.status(403).json({
            message: "Forbidden: Invalid token",
            code: "INVALID_TOKEN"
        });
    }
};
