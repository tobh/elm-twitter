const { extractUrls } = require('./util');

const normalizeUser = ({ name, screen_name, profile_image_url_https }) => ({
  name,
  screen_name,
  profile_image_url_https
});

module.exports = (data) => {
  const tweet = data.retweeted_status || data;

  const photos = (
    tweet.extended_entities &&
    tweet.extended_entities.media &&
    tweet.extended_entities.media
      .filter(media => media.type === 'photo')
      .map(({ media_url_https }) => media_url_https)
  );

  const text = extractUrls(tweet.text);
  if (text[text.length - 1].includes('http')) {
    text.pop();
  }

  return {
    id: tweet.id_str,
    created_at: tweet.created_at,
    description: text,
    user: normalizeUser(tweet.user),
    retweet: data.retweeted_status ? normalizeUser(data.user) : undefined,
    photos
  };
};
