"use client";

import {useEffect} from "react";

const bodyClasses = [
  "tennisclub_body",
  "body_style_wide",
  "body_filled",
  "article_style_stretch",
  "top_panel_show",
  "top_panel_above",
  "top_panel_fixed",
];

export default function BodyClassSetter() {
  useEffect(() => {
    const {classList} = document.body;
    bodyClasses.forEach((name) => classList.add(name));

    return () => {
      bodyClasses.forEach((name) => classList.remove(name));
    };
  }, []);

  return null;
}
