export class UserCreate{
    constructor(name, email, password,  role, createdAt) {
      this.name = name;
      this.email = email;
      this.password = password;
      this.role = role;
      this.createdAt = createdAt;
    }
  };