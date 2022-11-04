import { IsNotEmpty, IsString, MaxLength, NotContains } from 'class-validator';
import { IsCpfIsValid } from 'src/commons/decorators/isCpfIsValid.validator';
import { IsLegalAge } from 'src/commons/decorators/isLegalAge.validator';

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
  //@IsCpfIsValid()
  cpf: string;

  @IsNotEmpty()
  @IsString()
  placa: string;

  @IsNotEmpty()
  @IsString()
  modelo: string;

  isBlocked: boolean;
}
