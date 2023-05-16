export class Migration{
    constructor(id, migration, batch) {
      this.id = id;
      this.migration = migration;
      this.batch = batch;
    }
  };