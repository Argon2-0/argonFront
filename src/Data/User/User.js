export class User{
    constructor(id, name, email, email_verified_at, password, picture, role, remember_token, createdAt, updatedAt) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.email_verified_at = email_verified_at;
      this.password = password;
      this.picture = picture;
      this.role = role;
      this.remember_token = remember_token;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  };