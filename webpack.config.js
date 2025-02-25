const process = require('process');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const marked = require('marked');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const cssnano = require('cssnano');
const { InjectManifest } = require('workbox-webpack-plugin');

const skMessages = require('./src/translations/sk-shared.json');
const csMessages = require('./src/translations/cs-shared.json');
const enMessages = require('./src/translations/en-shared.json');
const huMessages = require('./src/translations/hu-shared.json');

const prod = process.env.DEPLOYMENT && process.env.DEPLOYMENT !== 'dev';

const fastDev = !prod && !process.env.DISABLE_FAST_DEV;

const renderer = new marked.Renderer();

renderer.link = (href, title, text) =>
  `<a href="${href}" title="${title ?? ''}">${text}</a>`;

const htmlPluginProps = {
  filename: 'index.html',
  template: 'index.ejs',
  inject: false,
  templateParameters: {
    lang: 'en',
    title: enMessages.title,
    description: enMessages.description,
    errorHtml:
      '<h1>Problem starting application</h1>' +
      '<p>Please make sure you are using recent version of a modern browser (Google Chrome, Firefox, Safari, Opera, Edge, Chromium, Vivaldi, Brave, …).</p>',
    nojsMessage:
      'JavaScript enabled browser is required to run this application.',
    loadingMessage: 'Loading…',
  },
};

