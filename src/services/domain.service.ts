import {  Domain } from "@/models/domain.model";
import { DomainRepository } from "@/repositories/domain.repository";
import { ApiError } from "@/utils/ApiError";
import crypto from "crypto";
import { DnsService } from "./dns.service";

//TODO add domain verification process

export class DomainService {
    private domainRepo = new DomainRepository();

    private dnsService = new DnsService();


    async generateVerificationToken(): Promise<string> {
        return crypto.randomBytes(16).toString("hex");
    }


    normalizeDomain(input: string): string {
        return input
            .trim()
            .toLowerCase()
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .replace(/\/.*$/, "");
    }

    async getDomainsForUser(userId: string): Promise<Domain[]> {

        return this.domainRepo.findByUserId(userId);
    }

    async getSingleDomainForUser(userId: string, domainId: string): Promise<Domain | null> {

        const domainDoc = await this.domainRepo.findByUserAndDomainId(userId, domainId);

        if (!domainDoc) {
            throw new ApiError(400, "Domain does not exists for this user");
        }

        return domainDoc

    }

    async verifyDomain( userId: string , domainId: string) {
        const domain = await this.domainRepo.findByUserAndDomainId(userId, domainId);
        if (!domain) throw new ApiError(404, "Domain not found");


        const isValid = await this.dnsService.verifyTxt(
            domain.verificationHost,
            domain.verificationToken
        );

        if (!isValid) {
            throw new ApiError(400, "TXT record not found");
        }

        await this.domainRepo.update(domainId, { isVerified: true });

    }



    async createDomain(name: string, userId: string): Promise<Domain> {

        const domain = this.normalizeDomain(name);

        const domainDoc = await this.domainRepo.findByUserAndDomainName(userId, domain);

        if (domainDoc) {
            throw new ApiError(400, "Domain already exists for this user");
        }

        return this.domainRepo.create({
            name: domain,
            userId: userId,
            verificationToken: await this.generateVerificationToken(),
            verificationHost : `_pentellia.${domain}`,
            isVerified: false,
        });

    }
}
