
export const validEmail: RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const url = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
export const bankName = RegExp("^[A-Za-z]+$");

export const phoneNoFormat = (data: string): string => {
    if (data && data.length == 10) {
        const front = data.slice(0, 3);
        const back3 = data.slice(3, 6);
        const last4 = data.slice(6, 10);
        return `+1 (${front}) ${back3}-${last4}`
    } else {
        const frontFirst = data.slice(0, 2)
        const front = data.slice(2, 5);
        const back = data.slice(5, 8);
        const last = data.slice(8, 12);
        return `${frontFirst} (${front}) ${back}-${last}`
    }
}
