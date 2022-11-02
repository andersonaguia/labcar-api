import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsCpfIsValid } from 'src/utils/isCpfIsValid.validator';

export class Driver {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nome: string;

  @IsNotEmpty()
  @IsString() //Criar decorator pra validar a idade do motorista
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
