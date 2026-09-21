/** @type {import('next').NextConfig} */
const nextConfig = {
  // The site is deployed to IIS as plain files. `export` writes a fully static
  // `out/` directory with no Node runtime, so nothing here may use server
  // rendering, route handlers, middleware, or ISR.
  output: 'export',

  // This directory sits beside ../api and ../app, each with its own lockfile.
  // Turbopack finds the workspace root by walking up until it hits one, so
  // without this it can decide the root is the parent folder and resolve
  // modules from the wrong tree.
  turbopack: { root: import.meta.dirname },

  // IIS serves a directory by its default document. With trailing slashes every
  // route becomes `<route>/index.html`, which IIS resolves without the URL
  // Rewrite module being installed.
  trailingSlash: true,

  // next/image's optimizer needs a server. Static export has none, so images are
  // emitted untouched and sized by the markup.
  images: { unoptimized: true },

  // A build that does not typecheck should fail here, not in IIS.
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
