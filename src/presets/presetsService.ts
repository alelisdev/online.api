import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePresetDto } from './dto/updatePresetDto';
import { Repository } from 'typeorm';
import { Preset } from './entities/presetEntity';
import { CreatePresetDto } from './dto/createPresetDto';

@Injectable()
export class PresetsService {
  constructor(
    @InjectRepository(Preset) private presetRepo: Repository<Preset>,
  ) {}

  async create(createPresetDto: CreatePresetDto) {
    try {
      const {
        drugName,
        manufacturer,
        usageTitle,
        usageKeywords,
        dosageAndAdministrationTitle,
        dosageAndAdministrationKeywords,
        dosageFormsTitle,
        dosageFormsKeywords,
        contraindicationsTitle,
        contraindicationsKeywords,
        warningsTitle,
        warningsKeywords,
        adverseReactionsTitle,
        adverseReactionsKeywords,
        drugInteractionsTitle,
        drugInteractionsKeywords,
        lactationTitle,
        lactationKeywords,
        discussionFirstTitle,
        discussionFirstKeywords,
        discussionSecondTitle,
        discussionSecondKeywords,
      } = createPresetDto;

      const preset: Preset = this.presetRepo.create({
        drugName,
        manufacturer,
        usageTitle,
        usageKeywords,
        dosageAndAdministrationTitle,
        dosageAndAdministrationKeywords,
        dosageFormsTitle,
        dosageFormsKeywords,
        contraindicationsTitle,
        contraindicationsKeywords,
        warningsTitle,
        warningsKeywords,
        adverseReactionsTitle,
        adverseReactionsKeywords,
        drugInteractionsTitle,
        drugInteractionsKeywords,
        lactationTitle,
        lactationKeywords,
        discussionFirstTitle,
        discussionFirstKeywords,
        discussionSecondTitle,
        discussionSecondKeywords,
      });
      await this.presetRepo.save(preset);

      return {
        success: true,
        data: preset,
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
        data: await this.presetRepo.find(),
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
        data: await this.presetRepo.findOne(id),
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
        data: await this.presetRepo.find({
          where: payload,
        }),
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async update(id: string, updateTeamDto: UpdatePresetDto) {
    try {
      await this.presetRepo.update({ id }, updateTeamDto);
      return {
        success: true,
        data: await this.presetRepo.findOne(id),
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
      const result = await this.presetRepo.delete({ id });
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
