import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      {/* Google Analytics Code */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
      <script dangerouslySetInnerHTML={{ __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-XC0YV5HES3');
      ` }} />
    </footer>
  );
};

export default Footer;
