import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsObject, IsString, MaxLength } from 'class-validator';
import { IsCpfIsValid } from 'src/commons/decorators/isCpfIsValid.validator';
import { IsLegalAge } from 'src/commons/decorators/isLegalAge.validator';

export class Passenger {
  id: string;

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
  @IsObject()
  address: {
    zipCode: string;
    street: string;
    number: number;
    city: string;
    neighborhood: string;
    complement: string;
    state: string;
  };

  @Exclude()
  isDeleted: boolean;
}
