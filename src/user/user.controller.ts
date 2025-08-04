import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from 'src/decorators/Roles.decorator';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
    @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({forbidNonWhitelisted:true}))
     createUserDto: CreateUserDto,
     @Req()req,
    ) {
    return this.userService.create(createUserDto);
  }

  @Get()

  findAll(@Query() query) 
  {
    return this.userService.findAll(query);  
  }
  @Patch('me')
    @Roles(['user','admin'])
    @UseGuards(AuthGuard)
    updateMe(@Req() req,@Body() updateUserDto:UpdateUserDto){
    return this.userService.updateMe(req.user,updateUserDto)
  }
  @Delete('me')
    @Roles(['user','admin'])
    @UseGuards(AuthGuard)
    deleteMe(@Req() req){
    return this.userService.deleteMe(req.user)
  }
  @Get('me')
  @Roles(['user','admin'])
  @UseGuards(AuthGuard)
  getMe(@Req() req){
    return this.userService.getMe(req.user)
  }

  @Get(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(
    @Param('id')
      id: string,
       @Body(
        new ValidationPipe(
        {forbidNonWhitelisted:true
        })) updateUserDto: UpdateUserDto)
         {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
    @Roles(['admin'])
    @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }



}
