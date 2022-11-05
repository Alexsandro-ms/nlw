module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    /* O plugin que nos permite usar variáveis ​​de ambiente em nosso código. */
    plugins: ["inline-dotenv"]
  };
};
