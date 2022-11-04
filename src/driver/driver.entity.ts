import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsCpfIsValid } from 'src/commons/decorators/isCpfIsValid.validator';
import { IsLegalAge } from 'src/commons/decorators/isLegalAge.validator';

export class Driver {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsLegalAge()
  birthDate: Date;

  @IsNotEmpty()
  @IsString()
  @IsCpfIsValid()
  cpf: string;

  @IsNotEmpty()
  @IsString()  
  licensePlate: string;

  @IsNotEmpty()
  @IsString()
  vehicleModel: string;

  isBlocked: boolean;
}
