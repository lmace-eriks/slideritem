import React, { useEffect, useMemo, useRef, useState } from "react";
import { canUseDOM } from "vtex.render-runtime";

// Styles
import styles from "./styles.css";

interface SliderItemProps {
  titleTag: string
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  alt: string
  desktopImage: string
  mobileImage: string
  blockClass: string
  imageLoading: "lazy" | "eager" | undefined
  desktopWidth: number
  desktopHeight: number
  mobileWidth: number
  mobileHeight: number
}

const SliderItem: StorefrontFunctionComponent<SliderItemProps> = ({ titleTag, alt, title, subtitle, ctaText, ctaLink, desktopImage, mobileImage, blockClass, imageLoading, desktopWidth, desktopHeight, mobileWidth, mobileHeight }) => {
  const openGate = useRef(true);
  // const userDevice = useRef("");
  const [userDevice, setUserDevice] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Default to eagar loading for hero images - LM
  imageLoading = imageLoading || "eager";

  const defaultTag = "div";
  const CustomTag: any = !titleTag ? `${defaultTag}` : `${titleTag}`;

  const mobileImageMaxWidth = useMemo(() => 450, []);
  const mobileImageMaxSize = useMemo(() => 50000, []);

  const desktopImageMaxWidth = useMemo(() => 1536, []);
  const desktopImageMaxSize = useMemo(() => 300000, []);

  desktopWidth = desktopWidth || desktopImageMaxWidth;
  desktopHeight = desktopHeight || 864;
  mobileWidth = mobileWidth || mobileImageMaxWidth;
  mobileHeight = mobileHeight || 450;

  useEffect(() => {
    if (!openGate.current || !canUseDOM) return;
    openGate.current = false;

    getWindowSize();
    const windowLocation = window.location.href;
    const windowIsAdmin = windowLocation.includes("siteEditor=true");

    if (windowIsAdmin) {
      setIsAdmin(windowIsAdmin);
      getMobileImage();
    }
    setLoading(false);
  })

  const getWindowSize = () => {
    if (!canUseDOM) return;
    // userDevice.current = window.innerWidth <= 1025 ? "mobile" : "desktop";
    setUserDevice(window.innerWidth <= 1025 ? "mobile" : "desktop");
  }

  const bytesToKb = (b: number) => b / 1000;

  const getMobileImage = () => {
    const tempMobileImage = new Image();
    tempMobileImage.src = mobileImage;

    const xmlRequest = new XMLHttpRequest();
    xmlRequest.open("GET", mobileImage);
    xmlRequest.responseType = "blob";

    xmlRequest.onload = () => {
      const blob = xmlRequest.response;
      verifyMobileImage(blob.size, blob.type, tempMobileImage.width);
    }
    xmlRequest.send();
  }

  const verifyMobileImage = (imageSize: number, imageType: string, imageWidth: number) => {
    const fileSizePassed = imageSize <= mobileImageMaxSize;
    const imageWidthPassed = imageWidth <= mobileImageMaxWidth;
    const fileFormatPassed = imageType === "image/pjpeg" || imageType === "image/jpeg" || imageType === "image/jpg" || imageType === "image/webp";

    // Mobile Image is not defined
    if (!mobileImage) {
      setErrorMessage(`Mobile Image Not Defined.`);
      return;
    }

    // Mobile Image is not broken URL
    if (!fileFormatPassed) {
      setErrorMessage(`Mobile Image Not Found.`);
      return;
    }

    // Mobile Image is less than or equal to defined width
    if (!imageWidthPassed) {
      setErrorMessage(`Mobile Image Width Too Wide. Maximum is ${mobileImageMaxWidth} pixels. Image provided is ${imageWidth} pixels.`);
      return;
    }

    // Mobile Image file size is not too large
    if (!fileSizePassed) {
      setErrorMessage(`Mobile Image File Size Too Large. Maximum is ${bytesToKb(mobileImageMaxSize)} Kb. Image provided is ${bytesToKb(imageSize)} Kb.`);
      return;
    }

    setErrorMessage("");
    getDesktopImage();
  }

  const getDesktopImage = () => {
    const tempDesktopImage = new Image();
    tempDesktopImage.src = desktopImage;

    const xmlRequest = new XMLHttpRequest();
    xmlRequest.open("GET", desktopImage);
    xmlRequest.responseType = "blob";

    xmlRequest.onload = () => {
      const blob = xmlRequest.response;
      verifyDesktopImage(blob.size, blob.type, tempDesktopImage.width);
    }
    xmlRequest.send();
  }

  const verifyDesktopImage = (imageSize: number, imageType: string, imageWidth: number) => {
    const fileSizePassed = imageSize <= desktopImageMaxSize;
    const imageWidthPassed = imageWidth <= desktopImageMaxWidth;
    const fileFormatPassed = imageType === "image/pjpeg" || imageType === "image/jpeg" || imageType === "image/jpg" || imageType === "image/webp"

    // Desktop Image is not defined
    if (!desktopImage) {
      setErrorMessage(`Desktop Image Not Defined.`);
      return;
    }

    // Desktop Image is not broken URL
    if (!fileFormatPassed) {
      setErrorMessage(`Desktop Image Not Found.`);
      return;
    }

    // Desktop Image is less than or equal to defined width
    if (!imageWidthPassed) {
      setErrorMessage(`Desktop Image Width Too Wide. Maximum is ${desktopImageMaxWidth} pixels. Image provided is ${imageWidth} pixels.`);
      return;
    }

    // Desktop Image file size is not too large
    if (!fileSizePassed) {
      setErrorMessage(`Desktop Image File Size Too Large. Maximum is ${bytesToKb(desktopImageMaxSize)} Kb. Image provided is ${bytesToKb(imageSize)} Kb.`);
      return;
    }

    setErrorMessage("");
  }

  const imageSize = (dim: string) => {
    // return "" + userDevice.current === "mobile" ? dim === "w" ? mobileWidth : mobileHeight : dim === "w" ? desktopWidth : desktopHeight;
    return "" + userDevice === "mobile" ? dim === "w" ? mobileWidth : mobileHeight : dim === "w" ? desktopWidth : desktopHeight;
  }

  const ValidSlider = () => (
    <div className={`${styles.sliderContainer}--${blockClass}`}>
      <div className={`${styles.sliderWrapper}--${blockClass}`}>
        <div className={`${styles.textContainer}--${blockClass}`}>
          {title && <CustomTag className={`${styles.sliderTitle}--${blockClass}`}>{title}</CustomTag>}
          {subtitle && <div className={`${styles.sliderSubtitle}--${blockClass}`}>{subtitle}</div>}
          {ctaText && <a href={ctaLink} className={`${styles.sliderCallToAction}--${blockClass}`}>{ctaText}</a>}
        </div>
        <div className={`${styles.sliderImageContainer}--${blockClass}`}>
          <picture>
            {/* @ts-expect-error */}
            <source media="(min-width:1026px)" srcSet={desktopImage} width={desktopWidth} height={desktopHeight} />
            {/* @ts-expect-error */}
            <source media="(max-width:1025px)" srcSet={mobileImage} width={mobileWidth} height={mobileHeight} />
            <img src={mobileImage} alt={alt || title} loading={imageLoading} className={`${styles.sliderImage}--${blockClass}`} width={imageSize("w")} height={imageSize("h")} />
          </picture>
        </div>
        <div className={`${styles.backgroundImageContainer}--${blockClass}`}>
          <picture>
            {/* @ts-expect-error */}
            <source media="(min-width:1026px)" srcSet={desktopImage} width={desktopWidth} height={desktopHeight} />
            {/* @ts-expect-error */}
            <source media="(max-width:1025px)" srcSet={mobileImage} width={mobileWidth} height={mobileHeight} />
            <img src={mobileImage} loading={imageLoading} className={`${styles.backgroundImage}--${blockClass}`} alt="" width={imageSize("w")} height={imageSize("h")} />
          </picture>
        </div>
      </div>
    </div>
  )

  const ErrorElement = () => (
    <div className={`${styles.sliderContainer}--${blockClass}`}>
      <div style={{ color: "red", fontWeight: "bold", textAlign: "center", padding: "1rem", margin: "5rem" }}>
        {errorMessage}
      </div>
    </div>
  )

  const LoadingElement = () => (
    <img data-device={userDevice} style={{ maxHeight: userDevice === "desktop" ? "60vh" : "100%" }} src="https://eriksbikeshop.vtexassets.com/arquivos/white-loading.gif" width={imageSize("w")} height={imageSize("h")} />
  )

  if (loading) {
    return <LoadingElement />
  } else {
    return !isAdmin ? <ValidSlider /> : errorMessage ? <ErrorElement /> : <ValidSlider />;
  }
}

SliderItem.schema = {
  title: "Slider Item",
  description: "",
  type: "object",
  properties: {
    title: {
      title: "Title",
      type: "string",
      description: "Optional | Title Text."
    },
    titleTag: {
      title: "Title Element Tag",
      type: "string",
      description: "h1, h2... Defaults to div."
    },
    subtitle: {
      title: "Sub Title",
      type: "string",
      description: "Optional | Sub Title Text."
    },
    ctaText: {
      title: "Call To Action Text",
      type: "string",
      description: "Optional | Button Text."
    },
    ctaLink: {
      title: "Call To Action Link",
      type: "string",
      description: "Required with Call To Action | Button Link."
    },
    alt: {
      title: "Alt Text",
      type: "string",
      description: "Optional | Alt Text for image. Defaults to Title text if blank."
    },
    desktopImage: {
      title: "Desktop Image Path",
      type: "string",
      description: "Required | .jpg only | Absolute Path."
    },
    mobileImage: {
      title: "Mobile Image Path",
      type: "string",
      description: "Required | .jpg only | Absolute Path."
    }
  }
}

export default SliderItem;