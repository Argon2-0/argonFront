export class Item{
    constructor(id, name, excerpt, description, picture, category, status, date, showOnHomepage, options, createdAt, updatedAt) {
      this.id = id;
      this.name = name;
      this.excerpt = excerpt;
      this.description = description;
      this.picture = picture;
      this.category = category;
      this.status = status;
      this.date = date;
      this.showOnHomepage = showOnHomepage;
      this.options = options;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  };