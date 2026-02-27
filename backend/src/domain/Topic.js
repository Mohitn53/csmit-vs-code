/**
 * Topic Domain Model
 * Represents a technology topic being tracked
 */
export class Topic {
  constructor({
    id = null,
    primary_name,
    category,
    synonyms = [],
    job_roles = [],
    created_at = null
  }) {
    this.id = id;
    this.primary_name = primary_name;
    this.category = category;
    this.synonyms = synonyms;
    this.job_roles = job_roles;
    this.created_at = created_at;
  }

  // Validate topic data
  validate() {
    if (!this.primary_name || this.primary_name.trim() === '') {
      throw new Error('Topic must have a primary name');
    }
    if (!this.category || this.category.trim() === '') {
      throw new Error('Topic must have a category');
    }
    if (!Array.isArray(this.synonyms)) {
      throw new Error('Synonyms must be an array');
    }
    if (!Array.isArray(this.job_roles)) {
      throw new Error('Job roles must be an array');
    }
    return true;
  }

  // Convert to plain object for storage
  toJSON() {
    return {
      id: this.id,
      primary_name: this.primary_name,
      category: this.category,
      synonyms: this.synonyms,
      job_roles: this.job_roles,
      created_at: this.created_at
    };
  }

  // Create from database row
  static fromDB(row) {
    return new Topic({
      id: row.id,
      primary_name: row.primary_name,
      category: row.category,
      synonyms: row.synonyms || [],
      job_roles: row.job_roles || [],
      created_at: row.created_at
    });
  }
}

export default Topic;
