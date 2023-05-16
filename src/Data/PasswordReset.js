export class PasswordReset{
    constructor(id, email, token, createdAt) {
      this.id = id;
      this.email = email;
      this.token = token;
      this.createdAt = createdAt;
    }
  };
