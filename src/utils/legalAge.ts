export class LegalAge {
  public birthDate(date: string) {
    const today = new Date();
    const userBirthDate = new Date(date);

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