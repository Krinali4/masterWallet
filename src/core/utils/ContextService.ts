import React, { createContext } from "react";
import { iContextService, iContextSideBarService } from "./iContextService";

const ContextService = createContext<iContextService>({
    accessTokenValid: false,
    setAccessTokenValid: () => { }
});

export default ContextService;