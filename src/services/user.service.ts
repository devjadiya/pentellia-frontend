import { CreateUserInput, User } from "@/models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "@/utils/ApiError";


export class UserService {

    private userRepo = new UserRepository();

    async createUser(data: CreateUserInput): Promise<User> {

        const user = await this.userRepo.findById(data.uid);
        if (user) {
            return user;
        }

        return await this.userRepo.create({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName , 
            wallet : 100.00
        }, data.uid);
    }

    async getUsers(): Promise<User[]> {
        return await this.userRepo.findAll();
    }



    async getUserById(id: string): Promise<User | null> {

        const user = await this.userRepo.findById(id);
        if (!user) {
            throw new ApiError(404, "User not found")
        }
        return user;

    }

}
