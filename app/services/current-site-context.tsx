import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";
import type { Site } from "~/types";

interface Props {
  initialSiteValue: Site;
  children: React.ReactNode;
}

// create contexts
const CurrentSiteContextState = createContext<Site | null>(null);
const CurrentSiteContextDispatch = createContext<
  Dispatch<SetStateAction<Site | null>>
>(() => {});

// context consumer hook
const useCurrentSite = () => {
  // get the context
  const context = useContext(CurrentSiteContextState);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error("useCurrentSite was used outside of its Provider");
  }

  return context;
};

// context consumer hook
const useCurrentSiteDispatch = () => {
  // get the context
  const context = useContext(CurrentSiteContextDispatch);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error("useCurrentSiteDispatch was used outside of its Provider");
  }

  return context;
};

const CurrentSiteContextProvider = ({ initialSiteValue, children }: Props) => {
  // the value that will be given to the context
  const [currentSite, setUser] = useState<Site | null>(initialSiteValue);

  return (
    // the Providers gives access to the context to its children
    <CurrentSiteContextState.Provider value={currentSite}>
      <CurrentSiteContextDispatch.Provider value={setUser}>
        {children}
      </CurrentSiteContextDispatch.Provider>
    </CurrentSiteContextState.Provider>
  );
};

export { CurrentSiteContextProvider, useCurrentSite, useCurrentSiteDispatch };
