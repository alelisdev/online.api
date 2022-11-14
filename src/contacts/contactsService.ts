import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contactEntity';
import { CreateContactDto } from './dto/createContactDto';
import { UpdateContactDto } from './dto/updateContactDto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact) private contactRepo: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto) {
    try {
      const { username, email, avatar, userId } = createContactDto;

      // check if the user exists in the db
      const usernameInDb = await this.contactRepo.findOne({
        where: { username },
      });

      if (usernameInDb) {
        return {
          success: false,
          message: 'Username already exists',
        };
      }

      // check if the user exists in the db
      const emailInDb = await this.contactRepo.findOne({
        where: { email },
      });

      if (emailInDb) {
        return {
          success: false,
          message: 'Email already exists',
        };
      }

      const contact: Contact = await this.contactRepo.create({
        username,
        email,
        avatar,
        userId,
      });
      await this.contactRepo.save(contact);

      return {
        success: true,
        user: contact,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async findAll() {
    try {
      return {
        success: true,
        data: await this.contactRepo.find(),
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async findAllByPayload(payload: any) {
    try {
      return {
        success: true,
        data: await this.contactRepo.find({ where: payload }),
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async findOne(id: string) {
    try {
      return {
        success: true,
        data: await this.contactRepo.findOne(id),
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    try {
      await this.contactRepo.update({ id }, updateContactDto);
      return {
        success: true,
        data: await this.contactRepo.findOne(id),
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async remove(id: string) {
    try {
      const result = await this.contactRepo.delete({ id });
      return {
        success: true,
        data: result,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }
}
