import React from "react";
import { Link } from "vtex.render-runtime";

// Styles
import styles from "./styles.css";

interface SliderItemProps {
  titleTag: string
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  ctaAriaLabel: string
  alt: string
  desktopImage: string
  mobileImage: string
  blockClass: string
  loadingPriority: boolean
}

interface PictureTagProps {
  backgroundImage: boolean
}

const SliderItem: StorefrontFunctionComponent<SliderItemProps> = ({ titleTag, alt, title, subtitle, ctaText, ctaLink, desktopImage, mobileImage, blockClass, ctaAriaLabel, loadingPriority }) => {
  const defaultTag = "div";
  const CustomTag: any = !titleTag ? `${defaultTag}` : `${titleTag}`;

  const PictureTag = (props: PictureTagProps) => (
    <picture>
      {/* @ts-expect-error */}
      <source media="(min-width:1026px)" srcSet={desktopImage} width={1536} height={864} />
      {/* @ts-expect-error */}
      <source media="(max-width:1025px)" srcSet={mobileImage} width={450} height={450} />

      <img src={mobileImage}
        alt={props.backgroundImage ? "" : alt || title}
        loading={loadingPriority ? "eager" : "lazy"}
        // @ts-expect-error
        fetchPriority={props.backgroundImage ? "low" : loadingPriority ? "high" : "low"}
        className={props.backgroundImage ? `${styles.backgroundImage}--${blockClass}` : `${styles.sliderImage}--${blockClass}`}
        width={450} height={450} />
    </picture>
  );

  const ValidSlider = () => (
    <div className={`${styles.sliderContainer}--${blockClass}`}>
      <div className={`${styles.sliderWrapper}--${blockClass}`}>
        <div className={`${styles.backgroundImageContainer}--${blockClass}`}>
          <PictureTag backgroundImage={true} />
        </div>
        <div className={`${styles.sliderImageContainer}--${blockClass}`}>
          <PictureTag backgroundImage={false} />
        </div>
        <div className={`${styles.textContainer}--${blockClass}`}>
          {title && <CustomTag className={`${styles.sliderTitle}--${blockClass}`}>{title}</CustomTag>}
          {subtitle && <div className={`${styles.sliderSubtitle}--${blockClass}`}>{subtitle}</div>}
          {ctaText && <Link href={ctaLink} aria-label={ctaAriaLabel} className={`${styles.sliderCallToAction}--${blockClass}`}>{ctaText}</Link>}
        </div>
      </div>
    </div>
  )

  return <ValidSlider />;
}

SliderItem.schema = {
  title: "Slider Item",
  description: "",
  type: "object",
  properties: {
    desktopImage: {
      title: "Desktop Image- 1536 x 864 - 300KB",
      type: "string",
      description: "Required | .jpg only | Absolute Path.",
      widget: { "ui:widget": "image-uploader" }
    },
    mobileImage: {
      title: "Mobile Image - 450 x 450 - 50KB",
      type: "string",
      widget: { "ui:widget": "image-uploader" }
    },
    title: {
      title: "Title",
      type: "string",
      description: "Optional | Title Text.",
      widget: { "ui:widget": "textarea" }
    },
    subtitle: {
      title: "Sub Title",
      type: "string",
      description: "Optional | Sub Title Text.",
      widget: { "ui:widget": "textarea" }
    },
    titleTag: {
      title: "Title Element Tag",
      type: "string",
      description: "h1, h2... Defaults to div."
    },
    ctaText: {
      title: "Call To Action Text",
      type: "string",
      description: "Optional | Button Text.",
      widget: { "ui:widget": "textarea" }
    },
    ctaLink: {
      title: "Call To Action Link",
      type: "string",
      description: "Required with Call To Action | Button Link.",
      widget: { "ui:widget": "textarea" }
    },
    ctaAriaLabel: {
      title: "Call To Action Aria Label",
      type: "string",
      description: "Required with Call To Action | Button Link. Gives screen readers more context than simply 'Click Here'.",
      widget: { "ui:widget": "textarea" }
    },
    alt: {
      title: "Alt Text",
      type: "string",
      description: "Optional | Alt Text for image. Defaults to Title text if blank.",
      widget: { "ui:widget": "textarea" }
    },
    loadingPriority: {
      title: "Largest Contentful Paint",
      type: "boolean"
    }
  }
}

export default SliderItem;
