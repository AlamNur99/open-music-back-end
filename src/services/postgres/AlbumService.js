const {
  nanoid,
} = require('nanoid');
const {
  Pool,
} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {
  mapDBtoAlbumModel,
} = require('../../utils');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({
    name,
    year,
  }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongsFromAlbumId(albumId) {
    const album = await this.getAlbumById(albumId);
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM albums
      INNER JOIN songs ON songs.album_id = albums.id
      WHERE albums.id = $1`,
      values: [albumId],
    };

    const result = await this._pool.query(query);
    return {
      ...album,
      songs: result.rows,
    };
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return mapDBtoAlbumModel(result.rows[0]);
  }

  async editAlbumById(id, {
    name,
    year,
  }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async editAlbumWithAddedCoverById(id, coverUrl) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan');
    }
  }

  async addAlbumLikeById(albumId, userId) {
    const id = `albumLikes-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal memberikan like pada album');
    }

    await this._cacheService.delete(`user_album_likes:${albumId}`);

    return result.rows[0].id;
    // return 'Berhasil Menyukai album';
  }

  async deleteAlbumLikeById(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal membatalkan menyukai album');
    }
    await this._cacheService.delete(`user_album_likes:${albumId}`);
  }

  async getAlbumLikesById(albumId) {
    try {
      const result = await this._cacheService.get(`user_album_likes:${albumId}`);
      return {
        likes: JSON.parse(result),
        isCache: true,
      };
    } catch (error) {
      const query = {
        text: `SELECT COUNT(*) AS like_count
      FROM user_album_likes
      WHERE album_id = $1`,
        values: [albumId],
      };

      const result = await this._pool.query(query);
      if (!result.rowCount) {
        throw new InvariantError('Gagal menampilkan jumlah like album, Id tidak ditemukan');
      }

      const likes = parseInt(result.rows[0].like_count);

      await this._cacheService.set(`user_album_likes:${albumId}`, JSON.stringify(likes));

      return {
        likes,
        isCache: false,
      };
    }
  }

  async verifyUserLike(albumId, userId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError('Gagal Menyukai lagu, karena sudah menyukai sebelumya');
    }
  }

  async isAlbumExist(id) {
    const query = {
      text: 'SELECT * from albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = AlbumsService;