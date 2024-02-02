export default class LocalStorageUtils {
    private static slocalStorageAvailable: Boolean;
    private static sSessionStorageAvailable: Boolean;

    private static LOCAL_STORAGE = "localStorage";
    private static SESSION_STORAGE = "sessionStorage";

    private constructor() { }

    public static storeItem(key: string, value: any): boolean {
        if (LocalStorageUtils.localStorageAvailable()) {
            localStorage.setItem(key, value);
            return true;
        } else if (LocalStorageUtils.sessionStorageAvailable()) {
            sessionStorage.setItem(key, value);
            return true;
        }
        return false;
    }

    public static getItem(key: string): string | null {
        if (LocalStorageUtils.localStorageAvailable()) {
            return localStorage.getItem(key);
        } else if (LocalStorageUtils.sessionStorageAvailable()) {
            return sessionStorage.getItem(key);
        }
        return null;
    }

    public static storeItemObject(key: any, value: any): boolean {
        if (LocalStorageUtils.localStorageAvailable()) {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } else if (LocalStorageUtils.sessionStorageAvailable()) {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        }
        return false;
    }

    public static getItemObject(key: any): any | null {
        if (LocalStorageUtils.localStorageAvailable()) {
            return JSON.parse(localStorage.getItem(key));
        } else if (LocalStorageUtils.sessionStorageAvailable()) {
            return JSON.parse(sessionStorage.getItem(key));
        }
        return null;
    }

    public static localStorageAvailable() {
        if (!LocalStorageUtils.slocalStorageAvailable) {
            LocalStorageUtils.slocalStorageAvailable = LocalStorageUtils.storageAvailable(
                this.LOCAL_STORAGE
            );
        }

        return this.slocalStorageAvailable;
    }

    public static sessionStorageAvailable() {
        if (!LocalStorageUtils.sSessionStorageAvailable) {
            LocalStorageUtils.sSessionStorageAvailable = LocalStorageUtils.storageAvailable(
                this.SESSION_STORAGE
            );
        }

        return this.sSessionStorageAvailable;
    }

    public static storageAvailable(type: any) {
        var storage = window[type],
        x = "__storage_test__";
        
        try {
           
            // storage.setItem(x, x);
            // storage.removeItem(x);
            return true;
        } catch (e) {
            return (
                e instanceof DOMException &&
                // everything except Firefox
                (e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // test name field too, because code might not be present
                    // everything except Firefox
                    e.name === "QuotaExceededError" ||
                    // Firefox
                    e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage.length !== 0
            );
        }
    }
}