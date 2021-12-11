import PagedRequestDto from '@/shared/dtos/pagedRequestDto';

export interface GetLanguageTextsInput extends PagedRequestDto
{
  sorting?:string;
  sourceName:string;
  baseLanguageName?:string;
  targetLanguageName:string;
  targetValueFilter?:string;
  filterText?:string;
}
