import React, { useEffect } from 'react';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const GoogleAd = () => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {},
      );
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle adbanner-customize block"
      data-ad-format="fluid"
      data-ad-client={`ca-pub-${publicRuntimeConfig.GOOGlE_AD_ID}`}
      data-ad-slot={publicRuntimeConfig.GOOGlE_AD_SLOT_TEST}
      data-ad-layout-key={publicRuntimeConfig.GOOGLE_AD_LAYOUT_TEST}
      data-full-width-responsive
    />
  );
};

export default GoogleAd;
