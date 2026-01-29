import { CreateUserInput } from "@/models/user.model";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<CreateUserInput> {
  constructor() {
    super("users");
  }
}
