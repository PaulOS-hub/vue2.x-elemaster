const prod = ["transform-remove-console"]
const dev = []
let currentPlugin
// 发布阶段移除console
currentPlugin = process.env.NODE_ENV === 'production' ? prod : dev
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: currentPlugin
}
