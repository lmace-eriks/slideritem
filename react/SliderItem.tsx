import React, { ReactChildren, useEffect, useRef, useState } from "react";
import { canUseDOM } from "vtex.render-runtime";

// Styles
import styles from "./styles.css";

interface SliderItemProps {
  title: string
  subtitle: string
  cta: string
  desktopImage: string
  mobileImage: string
  blockClass: string
}

const SliderItem: StorefrontFunctionComponent<SliderItemProps> = ({ title, subtitle, cta, desktopImage, mobileImage, blockClass }) => {

  useEffect(() => {
    console.log({ title, subtitle, cta, desktopImage, mobileImage, blockClass });
  }, [])

  return (
    <div>Hello World</div>
  )
}

SliderItem.schema = {
  title: "Slider Item",
  description: "",
  type: "object",
  properties: {

  }
}

export default SliderItem;