import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsCpfIsValid } from 'src/utils/isCpfIsValid.validator';
import { IsLegalAge } from 'src/utils/isLegalAge.validator';


export class Driver {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nome: string;

  @IsNotEmpty()
  @IsString()
  @IsLegalAge()
  dataNascimento: Date;

  @IsNotEmpty()
  @IsString()
  @IsCpfIsValid()
  cpf: string;

  @IsNotEmpty()
  @IsString()
  placa: string;

  @IsNotEmpty()
  @IsString()
  modelo: string;

  isBlocked: boolean;
}
