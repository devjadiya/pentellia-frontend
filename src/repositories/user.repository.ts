import { User } from "@/models/user.model";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super("users");
    }

} 