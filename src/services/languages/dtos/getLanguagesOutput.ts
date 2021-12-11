
import { ApplicationLanguageListDto } from './applicationLanguageListDto';
import ListResultDto from '@/shared/dtos/listResultDto';

export interface GetLanguagesOutput extends ListResultDto<ApplicationLanguageListDto>{
    defaultLanguageName:string;
}
