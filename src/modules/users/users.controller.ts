import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserServices } from "./users.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("users")
@Controller('user')
export class userController {
    constructor(private readonly userServices: UserServices){}

    @Get("/address/:address")
    async getUserByAddress(@Param("address") address: string){
        return this.userServices.getUserByAddress(address)
    }
    @Post("/create-user")
    async createUser(@Body() address: string){
        return this.userServices.findOrCreateUser(address)
    }
    
}