export class PromiseUtils {
  static sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
