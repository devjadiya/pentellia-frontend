import { authenticate } from "@/middlewares/api/auth.middleware";
import { DomainService } from "@/services/domain.service";
import { apiHandler } from "@/utils/apiHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest } from "next/server";

const domainService = new DomainService()


// POST to verify domain txt record
export const POST = (req: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
    apiHandler(
        authenticate(async (user) => {
            const { id } = await params;

             await domainService.verifyDomain(user.id, id);

            return new ApiResponse(true, "Domain verified successfully");

        })
    );
