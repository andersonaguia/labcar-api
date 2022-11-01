import { IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class Drivers {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nome: string;

  @IsNotEmpty()
  @IsDate() //Criar decorator pra validar a idade do motorista
  dataNascimento: Date;

  @IsNotEmpty()
  @IsString()
  //Criar decorator pra validar se o cpf já está cadastrado
  cpf: string;

  @IsNotEmpty()
  @IsString()
  placa: string;

  @IsNotEmpty()
  @IsString()
  modelo: string;
}
