import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ootomonaiso blog',
  tagline: '大友内装(粒)の技術ブログ',
  favicon: 'img/favicon.ico',
  url: 'https://ootomonaiso.github.io',
  baseUrl: '/',

  organizationName: 'ootomonaiso',
  projectName: 'ootomonaiso_strage',  

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'NetWork',
        path: 'NetWork',
        routeBasePath: 'NetWork',
        sidebarPath: require.resolve('./sidebars.js'),
        editUrl: 'https://github.com/ootomonaiso/ootomonaiso_strage',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'IT_gyoumu',
        path: 'IT_gyoumu',
        routeBasePath: 'IT_gyoumu',
        sidebarPath: require.resolve('./sidebars.js'),
        editUrl: 'https://github.com/ootomonaiso/ootomonaiso_strage',
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        defaultMode: 'dark'
      },
      navbar: {
        title: 'ootomonaiso blog',
        logo: {
          alt: 'logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/docs/intro',
            position: 'left',
            label: '自己紹介',
          },
          {
            to: '/blog',
            label: 'Blog', 
            position: 'left'
          },
          {
            to: '/NetWork/intro',
            position: 'left',
            label: 'NetWork',
          },
          {
            to: '/IT_gyoumu/intro',
            position: 'left',
            label: '業務用ITソフトウェア',
          },
          {
            href: 'https://github.com/ootomonaiso',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'ドキュメント',
            items: [
              {
                label: '自己紹介',
                to: '/docs/intro',
              },
              {
                label: 'NetWork',
                to: '/NetWork/intro',
              },
              {
                label: '業務用ITソフトウェア',
                to: '/IT_gyoumu/intro',
              },
            ],
          },
          {
            title: 'SNSアカウント',
            items: [
              {
                label: 'Twitter',
                href: 'https://x.com/ootomonaiso',
              },
              {
                label: 'Bluesky',
                href: 'https://bsky.app/profile/ootomonaiso.bsky.social',
              },
            ],
          },
          {
            title: 'その他',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/ootomonaiso',
              },
            ],
          },
        ],
        copyright: ` © ${new Date().getFullYear()} 大友内装(粒)`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
  customFields: {
    geminiApiKey: process.env.REACT_APP_GEMINI_API_KEY,
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL,
    supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
  },
  clientModules: [
    require.resolve('./src/clientModules/chatWidget.js'),
  ],
};

export default config;
