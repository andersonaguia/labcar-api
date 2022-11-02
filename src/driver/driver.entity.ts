import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsCpfExists } from 'src/utils/isCpfExists.validator';

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
  @IsCpfExists() //Criar decorator pra validar se o cpf já está cadastrado
  cpf: string;

  @IsNotEmpty()
  @IsString()
  placa: string;

  @IsNotEmpty()
  @IsString()
  modelo: string;

  isBlocked: boolean;
}
