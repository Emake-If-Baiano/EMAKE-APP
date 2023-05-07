module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin', [
      "expo-notifications",
      {
        "icon": "./assets/logo.png",
        "color": "#ffffff"
      }
    ]
    ]
  };
};
