import { authenticate } from "@/middlewares/api/auth.middleware";
import { CreateDomainSchema } from "@/models/domain.model";
import { DomainService } from "@/services/domain.service";
import { apiHandler } from "@/utils/apiHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { validateInput } from "@/utils/validateInput";
import { NextRequest } from "next/server";

const domainService = new DomainService();

// POST /api/domains - Create domain
export const POST = async (req: NextRequest) =>
    apiHandler(

        authenticate(async (user) => {
            const body = await req.json();
            const data = validateInput(CreateDomainSchema, body);
            const domain = await domainService.createDomain(data.name , user.id);
            return new ApiResponse(true , "Domain inserted for user" )
        })
    );



// GET /api/domains - Fetch all domains by specific user
export const GET = async (req: NextRequest) =>
    apiHandler(
        authenticate(async (user) => {
            const domains = await domainService.getDomainsForUser(user.id);
            return { message: "Fetched Domains inserted by user", data: domains };

        })
    )