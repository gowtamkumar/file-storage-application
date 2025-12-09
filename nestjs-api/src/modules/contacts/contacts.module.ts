import { Body, Controller, Module, Post } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../../entities/contact.entity';

@Controller('contact')
export class ContactsController {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
  ) {}

  @Post()
  async create(@Body() createContactDto: any) {
    const contact = this.contactsRepository.create(createContactDto);
    await this.contactsRepository.save(contact);
    return { success: true, message: 'Message sent successfully' };
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  controllers: [ContactsController],
  exports: [TypeOrmModule], // For Admin
})
export class ContactsModule {}
