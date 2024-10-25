export class Api {
  public static getCustomRecipients() {
    return fetch('https://api.idriss.xyz/custom-badges', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
