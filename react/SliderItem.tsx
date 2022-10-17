import React, { useEffect, useMemo, useState } from "react";
import { canUseDOM } from "vtex.render-runtime";

// Styles
import styles from "./styles.css";

interface SliderItemProps {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  desktopImage: string
  mobileImage: string
  blockClass: string
}

const SliderItem: StorefrontFunctionComponent<SliderItemProps> = ({ title, subtitle, ctaText, ctaLink, desktopImage, mobileImage, blockClass }) => {
  // const [openGate, setOpenGate] = useState(true);
  // const [mobileImagePass, setMobileImagePass] = useState(false);
  // const [desktopImagePass, setDesktopImagePass] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const mobileImageMaxWidth = useMemo(() => 450, []);
  const mobileImageMaxSize = useMemo(() => 50000, []);

  const desktopImageMaxWidth = useMemo(() => 1536, []);
  const desktopImageMaxSize = useMemo(() => 300000, []);

  useEffect(() => {
    // console.clear();
    if (!canUseDOM) return;

    const windowLocation = window.location.href;
    const windowIsAdmin = windowLocation.includes("siteEditor=true");
    setIsAdmin(windowIsAdmin);

    if (windowIsAdmin) getMobileImage();
  })

  // useEffect(() => {
  //   if (errorMessage) setMobileImagePass(false);
  // }, [errorMessage])

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
      console.log(imageType);
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

  const ValidSlider = () => (
    <div className={`${styles.sliderContainer}--${blockClass}`}>
      <div className={`${styles.sliderWrapper}--${blockClass}`}>
        <div className={`${styles.textContainer}--${blockClass}`}>
          <div className={`${styles.sliderTitle}--${blockClass}`}>{title}</div>
          {subtitle && <div className={`${styles.sliderSubtitle}--${blockClass}`}>{subtitle}</div>}
          <a href={ctaLink} className={`${styles.sliderCallToAction}--${blockClass}`}>{ctaText}</a>
        </div>
        <div className={`${styles.sliderImageContainer}--${blockClass}`}>
          <picture>
            <source media="(min-width:1026px)" srcSet={desktopImage} />
            <source media="(max-width:1025px)" srcSet={mobileImage} />
            <img src={mobileImage} alt={title} className={`${styles.sliderImage}--${blockClass}`} />
          </picture>
        </div>
        <div className={`${styles.backgroundImageContainer}--${blockClass}`}>
          <picture>
            <source media="(min-width:1026px)" srcSet={desktopImage} />
            <source media="(max-width:1025px)" srcSet={mobileImage} />
            <img src={mobileImage} className={`${styles.backgroundImage}--${blockClass}`} />
          </picture>
        </div>
      </div>
    </div>
  )

  const ErrorElement = () => (
    <div className={`${styles.sliderContainer}--${blockClass}`}>
      <div style={{ color: "red", fontWeight: "bold", textAlign: "center", padding: "1rem", margin: "5rem" }}>{errorMessage}</div>
    </div>
  )

  return !isAdmin ? <ValidSlider /> : errorMessage ? <ErrorElement /> : <ValidSlider />
}

SliderItem.schema = {
  title: "Slider Item",
  description: "",
  type: "object",
  properties: {
    title: {
      title: "Title",
      type: "string",
      description: "Required | Title Text."
    },
    subtitle: {
      title: "Sub Title",
      type: "string",
      description: "Optional | Sub Title Text."
    },
    ctaText: {
      title: "Call To Action Text",
      type: "string",
      description: "Required | Button Text."
    },
    ctaLink: {
      title: "Call To Action Link",
      type: "string",
      description: "Required | Button Link."
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