
import { Module } from "@nestjs/common";
import { userController } from "./users.controller";
import { UserServices } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./domain/users.entity";

@Module({
    imports:[TypeOrmModule.forFeature([UserEntity])],
    controllers:[userController],
    providers:[UserServices],
    exports:[UserServices]
})
export class UsersModule{}