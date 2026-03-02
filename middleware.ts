import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

const htmlPages = new Set([
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
]);

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/ranking") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/index.html";
    return NextResponse.rewrite(url);
  }

  const slug = pathname.replace(/^\/+|\/+$/g, "");

  if (htmlPages.has(slug)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${slug}.html`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
