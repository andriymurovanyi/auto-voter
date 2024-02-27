import { IUser } from '@/models/user';
import { Faker, uk } from '@faker-js/faker';

const faker = new Faker({
  locale: [uk],
});

export interface GenerateFakeUserParams {
  withPhoneNumber: boolean;
}

export class FakerHelper {
  static generateFakeUser({
    withPhoneNumber
  }: GenerateFakeUserParams = {
    withPhoneNumber: false,
  }): IUser.BaseModel {
    const fakeUser = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: withPhoneNumber
        ? faker.phone.number('+380#########')
        : '',
    };

    const fakeUserCredentials = {
      email: faker.internet.email({
        provider: 'gmail.com',
        firstName: fakeUser.firstName,
        lastName: fakeUser.lastName,
      }),

      password: faker.internet.password({
        length: 6,
        memorable: true,
      }),
    };

    return {
      ...fakeUser,
      ...fakeUserCredentials,
      canVote: false,
    };
  }
}
