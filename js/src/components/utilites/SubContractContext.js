import React, { createContext, useState } from 'react';

export const SubContractContext = createContext();

export const SubContractProvider = ({ children }) => {
  const [subContractAddress, setSubContractAddress] = useState(null);
  // console.log(subContractAddress);
  const [anotherAddress, setAnotherAddress] = useState(null);
  // console.log(anotherAddress);
  const [VisaAddress, setVisaAddress] = useState(null);
  // console.log(VisaAddress);
  return (
    <SubContractContext.Provider value={{ subContractAddress, setSubContractAddress, anotherAddress, setAnotherAddress, VisaAddress, setVisaAddress }}>
      {children}
    </SubContractContext.Provider>
  );
};
