import mongoose from 'mongoose';

export class MongoHelper {
  static async connect(dbUrl: string) {
    const instance = await mongoose.connect(dbUrl);

    const closeDBConnection = () =>
      (force?: boolean): Promise<void> =>
        instance.connection.close(force)

    return { closeDBConnection };
  }
}
