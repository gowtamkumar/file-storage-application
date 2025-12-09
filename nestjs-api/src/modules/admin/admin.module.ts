import { Body, CanActivate, Controller, Delete, ExecutionContext, Get, Injectable, Module, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { File } from '../../entities/file.entity';
import { SubscriptionPlan } from '../../entities/subscription-plan.entity';
import { Transaction } from '../../entities/transaction.entity';
import { User, UserRole } from '../../entities/user.entity';
import { FilesModule } from '../files/files.module';
import { UsersModule } from '../users/users.module';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user && user.role === UserRole.ADMIN;
  }
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(File) private readonly fileRepo: Repository<File>,
    @InjectRepository(SubscriptionPlan) private readonly planRepo: Repository<SubscriptionPlan>,
    @InjectRepository(Transaction) private readonly txRepo: Repository<Transaction>,
  ) {}

  @Get('dashboard')
  async getDashboard() {
    const totalUsers = await this.userRepo.count();
    const totalFiles = await this.fileRepo.count();
    const totalRevenue = await this.txRepo.createQueryBuilder('tx')
        .select('SUM(tx.amount)', 'sum')
        .where("tx.status = 'success'")
        .getRawOne(); 
        
    return {
      success: true,
      data: {
        totalUsers,
        totalFiles,
        totalRevenue: totalRevenue ? parseFloat(totalRevenue.sum) : 0,
      }
    };
  }

  // Users Management
  @Get('users')
  async getUsers() {
    return { success: true, data: await this.userRepo.find() };
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    await this.userRepo.delete(id);
    return { success: true };
  }

  // Files Management
  @Get('files')
  async getFiles() {
    const files = await this.fileRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return { success: true, data: files };
  }

  // Transactions Management
  @Get('transactions')
  async getTransactions(@Query('userId') userId?: string) {
    const query: any = {
      order: { createdAt: 'DESC' },
      relations: ['user'],
    };
    if (userId) {
      query.where = { userId };
    }
    const transactions = await this.txRepo.find(query);
    return { success: true, data: transactions };
  }

  // Plans Management
  @Get('plans')
  async getPlans() {
    return { success: true, data: await this.planRepo.find({ order: { displayOrder: 'ASC' } }) };
  }

  @Post('plans')
  async createPlan(@Body() body: any) {
    const plan = this.planRepo.create(body);
    await this.planRepo.save(plan);
    return { success: true, data: plan };
  }

  @Patch('plans/:id')
  async updatePlan(@Param('id') id: string, @Body() body: any) {
    await this.planRepo.update(id, body);
    return { success: true, data: await this.planRepo.findOne({ where: { id } }) };
  }
}

@Module({
  imports: [
    TypeOrmModule.forFeature([User, File, SubscriptionPlan, Transaction]),
    UsersModule,
    FilesModule
  ],
  controllers: [AdminController],
  providers: [RolesGuard]
})
export class AdminModule {}
