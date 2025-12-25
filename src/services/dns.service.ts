import dns from "dns/promises";

export class DnsService {
  async verifyTxt(verificationHost: string, token: string): Promise<boolean> {
    try {
      const records = await dns.resolveTxt(verificationHost);
      console.log(records,"records");
      
      return records.flat().includes(token);
    } catch (err) {
      return false;
    }
  }
}
