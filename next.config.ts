import type {NextConfig} from "next";

const htmlPages = [
  "index",
  "about-us",
  "blog-classic",
  "blog-colored-excerpt",
  "blog-masonry",
  "blog-portfolio",
  "calendario",
  "cart",
  "checkout",
  "contacts",
  "court-reservation",
  "ene26",
  "event",
  "event2",
  "feb26",
  "homepage-2",
  "mar26",
  "membership",
  "nosotros",
  "our-team",
  "page-404",
  "page-tag",
  "player-profile",
  "post-audio",
  "post-formats",
  "post-gallery",
  "post-single",
  "post-single-wide",
  "post-video",
  "post-without-image",
  "post1",
  "post2",
  "reservation",
  "shop",
  "shop-list",
  "shop-product-page",
  "shortcodes",
  "tennis-lessons",
  "typography",
];

const nextConfig: NextConfig = {
  async rewrites() {
    const routes = htmlPages
      .filter((page) => page !== "index")
      .map((page) => ({
        source: `/${page}`,
        destination: `/${page}.html`,
      }));

    return [
      {source: "/", destination: "/index.html"},
      {source: "/index", destination: "/index.html"},
      ...routes,
    ];
  },
};

export default nextConfig;
