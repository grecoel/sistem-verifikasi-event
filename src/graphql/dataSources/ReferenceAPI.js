const { eq } = require('drizzle-orm');

class ReferenceAPI {
  constructor(options) {
    this.db = options.db;
  }

  async getProvinsi() {
    const { provinsi } = require('../../db/schema');
    return await this.db.select().from(provinsi);
  }

  async getProvinsiById(id) {
    const { provinsi } = require('../../db/schema');
    const result = await this.db.select().from(provinsi).where(eq(provinsi.id, id));
    return result[0] || null;
  }

  async getKota(provinsiId) {
    const { kota } = require('../../db/schema');
    return await this.db.select().from(kota).where(eq(kota.provinsi_id, provinsiId));
  }

  async getKotaById(id) {
    const { kota } = require('../../db/schema');
    const result = await this.db.select().from(kota).where(eq(kota.id, id));
    return result[0] || null;
  }

  async getKategoriAcara(isActive) {
    const { kategori_acara } = require('../../db/schema');
    let query = this.db.select().from(kategori_acara);
    
    if (isActive !== undefined) {
      query = query.where(eq(kategori_acara.is_active, isActive));
    }
    
    return await query;
  }

  async getKategoriAcaraById(id) {
    const { kategori_acara } = require('../../db/schema');
    const result = await this.db.select().from(kategori_acara).where(eq(kategori_acara.id, id));
    return result[0] || null;
  }
}

module.exports = ReferenceAPI;
