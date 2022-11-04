export class LegalAge {
  public birthDate(birthDate: string) {
    const today = new Date();
    const userBirthDate = new Date(birthDate);

    if (today.getFullYear() - userBirthDate.getFullYear() > 18) {
      return true;
    } else if (
      today.getFullYear() - userBirthDate.getFullYear() === 18 &&
      today.getMonth() - userBirthDate.getMonth() >= 0 &&
      today.getDate() - userBirthDate.getDate() >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
}
