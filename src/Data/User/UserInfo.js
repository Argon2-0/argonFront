export class UserInfo{
    constructor(id, name, email, email_verified_at, picture, remember_token, createdAt, updatedAt, role_id, role_name, role_description, role_createdAt, role_updatedAt) {
      console.log(role_name);
      this.id = id;
      this.name = name;
      this.email = email;
      this.email_verified_at = email_verified_at;
      this.picture = picture;
      this.remember_token = remember_token;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.role_id = role_id;
      this.role_name = role_name;
      this.role_description = role_description;
      this.role_createdAt = role_createdAt;
      this.role_updatedAt = role_updatedAt;
    }
  };