module.exports = {
  mode: prod ? 'production' : 'development',
  context: path.resolve(__dirname, 'src'),
  entry: './index.tsx',
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      fm3: path.resolve(__dirname, 'src'),
      pica: 'pica/dist/pica.js',
    },
    fallback: {
      util: require.resolve('util/'), // for typescript-is avter upgrading webpack from 4 to 5
    },
  },
  optimization: {
    // moduleIds: 'deterministic',
    minimizer: ['...', new CssMinimizerPlugin()],
  },
  // more info: https://webpack.js.org/configuration/devtool/
  devtool: prod ? 'source-map' : 'cheap-module-source-map',
  module: {
    rules: [
      // see https://github.com/Leaflet/Leaflet/issues/7403
      {
        enforce: 'pre',
        test: /\bnode_modules\/leaflet\/dist\/leaflet-src\.js/,
        loader: 'string-replace-loader',
        options: {
          search: '(win && chrome) ? 2 * window.devicePixelRatio :',
          replace:
            "(win && chrome || navigator.platform.indexOf('Linux') === 0) ? 2 * window.devicePixelRatio :",
          strict: true,
        },
      },
      {
        // babelify some too modern libraries
        test: /\bnode_modules\/.*\/?(exifreader|strict-uri-encode|query-string|split-on-first|leaflet|@?react-leaflet)\/.*\.js$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: ['> 0.5%'],
                },
              },
            ],
          ],
        },
      },
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            compiler: 'ttypescript', // this is for typescript-is
            transpileOnly: fastDev,
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff|ttf|eot|woff2)$/,
        type: 'asset/resource',
      },
      {
        test: /\.scss$/,
        use: [
          prod
            ? {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: (resourcePath, context) => {
                    return (
                      path.relative(path.dirname(resourcePath), context) + '/'
                    );
                  },
                },
              }
            : 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.overpass$/,
        loader: '../overpass-loader',
      },
      {
        test: /\.css$/,
        use: [
          prod
            ? {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: (resourcePath, context) => {
                    return (
                      path.relative(path.dirname(resourcePath), context) + '/'
                    );
                  },
                },
              }
            : 'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'markdown-loader',
            options: {
              renderer,
            },
          },
        ],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ],
  },
  plugins: [
    new InjectManifest({
      swSrc: './sw/sw.ts',
      maximumFileSizeToCacheInBytes: 100000000,
    }),
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        enabled: !fastDev,
        files: './**/*.{ts,tsx,js,jsx}',
      },
      typescript: {
        configFile: path.resolve(__dirname, './tsconfig.json'),
      },
      async: fastDev,
    }),
    new webpack.EnvironmentPlugin({
      ...(prod ? { NODE_ENV: 'production' } : null), // for react
      BROWSER: true,
      DEPLOYMENT: process.env.DEPLOYMENT ?? null,
      FM_MAPSERVER_URL:
        process.env.FM_MAPSERVER_URL || 'https://outdoor.tiles.freemap.sk',
      MAX_GPX_TRACK_SIZE_IN_MB: 15,
      BASE_URL:
        {
          www: 'https://www.freemap.sk',
          next: 'https://next.freemap.sk',
        }[process.env.DEPLOYMENT] || 'https://local.freemap.sk:9000',
      API_URL:
        {
          www: 'https://backend.freemap.sk',
          next: 'https://backend.freemap.sk',
        }[process.env.DEPLOYMENT] || 'https://local.freemap.sk:3000',
      GA_MEASUREMENT_ID:
        { www: 'UA-89861822-3', next: 'UA-89861822-4' }[
          process.env.DEPLOYMENT
        ] || null,
      FB_APP_ID:
        { www: '681854635902254', next: '681854635902254' }[
          process.env.DEPLOYMENT
        ] || null,
      ROVAS_URL_PREFIX:
        {
          www: 'https://rovas.app/rewpro?paytype=project&recipient=35384',
          next: 'https://rovas.app/rewpro?paytype=project&recipient=35384',
        }[process.env.DEPLOYMENT] ||
        'https://dev.merit.world/rewpro?paytype=project&recipient=24130',
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(htmlPluginProps), // fallback for dev
    new HtmlWebpackPlugin({
      ...htmlPluginProps,
      filename: 'index-en.html',
    }),
    new HtmlWebpackPlugin({
      ...htmlPluginProps,
      filename: 'index-sk.html',
      templateParameters: {
        lang: 'sk',
        title: skMessages.title,
        description: skMessages.description,
        errorHtml:
          '<h1>Aplikáciu sa nepodarilo spustiť</h1>' +
          '<p>Uistite sa, že používate aktuálnu verziu niektorého zo súčasných prehliadačov (Google Chrome, Firefox, Safari, Opera, Edge, Chromium, Vivaldi, Brave, …).<p>',
        nojsMessage:
          'Aplikácia vyžaduje prehliadač so zapnutou podporou JavaScriptu.',
        loadingMessage: 'Načítavam…',
      },
    }),
    new HtmlWebpackPlugin({
      ...htmlPluginProps,
      filename: 'index-cs.html',
      templateParameters: {
        lang: 'cs',
        title: csMessages.title,
        description: csMessages.description,
        errorHtml:
          '<h1>Aplikaci se nepodařilo spustit</h1>' +
          '<p>Ujistěte se, že používáte aktuální verzi některého ze současných prohlížečů (Google Chrome, Firefox, Safari, Opera, Edge, Chromium, Vivaldi, Brave, …).<p>',
        nojsMessage:
          'Aplikace vyžaduje prohlížeč se zapnutou podporou JavaScriptu.',
        loadingMessage: 'Načítám…',
      },
    }),
    new HtmlWebpackPlugin({
      ...htmlPluginProps,
      filename: 'index-hu.html',
      templateParameters: {
        lang: 'hu',
        title: huMessages.title,
        description: huMessages.description,
        errorHtml:
          '<h1>Hiba történt az alkalmazás elindításánál</h1>' +
          '<p>Győződjék meg arról, hogy egy modern böngésző (Google Chrome, Firefox, Safari, Opera, Edge, Chromium, Vivaldi, Brave, …) friss verzióját használja.</p>',
        nojsMessage:
          'Az alkalmazás futtatásához JavaScriptet támogató böngészőre van szükség.',
        loadingMessage: 'Loading…', // TODO translate
      },
    }),
    new WebpackPwaManifest({
      inject: true,
      ios: true,
      publicPath: '/',
      name: 'Freemap Slovakia',
      short_name: 'Freemap',
      description:
        'Freemap je voľne dostupná online mapa Slovenska založená na dátach z OpenStreetMap',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      'theme-color': '#ffffff',
      display: 'standalone',
      dir: 'auto',
      icons: [
        {
          src: path.resolve('src/images/freemap-logo-small.png'),
          sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
        },
      ],
      orientation: 'any',
      share_target: {
        action: '/',
        method: 'POST',
        enctype: 'multipart/form-data',
        params: {
          title: 'title',
          text: 'text',
          url: 'url',
          files: [
            {
              name: 'file',
              accept: ['image/jpeg', 'application/gpx+xml'],
            },
          ],
        },
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'static/**/*',
          to: '[name][ext]',
          globOptions: { dot: true },
        },
      ],
    }),
    prod &&
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].[chunkhash].css',
        chunkFilename: '[name].[chunkhash].css',
      }),
    new webpack.ContextReplacementPlugin(
      /intl\/locale-data\/jsonp$/,
      /(sk|cs|en)\.tsx/,
    ),
  ].filter((x) => x),
  devServer: {
    allowedHosts: 'all',
  },
};
