import { authenticate } from "@/middlewares/api/auth.middleware";
import { DomainService } from "@/services/domain.service";
import { apiHandler } from "@/utils/apiHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest } from "next/server";


const domainService = new DomainService();

// GET /api/domains/:id - Fetch single  domain details by specific user
export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
    apiHandler(
        authenticate(async (user) => {
            const { id } = await params;

            const domains = await domainService.getSingleDomainForUser(user.id, id);

            return new ApiResponse(true, "Fetched Single Domain details for user", domains)

        })
    )


