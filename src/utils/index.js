const mapDBtoAlbumModel = ({
  id,
  name,
  year
}) => ({
  id,
  name,
  year,
});

const mapDBtoSongsModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const mapGetPlaylistActivitiesDBToModel = ({
  username,
  title,
  action,
  time,
}) => ({
  username,
  title,
  action,
  time,
});

module.exports = {
  mapDBtoAlbumModel,
  mapDBtoSongsModel,
  mapGetPlaylistActivitiesDBToModel,
};