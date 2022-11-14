import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePresetDto {
  @IsNotEmpty() drugName: string;
  @IsNotEmpty() manufacturer: string;
  @IsNotEmpty() usageTitle: string;
  @IsNotEmpty() usageKeywords: string;
  @IsNotEmpty() dosageAndAdministrationTitle: string;
  @IsNotEmpty() dosageAndAdministrationKeywords: string;
  @IsNotEmpty() dosageFormsTitle: string;
  @IsNotEmpty() dosageFormsKeywords: string;
  @IsNotEmpty() contraindicationsTitle: string;
  @IsNotEmpty() contraindicationsKeywords: string;
  @IsNotEmpty() warningsTitle: string;
  @IsNotEmpty() warningsKeywords: string;
  @IsNotEmpty() adverseReactionsTitle: string;
  @IsNotEmpty() adverseReactionsKeywords: string;
  @IsNotEmpty() drugInteractionsTitle: string;
  @IsNotEmpty() drugInteractionsKeywords: string;
  @IsNotEmpty() lactationTitle: string;

  @IsNotEmpty() lactationKeywords: string;
  @IsOptional() discussionFirstTitle?: string;
  @IsOptional() discussionFirstKeywords?: string;
  @IsOptional() discussionSecondTitle?: string;
  @IsOptional() discussionSecondKeywords?: string;
}
