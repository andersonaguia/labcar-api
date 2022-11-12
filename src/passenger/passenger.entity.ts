import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsObject, IsString, MaxLength } from 'class-validator';
import { IsCpfIsValid } from 'src/commons/decorators/isCpfIsValid.validator';
import { IsLegalAge } from 'src/commons/decorators/isLegalAge.validator';

export class Passenger {
  id: string;

  @ApiProperty({
    example: "Fulano de Tal"    
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nome: string;

  @ApiProperty({
    example: "2000-05-20"    
  })
  @IsNotEmpty()
  @IsString()
  @IsLegalAge()
  dataNascimento: Date;

  @ApiProperty({
    example: "12345678910"    
  })
  @IsNotEmpty()
  @IsString()
  @IsCpfIsValid()
  cpf: string;

  @ApiProperty({
    example: {
      zipCode: "58000-000",
      street: "Rua JavaScript",
      number: 100,
      city: "São Paulo",
      state: "SP",
      neighborhood: "Centro",
      complement: "APTO 200 Bloco A"
    }    
  })
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
