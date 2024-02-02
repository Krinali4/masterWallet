export default class JsonUtils {
  public static getUndValue(undJsonElement: any): string | null {
    if (undJsonElement && !Array.isArray(undJsonElement)) {
      return undJsonElement.und![0].value;
    }
    return null;
  }

  public static getUndProfilePicUrlValue(undJsonElement: any): string | null {
    if (undJsonElement && !Array.isArray(undJsonElement)) {
      if (undJsonElement.und![0].fid && undJsonElement.und![0].full_url) {
        return undJsonElement.und![0].full_url;
      }
    }
    return null;
  }

  private constructor() { }
}
