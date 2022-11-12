import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsCpfIsValid } from 'src/commons/decorators/isCpfIsValid.validator';
import { IsLegalAge } from 'src/commons/decorators/isLegalAge.validator';

export class Driver {
  id: string;

  @ApiProperty({
    example: "Fulano de Tal"    
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: "2004-05-28"    
  })
  @IsNotEmpty()
  @IsString()
  @IsLegalAge()
  birthDate: Date;

  @ApiProperty({
    example: "12345678910"    
  })
  @IsNotEmpty()
  @IsString()
  @IsCpfIsValid()
  cpf: string;

  @ApiProperty({
    example: "MNZ-0001"    
  })
  @IsNotEmpty()
  @IsString()
  licensePlate: string;

  @ApiProperty({
    example: "VW Fusca"    
  })
  @IsNotEmpty()
  @IsString()
  vehicleModel: string;

  @Exclude()
  isBlocked: boolean;

  @Exclude()
  isDeleted: boolean;
}
