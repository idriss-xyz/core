import { useState } from 'react';

export const useMobileFilter = () => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  return {
    showMobileFilter,
    setShowMobileFilter,
  };
};
